import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const TRIAL_DAYS = 15; // keep in sync with src/lib/plans.ts

const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) })).min(1).max(30),
});

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "Please sign in" }, 401);

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: "Invalid message" }, 400);

    // Pro or active trial only
    const { data: sub } = await admin.from("user_subscriptions").select("tier, premium_until").eq("user_id", user.id).maybeSingle();
    const pro = sub?.tier === "premium" && (!sub.premium_until || new Date(sub.premium_until).getTime() > Date.now());
    const inTrial = Date.now() - new Date(user.created_at).getTime() < TRIAL_DAYS * 86400000;
    if (!pro && !inTrial) return json({ error: "AI Coach is a Pro feature. Pick a plan to keep chatting." }, 402);

    // Build a short progress summary for context
    const now = new Date();
    const ym = now.getFullYear() * 100 + now.getMonth() + 1;
    const today = ym * 100 + now.getDate();
    const [{ data: habits }, { data: weekly }, { data: todos }, { data: gam }, { data: profile }] = await Promise.all([
      admin.from("habits").select("name, completed_days").eq("user_id", user.id).limit(50),
      admin.from("weekly_habits").select("name, completed_weeks").eq("user_id", user.id).limit(30),
      admin.from("todos").select("title, completed").eq("user_id", user.id).eq("date", now.toISOString().slice(0, 10)).limit(30),
      admin.from("user_gamification").select("total_xp").eq("user_id", user.id).maybeSingle(),
      admin.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    ]);
    const habitLines = (habits || []).map((h: any) => {
      const days = (h.completed_days || []).filter((d: number) => Math.floor(d / 100) === ym && d <= today);
      let streak = 0;
      const set = new Set(h.completed_days || []);
      for (let i = 0; i < 60; i++) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        const k = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
        if (set.has(k)) streak++; else if (i > 0) break;
      }
      return `- ${h.name}: done today ${set.has(today) ? "yes" : "no"}, ${days.length}/${now.getDate()} days this month, streak ${streak}`;
    }).join("\n");
    const context = `User: ${profile?.display_name || "friend"}. XP: ${gam?.total_xp ?? 0}. Today: ${now.toDateString()}.
Daily habits:\n${habitLines || "none yet"}
Weekly habits: ${(weekly || []).map((w: any) => w.name).join(", ") || "none"}
Today's tasks: ${(todos || []).map((t: any) => `${t.title}${t.completed ? " (done)" : ""}`).join(", ") || "none"}`;

    const ai = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: `You are Superoutine's friendly AI habit coach. Use growth framing: treat missed days as chances to bounce back, never shame. Be concrete, warm and brief (under 150 words), use short bullet points when giving plans. Base advice on the user's real data below.\n\n${context}`,
        input: parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (ai.status === 429) return json({ error: "The coach is busy right now. Try again in a minute." }, 429);
    if (ai.status === 402) return json({ error: "AI usage limit reached. Please contact support." }, 402);
    if (!ai.ok) return json({ error: "The coach couldn't answer. Try again." }, 500);
    const data = await ai.json();
    const reply = data.output_text ?? (data.output || []).flatMap((o: any) => o.content || []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("");
    return json({ reply: reply || "I'm here. Could you ask that another way?" });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
