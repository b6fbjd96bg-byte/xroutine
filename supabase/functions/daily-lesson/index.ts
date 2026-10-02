import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const TRIAL_DAYS = 15; // keep in sync with src/lib/plans.ts
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "Please sign in" }, 401);

    const { data: sub } = await admin.from("user_subscriptions").select("tier, premium_until").eq("user_id", user.id).maybeSingle();
    const pro = sub?.tier === "premium" && (!sub.premium_until || new Date(sub.premium_until).getTime() > Date.now());
    const inTrial = Date.now() - new Date(user.created_at).getTime() < TRIAL_DAYS * 86400000;
    if (!pro && !inTrial) return json({ error: "Daily lessons are a Pro feature." }, 402);

    const date = new Date().toISOString().slice(0, 10);
    const { data: existing } = await admin.from("daily_lessons").select("title, body, date").eq("user_id", user.id).eq("date", date).maybeSingle();
    if (existing) return json(existing);

    const { data: habits } = await admin.from("habits").select("name").eq("user_id", user.id).limit(20);
    const names = (habits || []).map((h: any) => h.name).join(", ") || "no habits yet";

    const ai = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: `Write a short daily habit-building lesson (120-180 words) personalised to someone tracking: ${names}. Use growth framing, never shame. Format: first line is the title only (no quotes, no markdown symbols), then a blank line, then the lesson in plain short paragraphs, ending with one concrete action for today.`,
        input: `Today's lesson for ${new Date().toDateString()}.`,
      }),
    });
    if (ai.status === 429) return json({ error: "Busy right now. Try again in a minute." }, 429);
    if (!ai.ok) return json({ error: "Couldn't write today's lesson. Try again." }, 500);
    const data = await ai.json();
    const text: string = (data.output_text ?? (data.output || []).flatMap((o: any) => o.content || []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("")).trim();
    const [first, ...rest] = text.split("\n");
    const lesson = { user_id: user.id, date, title: first.replace(/^[#*\s]+|[*\s]+$/g, "").slice(0, 160) || "Today's lesson", body: rest.join("\n").trim() || text };
    await admin.from("daily_lessons").upsert(lesson, { onConflict: "user_id,date" });
    return json({ title: lesson.title, body: lesson.body, date });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
