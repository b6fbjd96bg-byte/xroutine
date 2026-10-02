// Prices in USD. Keep in sync with supabase/functions/razorpay/index.ts
export type PlanKey = "monthly" | "yearly" | "student" | "lifetime";

export const PLANS: Record<PlanKey, { price: number; label: string; per: string; note: string }> = {
  monthly: { price: 4.99, label: "Monthly", per: "/month", note: "1 month of Pro" },
  yearly: { price: 39, label: "Yearly", per: "/year", note: "Save 35% — $3.25/month" },
  student: { price: 2.49, label: "Student", per: "/month", note: "Half price for approved students" },
  lifetime: { price: 79, label: "Lifetime", per: " once", note: "Pay once, Pro forever — first 100 only" },
};
export const LIFETIME_CAP = 100;
export const usd = (n: number) => `$${Number(n || 0).toFixed(2)}`;
