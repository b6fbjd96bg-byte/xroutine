import { supabase } from "@/integrations/supabase/client";
import type { PlanKey } from "@/lib/plans";

declare global { interface Window { Razorpay?: any } }

const loadScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export async function getLifetimeSpotsLeft(): Promise<number | null> {
  const { data } = await supabase.functions.invoke("razorpay", { body: { action: "info" } });
  return typeof data?.lifetimeSpotsLeft === "number" ? data.lifetimeSpotsLeft : null;
}

const invoke = async (body: Record<string, unknown>, fallback: string) => {
  const { data, error } = await supabase.functions.invoke("razorpay", { body });
  if (error || data?.error) {
    let msg = data?.error;
    try { msg = msg || (await (error as any)?.context?.json())?.error; } catch { /* ignore */ }
    throw new Error(msg || fallback);
  }
  return data;
};

/** Opens Razorpay checkout. Monthly/yearly auto-renew by default. Resolves "paid" | "cancelled", throws on error. */
export async function payForPro(plan: PlanKey = "monthly", autoRenew = true, name?: string): Promise<"paid" | "cancelled"> {
  if (!(await loadScript())) throw new Error("Could not load payment window. Check your internet.");
  let recurring = autoRenew && plan !== "lifetime";
  let data: any;
  if (recurring) {
    // If Razorpay hasn't enabled dollar auto-renew on the account yet, fall back to a one-time payment
    try { data = await invoke({ action: "create-subscription", plan }, "Could not start auto-renew"); }
    catch (e: any) { if (/already have auto-renew/i.test(e.message)) throw e; recurring = false; }
  }
  if (!recurring) data = await invoke({ action: "create-order", plan }, "Could not start payment");

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      ...(recurring ? { subscription_id: data.subscriptionId } : { amount: data.amount, currency: data.currency, order_id: data.orderId }),
      name: "Superoutine",
      description: data.label,
      prefill: { email: data.email, name },
      theme: { color: "#2dd4a8" },
      handler: async (resp: any) => {
        const body = recurring
          ? { action: "verify-subscription", subscriptionId: resp.razorpay_subscription_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature }
          : { action: "verify", orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature };
        const { data: v, error: ve } = await supabase.functions.invoke("razorpay", { body });
        if (ve || !v?.success) reject(new Error(v?.error || "Payment received but verification failed. Contact support."));
        else resolve("paid");
      },
      modal: { ondismiss: () => resolve("cancelled") },
    });
    rzp.on("payment.failed", (r: any) => reject(new Error(r?.error?.description || "Payment failed")));
    rzp.open();
  });
}

export async function cancelAutoRenew() {
  await invoke({ action: "cancel-subscription" }, "Could not cancel auto-renew");
}
