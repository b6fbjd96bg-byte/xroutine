import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DailyLoginState {
  streakCount: number;
  xpClaimed: number;
  isNewLogin: boolean;
  loaded: boolean;
  daysAway: number;
}

const XP_PER_DAY = [5, 10, 15, 20, 25, 35, 50]; // Day 1-7 rewards

export const useDailyLogin = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DailyLoginState>({
    streakCount: 0,
    xpClaimed: 0,
    isNewLogin: false,
    loaded: false,
    daysAway: 0,
  });

  useEffect(() => {
    if (!user) return;

    const checkLogin = async () => {
      const today = new Date().toISOString().split("T")[0];

      // Check if already logged in today
      const { data: todayLogin } = await supabase
        .from("daily_logins")
        .select("*")
        .eq("user_id", user.id)
        .eq("login_date", today)
        .maybeSingle();

      if (todayLogin) {
        setState({
          streakCount: todayLogin.streak_count,
          xpClaimed: todayLogin.xp_claimed,
          isNewLogin: false,
          loaded: true,
          daysAway: 0,
        });
        return;
      }

      // Get yesterday's login to calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const { data: yesterdayLogin } = await supabase
        .from("daily_logins")
        .select("*")
        .eq("user_id", user.id)
        .eq("login_date", yesterdayStr)
        .maybeSingle();

      // Calculate days away
      const { data: lastLogin } = await supabase
        .from("daily_logins")
        .select("login_date")
        .eq("user_id", user.id)
        .order("login_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      let daysAway = 0;
      if (lastLogin) {
        const lastDate = new Date(lastLogin.login_date);
        const todayDate = new Date(today);
        daysAway = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      const newStreak = yesterdayLogin ? yesterdayLogin.streak_count + 1 : 1;
      const xpReward = XP_PER_DAY[Math.min(newStreak - 1, XP_PER_DAY.length - 1)];

      // Insert today's login
      await supabase.from("daily_logins").insert({
        user_id: user.id,
        login_date: today,
        streak_count: newStreak,
        xp_claimed: xpReward,
      });

      setState({
        streakCount: newStreak,
        xpClaimed: xpReward,
        isNewLogin: true,
        loaded: true,
        daysAway: daysAway > 1 ? daysAway : 0,
      });
    };

    checkLogin();
  }, [user]);

  const dismissNewLogin = useCallback(() => {
    setState((prev) => ({ ...prev, isNewLogin: false }));
  }, []);

  const dismissWelcomeBack = useCallback(() => {
    setState((prev) => ({ ...prev, daysAway: 0 }));
  }, []);

  return {
    streakCount: state.streakCount,
    xpClaimed: state.xpClaimed,
    isNewLogin: state.isNewLogin,
    loaded: state.loaded,
    daysAway: state.daysAway,
    dismissNewLogin,
    dismissWelcomeBack,
  };
};
