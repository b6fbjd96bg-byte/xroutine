import { useState, useCallback, useEffect } from "react";

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
  lastSkipDate: string | null;
}

const STORAGE_KEY = "routinex_game_state";

const getInitialState = (): GameState => {
  if (typeof window === "undefined") {
    return {
      totalXP: 0,
      emergencySkipsRemaining: 1,
      emergencySkipsUsed: 0,
      isStreakProtected: false,
      lastSkipDate: null,
    };
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset skips at the start of each month
      const now = new Date();
      const lastReset = parsed.lastMonthReset ? new Date(parsed.lastMonthReset) : null;
      if (!lastReset || lastReset.getMonth() !== now.getMonth()) {
        return {
          ...parsed,
          emergencySkipsRemaining: 1,
          emergencySkipsUsed: 0,
          isStreakProtected: false,
          lastMonthReset: now.toISOString(),
        };
      }
      return parsed;
    }
  } catch {}
  
  return {
    totalXP: 0,
    emergencySkipsRemaining: 1,
    emergencySkipsUsed: 0,
    isStreakProtected: false,
    lastSkipDate: null,
  };
};

export const useGameification = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [xpNotifications, setXpNotifications] = useState<XPNotification[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const addXP = useCallback((amount: number, event?: React.MouseEvent) => {
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    const notification: XPNotification = {
      id: `${Date.now()}-${Math.random()}`,
      amount,
      x,
      y,
    };

    setXpNotifications((prev) => [...prev, notification]);
    setGameState((prev) => ({
      ...prev,
      totalXP: prev.totalXP + amount,
    }));
  }, []);

  const removeXPNotification = useCallback((id: string) => {
    setXpNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addDailyXP = useCallback((event?: React.MouseEvent) => {
    addXP(10, event);
  }, [addXP]);

  const addWeeklyXP = useCallback((event?: React.MouseEvent) => {
    addXP(50, event);
  }, [addXP]);

  const useEmergencySkip = useCallback(() => {
    if (gameState.emergencySkipsRemaining > 0) {
      setGameState((prev) => ({
        ...prev,
        emergencySkipsRemaining: prev.emergencySkipsRemaining - 1,
        emergencySkipsUsed: prev.emergencySkipsUsed + 1,
        isStreakProtected: true,
        lastSkipDate: new Date().toISOString(),
      }));
    }
  }, [gameState.emergencySkipsRemaining]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const resetConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return {
    totalXP: gameState.totalXP,
    emergencySkipsRemaining: gameState.emergencySkipsRemaining,
    emergencySkipsUsed: gameState.emergencySkipsUsed,
    isStreakProtected: gameState.isStreakProtected,
    xpNotifications,
    showConfetti,
    addXP,
    addDailyXP,
    addWeeklyXP,
    removeXPNotification,
    useEmergencySkip,
    triggerConfetti,
    resetConfetti,
  };
};
