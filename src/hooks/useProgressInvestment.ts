import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/** What the user has built so far — shown so they see what they'd keep by going Pro. */
export type Investment = { habits: number; checkIns: number; tasksDone: number; xp: number; days: number };

export const useProgressInvestment = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Investment | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("habits").select("completed_days").eq("user_id", user.id),
      supabase.from("weekly_habits").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("todos").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true),
      supabase.from("user_gamification").select("total_xp").eq("user_id", user.id).maybeSingle(),
    ]).then(([h, w, t, g]) => {
      const list = h.data || [];
      setData({
        habits: list.length + (w.count || 0),
        checkIns: list.reduce((s, r) => s + (r.completed_days?.length || 0), 0),
        tasksDone: t.count || 0,
        xp: g.data?.total_xp || 0,
        days: Math.max(1, Math.ceil((Date.now() - new Date(user.created_at).getTime()) / 86400000)),
      });
    });
  }, [user]);

  return data;
};
