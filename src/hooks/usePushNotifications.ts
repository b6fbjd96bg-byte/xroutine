import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "superoutine_push_opted_in";
const LOGIN_COUNT_KEY = "superoutine_login_count";

export const usePushNotifications = () => {
  const [canPrompt, setCanPrompt] = useState(false);
  const [isOptedIn, setIsOptedIn] = useState(false);

  useEffect(() => {
    const optedIn = localStorage.getItem(STORAGE_KEY) === "true";
    setIsOptedIn(optedIn);

    if (!optedIn && "Notification" in window) {
      // Track login count to show prompt after 3 days
      const count = parseInt(localStorage.getItem(LOGIN_COUNT_KEY) || "0", 10) + 1;
      localStorage.setItem(LOGIN_COUNT_KEY, String(count));
      if (count >= 3 && Notification.permission === "default") {
        setCanPrompt(true);
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsOptedIn(true);
      setCanPrompt(false);

      // Register service worker if not already
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/sw.js");
      }
      return true;
    }
    setCanPrompt(false);
    return false;
  }, []);

  const dismissPrompt = useCallback(() => {
    setCanPrompt(false);
  }, []);

  return { canPrompt, isOptedIn, requestPermission, dismissPrompt };
};
