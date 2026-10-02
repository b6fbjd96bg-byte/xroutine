import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Tier = "free" | "premium";

interface SubscriptionLimits {
  maxDailyHabits: number;
  maxWeeklyHabits: number;
  maxEmergencySkips: number;
  weeklyEmailReports: boolean;
  fullAnalytics: boolean;
  fullAIMotivation: boolean;
  priorityBadge: boolean;
  customEmojis: boolean;
}

import { TRIAL_DAYS } from "@/lib/plans";
export { TRIAL_DAYS };
export const PRO_PRICE_MONTHLY = 4.99; // USD per month (see src/lib/plans.ts)

const FREE_LIMITS: SubscriptionLimits = {
  maxDailyHabits: 5,
  maxWeeklyHabits: 3,
  maxEmergencySkips: 1,
  weeklyEmailReports: false,
  fullAnalytics: false,
  fullAIMotivation: false,
  priorityBadge: false,
  customEmojis: false,
};

const PREMIUM_LIMITS: SubscriptionLimits = {
  maxDailyHabits: Infinity,
  maxWeeklyHabits: Infinity,
  maxEmergencySkips: 3,
  weeklyEmailReports: true,
  fullAnalytics: true,
  fullAIMotivation: true,
  priorityBadge: true,
  customEmojis: true,
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const refresh = useCallback(() => setReload((n) => n + 1), []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from("user_subscriptions")
      .select("tier, premium_until, is_student, plan, auto_renew")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const active = data?.tier === "premium" && (!data.premium_until || new Date(data.premium_until).getTime() > Date.now());
        setPremiumUntil(data?.premium_until ?? null);
        setIsStudent(!!(data as any)?.is_student);
        setPlan((data as any)?.plan ?? null);
        setAutoRenew(!!(data as any)?.auto_renew);
        if (active) setTier("premium");
        else setTier("free");
        setLoadedFor(user.id);
        setLoading(false);
      });
  }, [user, reload]);

  const createdAt = user?.created_at ? new Date(user.created_at).getTime() : 0;
  const trialEndsAt = createdAt + TRIAL_DAYS * 86400000;
  const trialDaysLeft = createdAt ? Math.max(0, Math.ceil((trialEndsAt - Date.now()) / 86400000)) : 0;
  const isTrial = tier !== "premium" && trialDaysLeft > 0;
  // During the free trial everything is unlocked
  const isPremium = tier === "premium" || isTrial;
  // After the trial a non-paying account is locked until it buys Pro
  const trialExpired = !!user && loadedFor === user.id && tier !== "premium" && trialDaysLeft <= 0;
  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  const canAccess = useCallback(
    (feature: keyof SubscriptionLimits): boolean => {
      const value = limits[feature];
      if (typeof value === "boolean") return value;
      return true; // numeric limits are checked separately
    },
    [limits]
  );

  return { tier, trialExpired, premiumUntil, isStudent, plan, refresh, isPremium, isTrial, trialDaysLeft, loading: loading || (!!user && loadedFor !== user.id), limits, canAccess };
};
