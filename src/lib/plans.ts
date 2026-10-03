// Prices in USD. Keep in sync with supabase/functions/razorpay/index.ts
export type PlanKey = "monthly" | "yearly" | "lifetime";

export const PLANS: Record<PlanKey, { price: number; label: string; per: string; note: string }> = {
  monthly: { price: 4.99, label: "Monthly", per: "/month", note: "1 month of Pro" },
  yearly: { price: 39, label: "Yearly", per: "/year", note: "Save 35% — $3.25/month" },
  lifetime: { price: 79, label: "Lifetime", per: " once", note: "Pay once, Pro forever — first 100 only" },
};
export const LIFETIME_CAP = 100;
export const usd = (n: number) => `$${Number(n || 0).toFixed(2)}`;
export const TRIAL_DAYS = 15;
export const PRO_FEATURES = [
  "Unlimited daily & weekly habits",
  "AI Coach chat that knows your progress",
  "Full analytics & trends",
  "To-do list & daily planner",
  "3 streak protections a month",
];
