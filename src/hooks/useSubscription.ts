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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from("user_subscriptions")
      .select("tier")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.tier === "premium") setTier("premium");
        else setTier("free");
        setLoading(false);
      });
  }, [user]);

  const isPremium = tier === "premium";
  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  const canAccess = useCallback(
    (feature: keyof SubscriptionLimits): boolean => {
      const value = limits[feature];
      if (typeof value === "boolean") return value;
      return true; // numeric limits are checked separately
    },
    [limits]
  );

  return { tier, isPremium, loading, limits, canAccess };
};
