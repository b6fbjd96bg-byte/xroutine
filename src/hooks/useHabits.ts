import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
  linkedTo?: string;
}

export interface WeeklyHabit {
  id: string;
  name: string;
  goal: number;
  completedWeeks: number[];
}

const monthKey = (d: Date) => d.getFullYear() * 100 + d.getMonth() + 1; // e.g. 202610
// Daily ticks are stored as YYYYMMDD; weekly ticks as YYYYMM*10 + week
const daysFor = (raw: number[], mk: number) => raw.filter((v) => Math.floor(v / 100) === mk).map((v) => v % 100);
const weeksFor = (raw: number[], mk: number) => raw.filter((v) => Math.floor(v / 10) === mk).map((v) => v % 10);

export const useHabits = (viewMonth: Date = new Date()) => {
  const mk = monthKey(viewMonth);
  const { user } = useAuth();
  const { toast } = useToast();
  const [rawHabits, setHabits] = useState<Habit[]>([]);
  const [rawWeekly, setWeeklyHabits] = useState<WeeklyHabit[]>([]);
  const habits = useMemo(() => rawHabits.map((h) => ({ ...h, completedDays: daysFor(h.completedDays, mk) })), [rawHabits, mk]);
  const weeklyHabits = useMemo(() => rawWeekly.map((h) => ({ ...h, completedWeeks: weeksFor(h.completedWeeks, mk) })), [rawWeekly, mk]);
  const [loading, setLoading] = useState(true);

  // Fetch habits from DB
  const fetchHabits = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching habits:", error);
      return;
    }

    setHabits(
      (data || []).map((h) => ({
        id: h.id,
        name: h.name,
        goal: h.goal,
        completedDays: h.completed_days || [],
        linkedTo: h.linked_to || undefined,
      }))
    );
  }, [user]);

  const fetchWeeklyHabits = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("weekly_habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching weekly habits:", error);
      return;
    }

    setWeeklyHabits(
      (data || []).map((h) => ({
        id: h.id,
        name: h.name,
        goal: h.goal,
        completedWeeks: h.completed_weeks || [],
      }))
    );
  }, [user]);

  useEffect(() => {
    if (user) {
      Promise.all([fetchHabits(), fetchWeeklyHabits()]).then(() => setLoading(false));
    }
  }, [user, fetchHabits, fetchWeeklyHabits]);

  // Daily habit CRUD
  const addHabit = useCallback(async (name: string, goal: number, linkedTo?: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("habits")
      .insert({ user_id: user.id, name, goal, linked_to: linkedTo || null })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setHabits((prev) => [...prev, {
      id: data.id, name: data.name, goal: data.goal,
      completedDays: data.completed_days || [], linkedTo: data.linked_to || undefined,
    }]);
    toast({ title: "Habit created!", description: `"${name}" has been added` });
  }, [user, toast]);

  const editHabit = useCallback(async (id: string, name: string, goal: number) => {
    const { error } = await supabase
      .from("habits")
      .update({ name, goal })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name, goal } : h)));
    toast({ title: "Habit updated!", description: "Changes saved" });
  }, [toast]);

  const deleteHabit = useCallback(async (id: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
    toast({ title: "Habit deleted", description: "The habit has been removed" });
  }, [toast]);

  const toggleDay = useCallback(async (habitId: string, day: number) => {
    const habit = rawHabits.find((h) => h.id === habitId);
    if (!habit) return;
    const code = mk * 100 + day;
    const wasCompleted = habit.completedDays.includes(code);
    const newDays = wasCompleted
      ? habit.completedDays.filter((d) => d !== code)
      : [...habit.completedDays, code].sort((a, b) => a - b);

    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, completedDays: newDays } : h))
    );

    const { error } = await supabase
      .from("habits")
      .update({ completed_days: newDays })
      .eq("id", habitId);

    if (error) {
      // Revert on error
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, completedDays: habit.completedDays } : h))
      );
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }

    return !wasCompleted; // true if newly completed
  }, [rawHabits, mk, toast]);

  // Weekly habit CRUD
  const addWeeklyHabit = useCallback(async (name: string, goal: number) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("weekly_habits")
      .insert({ user_id: user.id, name, goal })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setWeeklyHabits((prev) => [...prev, {
      id: data.id, name: data.name, goal: data.goal,
      completedWeeks: data.completed_weeks || [],
    }]);
    toast({ title: "Weekly habit created!", description: `"${name}" has been added` });
  }, [user, toast]);

  const editWeeklyHabit = useCallback(async (id: string, name: string, goal: number) => {
    const { error } = await supabase
      .from("weekly_habits")
      .update({ name, goal })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setWeeklyHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name, goal } : h)));
    toast({ title: "Habit updated!", description: "Changes saved" });
  }, [toast]);

  const deleteWeeklyHabit = useCallback(async (id: string) => {
    const { error } = await supabase.from("weekly_habits").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setWeeklyHabits((prev) => prev.filter((h) => h.id !== id));
    toast({ title: "Habit deleted", description: "The weekly habit has been removed" });
  }, [toast]);

  const toggleWeek = useCallback(async (habitId: string, week: number) => {
    const habit = rawWeekly.find((h) => h.id === habitId);
    if (!habit) return;
    const code = mk * 10 + week;
    const wasCompleted = habit.completedWeeks.includes(code);
    const newWeeks = wasCompleted
      ? habit.completedWeeks.filter((w) => w !== code)
      : [...habit.completedWeeks, code].sort((a, b) => a - b);

    setWeeklyHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, completedWeeks: newWeeks } : h))
    );

    const { error } = await supabase
      .from("weekly_habits")
      .update({ completed_weeks: newWeeks })
      .eq("id", habitId);

    if (error) {
      setWeeklyHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, completedWeeks: habit.completedWeeks } : h))
      );
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }

    return !wasCompleted;
  }, [rawWeekly, mk, toast]);

  return {
    habits, weeklyHabits, loading,
    addHabit, editHabit, deleteHabit, toggleDay,
    addWeeklyHabit, editWeeklyHabit, deleteWeeklyHabit, toggleWeek,
  };
};
