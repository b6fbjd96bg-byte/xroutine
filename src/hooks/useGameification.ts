import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface XPNotification {
  id: string;
  amount: number;
  x: number;
  y: number;
}

interface GameState {
  totalXP: number;
  emergencySkipsRemaining: number;
  emergencySkipsUsed: number;
  isStreakProtected: boolean;
}

export const useGameification = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    totalXP: 0,
    emergencySkipsRemaining: 1,
    emergencySkipsUsed: 0,
    isStreakProtected: false,
  });
  const [xpNotifications, setXpNotifications] = useState<XPNotification[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from DB
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setGameState({
            totalXP: data.total_xp,
            emergencySkipsRemaining: data.emergency_skips_remaining,
            emergencySkipsUsed: data.emergency_skips_used,
            isStreakProtected: false,
          });
        }
        setLoaded(true);
      });
  }, [user]);

  // Persist to DB on change
  useEffect(() => {
    if (!user || !loaded) return;
    supabase
      .from("user_gamification")
      .update({
        total_xp: gameState.totalXP,
        emergency_skips_remaining: gameState.emergencySkipsRemaining,
        emergency_skips_used: gameState.emergencySkipsUsed,
      })
      .eq("user_id", user.id)
      .then();
  }, [gameState, user, loaded]);

  const addXP = useCallback((amount: number, event?: React.MouseEvent) => {
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    setXpNotifications((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, amount, x, y }]);
    setGameState((prev) => ({ ...prev, totalXP: prev.totalXP + amount }));
  }, []);

  const removeXPNotification = useCallback((id: string) => {
    setXpNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addDailyXP = useCallback((event?: React.MouseEvent) => addXP(10, event), [addXP]);
  const addWeeklyXP = useCallback((event?: React.MouseEvent) => addXP(50, event), [addXP]);

  const useEmergencySkip = useCallback(() => {
    if (gameState.emergencySkipsRemaining > 0) {
      setGameState((prev) => ({
        ...prev,
        emergencySkipsRemaining: prev.emergencySkipsRemaining - 1,
        emergencySkipsUsed: prev.emergencySkipsUsed + 1,
        isStreakProtected: true,
      }));
    }
  }, [gameState.emergencySkipsRemaining]);

  const triggerConfetti = useCallback(() => setShowConfetti(true), []);
  const resetConfetti = useCallback(() => setShowConfetti(false), []);

  return {
    totalXP: gameState.totalXP,
    emergencySkipsRemaining: gameState.emergencySkipsRemaining,
    emergencySkipsUsed: gameState.emergencySkipsUsed,
    isStreakProtected: gameState.isStreakProtected,
    xpNotifications, showConfetti,
    addXP, addDailyXP, addWeeklyXP, removeXPNotification,
    useEmergencySkip, triggerConfetti, resetConfetti,
  };
};
