import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const PRICE_INR = 49;
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
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401);
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const rzAuth = "Basic " + btoa(`${keyId}:${keySecret}`);
    const body = await req.json().catch(() => ({}));

    if (body.action === "create-order") {
      const r = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { Authorization: rzAuth, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: PRICE_INR * 100, currency: "INR", receipt: `pro_${Date.now()}`, notes: { user_id: user.id } }),
      });
      const order = await r.json();
      if (!r.ok) return json({ error: order?.error?.description || "Could not start payment" }, 502);
      return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId, email: user.email });
    }

    if (body.action === "verify") {
      const { orderId, paymentId, signature } = body;
      if (typeof orderId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") return json({ error: "Invalid input" }, 400);
      if ((await hmacHex(keySecret, `${orderId}|${paymentId}`)) !== signature) return json({ error: "Payment could not be verified" }, 400);

      // Confirm with Razorpay that the payment is real, captured, and belongs to this user's order
      const pr = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers: { Authorization: rzAuth } });
      const pay = await pr.json();
      const or = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, { headers: { Authorization: rzAuth } });
      const order = await or.json();
      if (!pr.ok || !or.ok || pay.order_id !== orderId || order.notes?.user_id !== user.id) return json({ error: "Payment mismatch" }, 400);
      if (pay.status === "authorized") {
        await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
          method: "POST", headers: { Authorization: rzAuth, "Content-Type": "application/json" },
          body: JSON.stringify({ amount: pay.amount, currency: pay.currency }),
        });
      } else if (pay.status !== "captured") return json({ error: `Payment is ${pay.status}` }, 400);

      const { data: existing } = await admin.from("payments").select("id").eq("razorpay_payment_id", paymentId).maybeSingle();
      if (!existing) {
        const { error } = await admin.from("payments").insert({
          user_id: user.id, amount: pay.amount / 100, plan: "Pro monthly", note: "Razorpay",
          razorpay_order_id: orderId, razorpay_payment_id: paymentId,
        });
        if (error && error.code !== "23505") throw error;
        if (!error) {
          const { data: sub } = await admin.from("user_subscriptions").select("tier, premium_until").eq("user_id", user.id).maybeSingle();
          const now = Date.now();
          const base = sub?.premium_until && new Date(sub.premium_until).getTime() > now ? new Date(sub.premium_until).getTime() : now;
          const until = new Date(base + 30 * 86400000).toISOString();
          await admin.from("user_subscriptions").upsert({ user_id: user.id, tier: "premium", premium_until: until }, { onConflict: "user_id" });
        }
      }
      return json({ success: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
