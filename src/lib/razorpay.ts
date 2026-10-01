import { supabase } from "@/integrations/supabase/client";

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

/** Opens Razorpay checkout for Pro monthly. Resolves "paid" | "cancelled", throws on error. */
export async function payForPro(name?: string): Promise<"paid" | "cancelled"> {
  if (!(await loadScript())) throw new Error("Could not load payment window. Check your internet.");
  const { data, error } = await supabase.functions.invoke("razorpay", { body: { action: "create-order" } });
  if (error || data?.error) throw new Error(data?.error || "Could not start payment");

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "Superoutine",
      description: "Pro plan — 1 month",
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
