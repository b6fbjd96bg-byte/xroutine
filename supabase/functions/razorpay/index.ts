import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { PLANS, hmacHex, grant } from "../_shared/grant.ts";

const LIFETIME_CAP = 100;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

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

    if (body.action === "info") return json({ lifetimeSpotsLeft: await spotsLeft(), lifetimeCap: LIFETIME_CAP });

    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401);
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const rzAuth = "Basic " + btoa(`${keyId}:${keySecret}`);
    const rz = (path: string, init: RequestInit = {}) =>
      fetch(`https://api.razorpay.com/v1${path}`, { ...init, headers: { Authorization: rzAuth, "Content-Type": "application/json", ...(init.headers || {}) } });

    if (body.action === "admin-sync") {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "Forbidden" }, 403);
      const r = await rz("/payments?count=100");
      const list = await r.json();
      if (!r.ok) return json({ error: list?.error?.description || "Could not reach Razorpay" }, 502);
      let added = 0, checked = 0;
      for (const pay of list.items || []) {
        if (!pay.order_id || !["captured", "authorized"].includes(pay.status)) continue;
        checked++;
        const { data: ex } = await admin.from("payments").select("id").eq("razorpay_payment_id", pay.id).maybeSingle();
        if (ex) continue;
        const order = await (await rz(`/orders/${pay.order_id}`)).json();
        let planKey = order?.notes?.plan, uid = order?.notes?.user_id, subId: string | null = null;
        if (!uid && pay.invoice_id) {
          const inv = await (await rz(`/invoices/${pay.invoice_id}`)).json();
          if (inv?.subscription_id) {
            const sub = await (await rz(`/subscriptions/${inv.subscription_id}`)).json();
            planKey = sub?.notes?.plan; uid = sub?.notes?.user_id; subId = sub?.id || null;
          }
        }
        if (!uid || !PLANS[planKey] || pay.amount !== PLANS[planKey].cents || pay.currency !== "USD") continue;
        if (pay.status === "authorized") {
          const c = await rz(`/payments/${pay.id}/capture`, { method: "POST", body: JSON.stringify({ amount: pay.amount, currency: pay.currency }) });
          if (!c.ok) continue;
        }
        if (await grant(admin, uid, planKey, pay, { orderId: pay.order_id, subscriptionId: subId })) added++;
      }
      return json({ success: true, checked, added });
    }

    const { data: sub } = await admin.from("user_subscriptions").select("tier, premium_until, plan, razorpay_subscription_id, auto_renew").eq("user_id", user.id).maybeSingle();

    const checkAllowed = async (planKey: string) => {
      if (!PLANS[planKey]) return "Unknown plan";
      if (sub?.plan === "lifetime" && sub?.tier === "premium") return "You already have lifetime Pro";
      if (planKey === "lifetime" && (await spotsLeft()) <= 0) return "The lifetime offer is sold out";
      return null;
    };

    if (body.action === "create-order") {
      const planKey = typeof body.plan === "string" ? body.plan : "monthly";
      const bad = await checkAllowed(planKey);
      if (bad) return json({ error: bad }, 400);
      const p = PLANS[planKey];
      const r = await rz("/orders", { method: "POST", body: JSON.stringify({ amount: p.cents, currency: "USD", receipt: `${planKey}_${Date.now()}`, notes: { user_id: user.id, plan: planKey } }) });
      const order = await r.json();
      if (!r.ok) return json({ error: order?.error?.description || "Could not start payment" }, 502);
      return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId, email: user.email, label: p.label });
    }

    // Auto-renewing subscription (monthly / yearly)
    if (body.action === "create-subscription") {
      const planKey = body.plan;
      const bad = await checkAllowed(planKey);
      if (bad) return json({ error: bad }, 400);
      const p = PLANS[planKey];
      if (!p.period) return json({ error: "This plan can't auto-renew" }, 400);
      if (sub?.auto_renew && sub?.razorpay_subscription_id) return json({ error: "You already have auto-renew on. Cancel it in Settings first." }, 400);

      // Find or create the Razorpay plan for this price
      const tag = `superoutine_${planKey}_${p.cents}`;
      const plans = await (await rz("/plans?count=100")).json();
      let planId = (plans.items || []).find((x: any) => x?.notes?.tag === tag)?.id;
      if (!planId) {
        const cr = await rz("/plans", { method: "POST", body: JSON.stringify({ period: p.period, interval: 1, item: { name: p.label, amount: p.cents, currency: "USD" }, notes: { tag } }) });
        const created = await cr.json();
        if (!cr.ok) return json({ error: created?.error?.description || "Could not set up auto-renew" }, 502);
        planId = created.id;
      }
      const sr = await rz("/subscriptions", { method: "POST", body: JSON.stringify({ plan_id: planId, total_count: planKey === "monthly" ? 120 : 10, customer_notify: 1, notes: { user_id: user.id, plan: planKey } }) });
      const s = await sr.json();
      if (!sr.ok) return json({ error: s?.error?.description || "Could not start auto-renew" }, 502);
      return json({ subscriptionId: s.id, keyId, email: user.email, label: `${p.label} (auto-renew)` });
    }

    if (body.action === "verify-subscription") {
      const { subscriptionId, paymentId, signature } = body;
      if (typeof subscriptionId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") return json({ error: "Invalid input" }, 400);
      if ((await hmacHex(keySecret, `${paymentId}|${subscriptionId}`)) !== signature) return json({ error: "Payment could not be verified" }, 400);
      const pay = await (await rz(`/payments/${paymentId}`)).json();
      const s = await (await rz(`/subscriptions/${subscriptionId}`)).json();
      const planKey = s?.notes?.plan, p = PLANS[planKey];
      if (!p || s?.notes?.user_id !== user.id || pay.amount !== p.cents || pay.currency !== "USD") return json({ error: "Payment mismatch" }, 400);
      if (pay.status === "authorized") {
        await rz(`/payments/${paymentId}/capture`, { method: "POST", body: JSON.stringify({ amount: pay.amount, currency: pay.currency }) });
      } else if (pay.status !== "captured") return json({ error: `Payment is ${pay.status}` }, 400);
      await grant(admin, user.id, planKey, pay, { subscriptionId, note: "Razorpay auto-renew" });
      await admin.from("user_subscriptions").update({ razorpay_subscription_id: subscriptionId, auto_renew: true }).eq("user_id", user.id);
      return json({ success: true });
    }

    if (body.action === "cancel-subscription") {
      if (!sub?.razorpay_subscription_id) return json({ error: "No auto-renew to cancel" }, 400);
      const r = await rz(`/subscriptions/${sub.razorpay_subscription_id}/cancel`, { method: "POST", body: JSON.stringify({ cancel_at_cycle_end: 0 }) });
      const out = await r.json();
      if (!r.ok && out?.error?.description && !/cancel/i.test(out.error.description)) return json({ error: out.error.description }, 502);
      await admin.from("user_subscriptions").update({ auto_renew: false }).eq("user_id", user.id);
      return json({ success: true });
    }

    if (body.action === "verify") {
      const { orderId, paymentId, signature } = body;
      if (typeof orderId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") return json({ error: "Invalid input" }, 400);
      if ((await hmacHex(keySecret, `${orderId}|${paymentId}`)) !== signature) return json({ error: "Payment could not be verified" }, 400);
      const pr = await rz(`/payments/${paymentId}`);
      const pay = await pr.json();
      const or = await rz(`/orders/${orderId}`);
      const order = await or.json();
      const planKey = order?.notes?.plan || "monthly";
      const p = PLANS[planKey];
      if (!pr.ok || !or.ok || !p || pay.order_id !== orderId || order.notes?.user_id !== user.id || order.amount !== p.cents || order.currency !== "USD")
        return json({ error: "Payment mismatch" }, 400);
      if (pay.status === "authorized") {
        await rz(`/payments/${paymentId}/capture`, { method: "POST", body: JSON.stringify({ amount: pay.amount, currency: pay.currency }) });
      } else if (pay.status !== "captured") return json({ error: `Payment is ${pay.status}` }, 400);
      await grant(admin, user.id, planKey, pay, { orderId });
      return json({ success: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
