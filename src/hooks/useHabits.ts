import { useState, useEffect, useCallback } from "react";
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

export const useHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyHabits, setWeeklyHabits] = useState<WeeklyHabit[]>([]);
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
    toast({ title: "Habit created! 🌱", description: `"${name}" has been added` });
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
    toast({ title: "Habit updated! ✏️", description: "Changes saved" });
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
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const wasCompleted = habit.completedDays.includes(day);
    const newDays = wasCompleted
      ? habit.completedDays.filter((d) => d !== day)
      : [...habit.completedDays, day].sort((a, b) => a - b);

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
  }, [habits, toast]);

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
    toast({ title: "Weekly habit created! 📅", description: `"${name}" has been added` });
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
    toast({ title: "Habit updated! ✏️", description: "Changes saved" });
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
    const habit = weeklyHabits.find((h) => h.id === habitId);
    if (!habit) return;

    const wasCompleted = habit.completedWeeks.includes(week);
    const newWeeks = wasCompleted
      ? habit.completedWeeks.filter((w) => w !== week)
      : [...habit.completedWeeks, week].sort((a, b) => a - b);

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
  }, [weeklyHabits, toast]);

  return {
    habits, weeklyHabits, loading,
    addHabit, editHabit, deleteHabit, toggleDay,
    addWeeklyHabit, editWeeklyHabit, deleteWeeklyHabit, toggleWeek,
  };
};
