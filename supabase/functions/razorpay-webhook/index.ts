import { createClient } from "npm:@supabase/supabase-js@2";

// Keep in sync with supabase/functions/razorpay/index.ts and src/lib/plans.ts
const PLANS: Record<string, { cents: number; days: number | null; label: string }> = {
  monthly: { cents: 499, days: 30, label: "Pro monthly" },
  yearly: { cents: 3900, days: 365, label: "Pro yearly" },
  lifetime: { cents: 7900, days: null, label: "Pro lifetime" },
};

async function hmacHex(secret: string, msg: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ok = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return ok({ error: "Method not allowed" }, 405);
  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!secret) return ok({ error: "Webhook not configured" }, 500);

  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  if ((await hmacHex(secret, raw)) !== sig) return ok({ error: "Bad signature" }, 401);

  let evt: any;
  try { evt = JSON.parse(raw); } catch { return ok({ error: "Bad JSON" }, 400); }
  if (!["payment.captured", "order.paid"].includes(evt?.event)) return ok({ ignored: evt?.event });

  const pay = evt?.payload?.payment?.entity;
  if (!pay?.id || !pay?.order_id || pay.status !== "captured") return ok({ ignored: "not captured" });

  const keyId = Deno.env.get("RAZORPAY_KEY_ID")!, keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
  const rzAuth = "Basic " + btoa(`${keyId}:${keySecret}`);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { data: existing } = await admin.from("payments").select("id").eq("razorpay_payment_id", pay.id).maybeSingle();
    if (existing) return ok({ success: true, duplicate: true });

    const or = await fetch(`https://api.razorpay.com/v1/orders/${pay.order_id}`, { headers: { Authorization: rzAuth } });
    const order = await or.json();
    const planKey = order?.notes?.plan, uid = order?.notes?.user_id, p = PLANS[planKey];
    if (!or.ok || !uid || !p || order.amount !== p.cents || order.currency !== "USD" || pay.amount !== p.cents)
      return ok({ ignored: "order mismatch" });

    const { data: s } = await admin.from("user_subscriptions").select("premium_until").eq("user_id", uid).maybeSingle();
    const { error } = await admin.from("payments").insert({
      user_id: uid, amount: pay.amount / 100, currency: "USD", plan: p.label, note: "Razorpay webhook",
      razorpay_order_id: pay.order_id, razorpay_payment_id: pay.id,
    });
    if (error) { if (error.code === "23505") return ok({ success: true, duplicate: true }); throw error; }

    const now = Date.now();
    let until: string | null = null;
    if (p.days !== null) {
      const base = s?.premium_until && new Date(s.premium_until).getTime() > now ? new Date(s.premium_until).getTime() : now;
      until = new Date(base + p.days * 86400000).toISOString();
    }
    const row = { tier: "premium", premium_until: until, plan: planKey };
    if (s) await admin.from("user_subscriptions").update(row).eq("user_id", uid);
    else await admin.from("user_subscriptions").insert({ user_id: uid, ...row });
    return ok({ success: true });
  } catch (e) {
    return ok({ error: (e as Error).message }, 500);
  }
});
