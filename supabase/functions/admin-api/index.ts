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
    
    // Verify the requesting user is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role using service role client
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
      case "list-users": {
        const page = parseInt(url.searchParams.get("page") || "1");
        const perPage = 20;
        const { data, error } = await adminClient.auth.admin.listUsers({
          page,
          perPage,
        });
        if (error) throw error;
        
        // Get habit counts and gamification data for each user
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

        const enrichedUsers = data.users.map(u => {
          const habitCount = habits?.filter(h => h.user_id === u.id).length || 0;
          const xp = gamification?.find(g => g.user_id === u.id)?.total_xp || 0;
          const profile = profiles?.find(p => p.id === u.id);
          return {
            id: u.id,
            email: u.email,
            display_name: profile?.display_name || "User",
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            habit_count: habitCount,
            total_xp: xp,
            email_confirmed: !!u.email_confirmed_at,
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

      case "waitlist": {
        const { data: waitlistEntries, error: wlError } = await adminClient
          .from("premium_waitlist")
          .select("id, user_id, created_at")
          .order("created_at", { ascending: false });

        if (wlError) throw wlError;

        // Get emails and names for waitlist users
        const wlUserIds = (waitlistEntries || []).map(w => w.user_id);
        let wlUsers: { id: string; email: string; display_name: string; created_at: string }[] = [];

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
        // Get total users
        const { data: allUsers } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const totalUsers = allUsers?.users?.length || 0;
        
        // Users in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const newUsersThisWeek = allUsers?.users?.filter(
          u => new Date(u.created_at) > new Date(sevenDaysAgo)
        ).length || 0;
        
        // Active users (signed in last 7 days)
        const activeUsers = allUsers?.users?.filter(
          u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(sevenDaysAgo)
        ).length || 0;

        // Total habits
        const { count: totalHabits } = await adminClient
          .from("habits")
          .select("*", { count: "exact", head: true });
        
        const { count: totalWeeklyHabits } = await adminClient
          .from("weekly_habits")
          .select("*", { count: "exact", head: true });

        // Total journal entries
        const { count: totalJournals } = await adminClient
          .from("journal_entries")
          .select("*", { count: "exact", head: true });

        // Total XP across all users
        const { data: xpData } = await adminClient
          .from("user_gamification")
          .select("total_xp");
        const totalXP = xpData?.reduce((sum, g) => sum + g.total_xp, 0) || 0;

        // Signups by day (last 30 days)
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
          signupsByDay: Object.entries(signupsByDay)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date)),
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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
