import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Prices in US cents. Keep in sync with src/lib/plans.ts
const PLANS: Record<string, { cents: number; days: number | null; label: string }> = {
  monthly: { cents: 499, days: 30, label: "Pro monthly" },
  yearly: { cents: 3900, days: 365, label: "Pro yearly" },
  student: { cents: 249, days: 30, label: "Pro student" },
  lifetime: { cents: 7900, days: null, label: "Pro lifetime" },
};
const LIFETIME_CAP = 100;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function hmacHex(secret: string, msg: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const keyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json().catch(() => ({}));

    const spotsLeft = async () => {
      const { data } = await admin.rpc("lifetime_spots_left");
      return typeof data === "number" ? data : 0;
    };

    // Public: pricing info (lifetime spots left)
    if (body.action === "info") return json({ lifetimeSpotsLeft: await spotsLeft(), lifetimeCap: LIFETIME_CAP });

    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401);
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const rzAuth = "Basic " + btoa(`${keyId}:${keySecret}`);
    const { data: sub } = await admin.from("user_subscriptions").select("tier, premium_until, is_student, plan").eq("user_id", user.id).maybeSingle();

    const checkAllowed = async (planKey: string) => {
      if (!PLANS[planKey]) return "Unknown plan";
      if (sub?.plan === "lifetime" && sub?.tier === "premium") return "You already have lifetime Pro";
      if (planKey === "student" && !sub?.is_student) return "Student price needs approval first";
      if (planKey === "lifetime" && (await spotsLeft()) <= 0) return "The lifetime offer is sold out";
      return null;
    };

    if (body.action === "create-order") {
      const planKey = typeof body.plan === "string" ? body.plan : "monthly";
      const bad = await checkAllowed(planKey);
      if (bad) return json({ error: bad }, 400);
      const p = PLANS[planKey];
      const r = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { Authorization: rzAuth, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: p.cents, currency: "USD", receipt: `${planKey}_${Date.now()}`, notes: { user_id: user.id, plan: planKey } }),
      });
      const order = await r.json();
      if (!r.ok) return json({ error: order?.error?.description || "Could not start payment" }, 502);
      return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId, email: user.email, label: p.label });
    }

    if (body.action === "verify") {
      const { orderId, paymentId, signature } = body;
      if (typeof orderId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") return json({ error: "Invalid input" }, 400);
      if ((await hmacHex(keySecret, `${orderId}|${paymentId}`)) !== signature) return json({ error: "Payment could not be verified" }, 400);

      const pr = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers: { Authorization: rzAuth } });
      const pay = await pr.json();
      const or = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, { headers: { Authorization: rzAuth } });
      const order = await or.json();
      const planKey = order?.notes?.plan || "monthly";
      const p = PLANS[planKey];
      if (!pr.ok || !or.ok || !p || pay.order_id !== orderId || order.notes?.user_id !== user.id || order.amount !== p.cents || order.currency !== "USD")
        return json({ error: "Payment mismatch" }, 400);
      if (pay.status === "authorized") {
        await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
          method: "POST", headers: { Authorization: rzAuth, "Content-Type": "application/json" },
          body: JSON.stringify({ amount: pay.amount, currency: pay.currency }),
        });
      } else if (pay.status !== "captured") return json({ error: `Payment is ${pay.status}` }, 400);

      const { data: existing } = await admin.from("payments").select("id").eq("razorpay_payment_id", paymentId).maybeSingle();
      if (!existing) {
        const { error } = await admin.from("payments").insert({
          user_id: user.id, amount: pay.amount / 100, currency: "USD", plan: p.label, note: "Razorpay",
          razorpay_order_id: orderId, razorpay_payment_id: paymentId,
        });
        if (error && error.code !== "23505") throw error;
        if (!error) {
          const now = Date.now();
          let until: string | null = null;
          if (p.days !== null) {
            const base = sub?.premium_until && new Date(sub.premium_until).getTime() > now ? new Date(sub.premium_until).getTime() : now;
            until = new Date(base + p.days * 86400000).toISOString();
          }
          const row = { tier: "premium", premium_until: until, plan: planKey };
          if (sub) await admin.from("user_subscriptions").update(row).eq("user_id", user.id);
          else await admin.from("user_subscriptions").insert({ user_id: user.id, ...row });
        }
      }
      return json({ success: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
