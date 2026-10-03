import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "google-config": {
        const { data } = await adminClient.from("app_settings").select("key,value").in("key", ["google_client_id", "google_client_secret"]);
        const m = Object.fromEntries((data || []).map((r: { key: string; value: string }) => [r.key, r.value]));
        const sec = m.google_client_secret || "";
        return new Response(JSON.stringify({
          clientId: m.google_client_id || "",
          secretSaved: !!sec,
          secretHint: sec ? `••••${sec.slice(-4)}` : "",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "save-google-config": {
        const body = await req.json();
        const clientId = String(body.clientId || "").trim();
        const clientSecret = String(body.clientSecret || "").trim();
        if (!/^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/i.test(clientId)) throw new Error("Client ID should look like 1234-abc.apps.googleusercontent.com");
        const rows = [{ key: "google_client_id", value: clientId, updated_at: new Date().toISOString() }];
        if (clientSecret) {
          if (clientSecret.length < 10) throw new Error("Client Secret looks too short");
          rows.push({ key: "google_client_secret", value: clientSecret, updated_at: new Date().toISOString() });
        }
        const { error } = await adminClient.from("app_settings").upsert(rows);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "list-users": {
        const page = parseInt(url.searchParams.get("page") || "1");
        const perPage = 1000;
        const { data, error } = await adminClient.auth.admin.listUsers({
          page,
          perPage,
        });
        if (error) throw error;
        
        const userIds = data.users.map(u => u.id);
        
        const { data: habits } = await adminClient
          .from("habits")
          .select("user_id")
          .in("user_id", userIds);
        
        const { data: gamification } = await adminClient
          .from("user_gamification")
          .select("user_id, total_xp")
          .in("user_id", userIds);
        
        const { data: profiles } = await adminClient
          .from("profiles")
          .select("id, display_name")
          .in("id", userIds);

        const { data: subscriptions } = await adminClient
          .from("user_subscriptions")
          .select("user_id, tier, premium_until")
          .in("user_id", userIds);

        const { data: pays } = await adminClient.from("payments").select("user_id, amount");
        const { data: refs } = await adminClient.from("referrals").select("referrer_id, referred_id");
        const { data: earns } = await adminClient.from("referral_earnings").select("referrer_id, amount");
        const { data: outs } = await adminClient.from("payout_requests").select("user_id, amount, status");
        const emailOf = (id: string) => data.users.find(x => x.id === id)?.email || "Unknown";

        const enrichedUsers = data.users.map(u => {
          const habitCount = habits?.filter(h => h.user_id === u.id).length || 0;
          const xp = gamification?.find(g => g.user_id === u.id)?.total_xp || 0;
          const profile = profiles?.find(p => p.id === u.id);
          const sub = subscriptions?.find(s => s.user_id === u.id);
          return {
            id: u.id,
            email: u.email,
            display_name: profile?.display_name || "User",
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            habit_count: habitCount,
            total_xp: xp,
            email_confirmed: !!u.email_confirmed_at,
            tier: sub?.tier === "premium" && (!sub.premium_until || new Date(sub.premium_until) > new Date()) ? "premium" : "free",
            premium_until: sub?.premium_until || null,
            total_paid: (pays || []).filter(p => p.user_id === u.id).reduce((a, p) => a + Number(p.amount), 0),
            referred_by: (() => { const r = (refs || []).find(r => r.referred_id === u.id); return r ? emailOf(r.referrer_id) : null; })(),
            invited_count: (refs || []).filter(r => r.referrer_id === u.id).length,
            earned: (earns || []).filter(e => e.referrer_id === u.id).reduce((a, e) => a + Number(e.amount), 0),
            withdrawn: (outs || []).filter(o => o.user_id === u.id && o.status !== "rejected").reduce((a, o) => a + Number(o.amount), 0),
          };
        });

        return new Response(JSON.stringify({ 
          users: enrichedUsers, 
          total: data.users.length,
          page 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete-user": {
        const body = await req.json();
        const userId = body.userId;
        if (!userId) throw new Error("userId required");
        if (userId === user.id) throw new Error("Cannot delete yourself");
        
        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "promote-user": {
        const body = await req.json();
        const userId = body.userId;
        if (!userId) throw new Error("userId required");

        const { error } = await adminClient
          .from("user_subscriptions")
          .update({ tier: "premium", premium_until: null })
          .eq("user_id", userId);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "record-payment": {
        const body = await req.json();
        const userId = body.userId;
        const amount = Number(body.amount);
        if (!userId || !(amount > 0) || amount > 1000000) throw new Error("userId and a valid amount required");
        const plan = typeof body.plan === "string" ? body.plan.slice(0, 50) : "premium";
        const { error: pe } = await adminClient.from("payments").insert({ user_id: userId, amount, plan, note: typeof body.note === "string" ? body.note.slice(0, 200) : null });
        if (pe) throw pe;
        await adminClient.from("user_subscriptions").update({ tier: "premium", plan: "monthly", premium_until: new Date(Date.now() + 30 * 86400000).toISOString() }).eq("user_id", userId);
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "money": {
        const { data: all } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const em = (id: string) => all?.users?.find(u => u.id === id)?.email || "Unknown";
        const [{ data: payments }, { data: referrals }, { data: earnings }, { data: payouts }] = await Promise.all([
          adminClient.from("payments").select("*").order("created_at", { ascending: false }),
          adminClient.from("referrals").select("*").order("created_at", { ascending: false }),
          adminClient.from("referral_earnings").select("*").order("created_at", { ascending: false }),
          adminClient.from("payout_requests").select("*").order("created_at", { ascending: false }),
        ]);
        return new Response(JSON.stringify({
          payments: (payments || []).map(p => ({ ...p, email: em(p.user_id) })),
          referrals: (referrals || []).map(r => ({ ...r, referrer_email: em(r.referrer_id), referred_email: em(r.referred_id) })),
          earnings: (earnings || []).map(e => ({ ...e, referrer_email: em(e.referrer_id), referred_email: em(e.referred_id) })),
          payouts: (payouts || []).map(p => ({ ...p, email: em(p.user_id) })),
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "update-payout": {
        const body = await req.json();
        if (!body.id || !["paid", "rejected", "pending"].includes(body.status)) throw new Error("id and valid status required");
        const { error: ue } = await adminClient.from("payout_requests").update({
          status: body.status, processed_at: body.status === "pending" ? null : new Date().toISOString(),
          admin_note: typeof body.note === "string" ? body.note.slice(0, 200) : null,
        }).eq("id", body.id);
        if (ue) throw ue;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "students": {
        const { data: all } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const em = (id: string) => all?.users?.find(u => u.id === id)?.email || "Unknown";
        const { data } = await adminClient.from("student_requests").select("*").order("created_at", { ascending: false });
        return new Response(JSON.stringify({ requests: (data || []).map(r => ({ ...r, email: em(r.user_id) })) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "student-decision": {
        const body = await req.json();
        if (!body.id || !["approved", "rejected"].includes(body.status)) throw new Error("id and valid status required");
        const { data: reqRow, error: ge } = await adminClient.from("student_requests").update({ status: body.status, processed_at: new Date().toISOString() }).eq("id", body.id).select("user_id").single();
        if (ge) throw ge;
        await adminClient.from("user_subscriptions").update({ is_student: body.status === "approved" }).eq("user_id", reqRow.user_id);
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }


      case "demote-user": {
        const body = await req.json();
        const userId = body.userId;
        if (!userId) throw new Error("userId required");

        const { error } = await adminClient
          .from("user_subscriptions")
          .update({ tier: "free", premium_until: null })
          .eq("user_id", userId);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "waitlist": {
        const { data: waitlistEntries, error: wlError } = await adminClient
          .from("premium_waitlist")
          .select("id, user_id, created_at")
          .order("created_at", { ascending: false });

        if (wlError) throw wlError;

        const wlUserIds = (waitlistEntries || []).map(w => w.user_id);
        let wlUsers: { id: string; user_id: string; email: string; display_name: string; created_at: string }[] = [];

        if (wlUserIds.length > 0) {
          const { data: allUsers } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
          const { data: wlProfiles } = await adminClient
            .from("profiles")
            .select("id, display_name")
            .in("id", wlUserIds);

          wlUsers = (waitlistEntries || []).map(w => {
            const authUser = allUsers?.users?.find(u => u.id === w.user_id);
            const profile = wlProfiles?.find(p => p.id === w.user_id);
            return {
              id: w.id,
              user_id: w.user_id,
              email: authUser?.email || "Unknown",
              display_name: profile?.display_name || "User",
              created_at: w.created_at,
            };
          });
        }

        return new Response(JSON.stringify({ waitlist: wlUsers, total: wlUsers.length }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "stats": {
        const { data: allUsers } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const totalUsers = allUsers?.users?.length || 0;
        
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const newUsersThisWeek = allUsers?.users?.filter(
          u => new Date(u.created_at) > new Date(sevenDaysAgo)
        ).length || 0;
        
        const activeUsers = allUsers?.users?.filter(
          u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(sevenDaysAgo)
        ).length || 0;

        const { count: totalHabits } = await adminClient
          .from("habits")
          .select("*", { count: "exact", head: true });
        
        const { count: totalWeeklyHabits } = await adminClient
          .from("weekly_habits")
          .select("*", { count: "exact", head: true });

        const { count: totalJournals } = await adminClient
          .from("journal_entries")
          .select("*", { count: "exact", head: true });

        const { data: xpData } = await adminClient
          .from("user_gamification")
          .select("total_xp");
        const totalXP = xpData?.reduce((sum, g) => sum + g.total_xp, 0) || 0;

        // Premium users count
        const { count: premiumUsers } = await adminClient
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("tier", "premium");

        // Waitlist count
        const { count: waitlistCount } = await adminClient
          .from("premium_waitlist")
          .select("*", { count: "exact", head: true });

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const signupsByDay: Record<string, number> = {};
        for (let i = 0; i < 30; i++) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          signupsByDay[date.toISOString().split("T")[0]] = 0;
        }
        allUsers?.users?.forEach(u => {
          const day = new Date(u.created_at).toISOString().split("T")[0];
          if (signupsByDay[day] !== undefined) signupsByDay[day]++;
        });

        return new Response(JSON.stringify({
          totalUsers,
          newUsersThisWeek,
          activeUsers,
          totalHabits: (totalHabits || 0) + (totalWeeklyHabits || 0),
          totalJournals: totalJournals || 0,
          totalXP,
          premiumUsers: premiumUsers || 0,
          waitlistCount: waitlistCount || 0,
          signupsByDay: Object.entries(signupsByDay)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date)),
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "export-all": {
        const TABLES = ["profiles", "user_roles", "user_subscriptions", "user_gamification", "habits", "weekly_habits", "todos", "journal_entries", "mood_checkins", "daily_logins", "user_commitments", "email_preferences", "routines", "routine_checks", "articles", "daily_lessons", "notifications", "notification_reads", "payments", "referrals", "referral_earnings", "payout_requests", "student_requests", "premium_waitlist", "page_views"];
        const tables: Record<string, unknown[]> = {};
        for (const t of TABLES) {
          const rows: unknown[] = [];
          for (let from = 0; ; from += 1000) {
            const { data, error } = await adminClient.from(t).select("*").range(from, from + 999);
            if (error) throw new Error(`${t}: ${error.message}`);
            rows.push(...(data || []));
            if (!data || data.length < 1000) break;
          }
          tables[t] = rows;
        }
        const authUsers: unknown[] = [];
        for (let page = 1; ; page++) {
          const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
          if (error) throw error;
          authUsers.push(...data.users.map((u) => ({
            id: u.id, email: u.email, phone: u.phone, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
            email_confirmed_at: u.email_confirmed_at, providers: u.app_metadata?.providers, user_metadata: u.user_metadata,
          })));
          if (data.users.length < 1000) break;
        }
        return new Response(JSON.stringify({
          exported_at: new Date().toISOString(),
          note: "Passwords and private keys are never exported. Users sign in on the new server with Forgot password or Google.",
          auth_users: authUsers,
          tables,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
