import { createClient } from "npm:@supabase/supabase-js@2";
import { PLANS, hmacHex, grant } from "../_shared/grant.ts";

const ok = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return ok({ error: "Method not allowed" }, 405);
  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!secret) return ok({ error: "Webhook not configured" }, 500);

  const raw = await req.text();
  if ((await hmacHex(secret, raw)) !== (req.headers.get("x-razorpay-signature") || "")) return ok({ error: "Bad signature" }, 401);

  let evt: any;
  try { evt = JSON.parse(raw); } catch { return ok({ error: "Bad JSON" }, 400); }
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const rzAuth = "Basic " + btoa(`${Deno.env.get("RAZORPAY_KEY_ID")}:${Deno.env.get("RAZORPAY_KEY_SECRET")}`);
  const sub = evt?.payload?.subscription?.entity;
  const pay = evt?.payload?.payment?.entity;

  try {
    // Auto-renew stopped
    if (["subscription.cancelled", "subscription.halted", "subscription.completed"].includes(evt?.event) && sub?.id) {
      await admin.from("user_subscriptions").update({ auto_renew: false }).eq("razorpay_subscription_id", sub.id);
      return ok({ success: true });
    }

    // Subscription charge (first payment and every renewal)
    if (evt?.event === "subscription.charged" && sub && pay) {
      const planKey = sub.notes?.plan, uid = sub.notes?.user_id, p = PLANS[planKey];
      if (!uid || !p || pay.status !== "captured" || pay.amount !== p.cents || pay.currency !== "USD") return ok({ ignored: "mismatch" });
      await grant(admin, uid, planKey, pay, { subscriptionId: sub.id, note: "Razorpay auto-renew" });
      return ok({ success: true });
    }

    // One-time order payments
    if (["payment.captured", "order.paid"].includes(evt?.event) && pay?.id && pay.order_id && pay.status === "captured") {
      const or = await fetch(`https://api.razorpay.com/v1/orders/${pay.order_id}`, { headers: { Authorization: rzAuth } });
      const order = await or.json();
      const planKey = order?.notes?.plan, uid = order?.notes?.user_id, p = PLANS[planKey];
      if (!or.ok || !uid || !p || order.amount !== p.cents || order.currency !== "USD" || pay.amount !== p.cents) return ok({ ignored: "no matching order" });
      await grant(admin, uid, planKey, pay, { orderId: pay.order_id, note: "Razorpay webhook" });
      return ok({ success: true });
    }
    return ok({ ignored: evt?.event });
  } catch (e) {
    return ok({ error: (e as Error).message }, 500);
  }
});
