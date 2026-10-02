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

/** Opens Razorpay checkout for a Pro plan. Resolves "paid" | "cancelled", throws on error. */
export async function payForPro(plan: PlanKey = "monthly", name?: string): Promise<"paid" | "cancelled"> {
  if (!(await loadScript())) throw new Error("Could not load payment window. Check your internet.");
  const { data, error } = await supabase.functions.invoke("razorpay", { body: { action: "create-order", plan } });
  if (error || data?.error) {
    let msg = data?.error;
    try { msg = msg || (await (error as any)?.context?.json())?.error; } catch { /* ignore */ }
    throw new Error(msg || "Could not start payment");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "Superoutine",
      description: data.label,
      prefill: { email: data.email, name },
      theme: { color: "#2dd4a8" },
      handler: async (resp: any) => {
        const { data: v, error: ve } = await supabase.functions.invoke("razorpay", {
          body: { action: "verify", orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature },
        });
        if (ve || !v?.success) reject(new Error(v?.error || "Payment received but verification failed. Contact support."));
        else resolve("paid");
      },
      modal: { ondismiss: () => resolve("cancelled") },
    });
    rzp.on("payment.failed", (r: any) => reject(new Error(r?.error?.description || "Payment failed")));
    rzp.open();
  });
}
