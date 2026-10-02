// Prices in US cents. Keep in sync with src/lib/plans.ts
export const PLANS: Record<string, { cents: number; days: number | null; label: string; period?: "monthly" | "yearly" }> = {
  monthly: { cents: 499, days: 30, label: "Pro monthly", period: "monthly" },
  yearly: { cents: 3900, days: 365, label: "Pro yearly", period: "yearly" },
  lifetime: { cents: 7900, days: null, label: "Pro lifetime" },
};

export async function hmacHex(secret: string, msg: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Records a captured payment once and extends the payer's Pro. Returns true if newly recorded. */
export async function grant(admin: any, uid: string, planKey: string, pay: any, opts: { orderId?: string | null; subscriptionId?: string | null; note?: string } = {}) {
  const p = PLANS[planKey];
  if (!p) return false;
  const { data: existing } = await admin.from("payments").select("id").eq("razorpay_payment_id", pay.id).maybeSingle();
  if (existing) return false;
  const { data: s } = await admin.from("user_subscriptions").select("premium_until").eq("user_id", uid).maybeSingle();
  const { error } = await admin.from("payments").insert({
    user_id: uid, amount: pay.amount / 100, currency: "USD", plan: p.label, note: opts.note || "Razorpay",
    razorpay_order_id: opts.orderId ?? pay.order_id ?? null, razorpay_payment_id: pay.id,
  });
  if (error) { if (error.code === "23505") return false; throw error; }
  const now = Date.now();
  let until: string | null = null;
  if (p.days !== null) {
    const base = s?.premium_until && new Date(s.premium_until).getTime() > now ? new Date(s.premium_until).getTime() : now;
    until = new Date(base + p.days * 86400000).toISOString();
  }
  const row: Record<string, unknown> = { tier: "premium", premium_until: until, plan: planKey };
  if (opts.subscriptionId) { row.razorpay_subscription_id = opts.subscriptionId; row.auto_renew = true; }
  if (s) await admin.from("user_subscriptions").update(row).eq("user_id", uid);
  else await admin.from("user_subscriptions").insert({ user_id: uid, ...row });
  return true;
}
