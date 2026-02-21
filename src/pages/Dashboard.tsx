import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import HabitGrid from "@/components/dashboard/HabitGrid";
import MonthSelector from "@/components/dashboard/MonthSelector";
import TrendLineChart from "@/components/dashboard/TrendLineChart";
import WeeklyHabits from "@/components/dashboard/WeeklyHabits";
import AIMotivationAgent from "@/components/dashboard/AIMotivationAgent";
import TodaysFocus from "@/components/dashboard/TodaysFocus";
import QuickStats from "@/components/dashboard/QuickStats";
import TopHabits from "@/components/dashboard/TopHabits";
import XPSystem from "@/components/gamification/XPSystem";
import FloatingXP from "@/components/gamification/FloatingXP";
import StreakProtection from "@/components/gamification/StreakProtection";
import ConfettiCelebration from "@/components/gamification/ConfettiCelebration";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useGameification } from "@/hooks/useGameification";
import { useHabits } from "@/hooks/useHabits";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    habits, weeklyHabits, loading,
    addHabit, editHabit, deleteHabit, toggleDay,
    addWeeklyHabit, editWeeklyHabit, deleteWeeklyHabit, toggleWeek,
  } = useHabits();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const prevCompletedToday = useRef<number>(0);

  const {
    totalXP, emergencySkipsRemaining, emergencySkipsUsed, isStreakProtected,
    xpNotifications, showConfetti,
    addDailyXP, addWeeklyXP, removeXPNotification, useEmergencySkip,
    triggerConfetti, resetConfetti,
  } = useGameification();

  // Show onboarding for new users (no habits and not loading)
  useEffect(() => {
    if (!loading && habits.length === 0) {
      setShowOnboarding(true);
    }
  }, [loading, habits.length]);

  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const numberOfWeeks = Math.ceil(daysInMonth / 7);
  const currentDay =
    currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()
      ? today.getDate()
      : currentMonth > today ? 0 : daysInMonth;

  const completedToday = habits.filter((h) => h.completedDays.includes(currentDay)).length;
  const dailyCompletedForWeek = weeklyHabits.filter(h => h.completedWeeks.includes(Math.ceil(currentDay / 7))).length;

  const trendData = useMemo(() => {
    return Array.from({ length: Math.min(currentDay, daysInMonth) }, (_, i) => {
      const day = i + 1;
      const completed = habits.filter((h) => h.completedDays.includes(day)).length;
      const percentage = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { day, completed, percentage };
    });
  }, [habits, currentDay, daysInMonth]);

  const weeklyProgress = useMemo(() => {
    const weeks: { week: number; completed: number; goal: number; percentage: number }[] = [];
    const numWeeks = Math.ceil(daysInMonth / 7);
    for (let w = 0; w < numWeeks; w++) {
      const startDay = w * 7 + 1;
      const endDay = Math.min((w + 1) * 7, daysInMonth);
      const daysInWeek = endDay - startDay + 1;
      let weekCompleted = 0;
      const weekGoal = habits.length * daysInWeek;
      habits.forEach((habit) => {
        habit.completedDays.forEach((day) => {
          if (day >= startDay && day <= endDay) weekCompleted++;
        });
      });
      weeks.push({ week: w + 1, completed: weekCompleted, goal: weekGoal, percentage: weekGoal > 0 ? Math.round((weekCompleted / weekGoal) * 100) : 0 });
    }
    return weeks;
  }, [habits, daysInMonth]);

  const monthlyCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
  const monthlyTotal = habits.length * currentDay;

  const habitStats = useMemo(() => habits.map((habit) => {
    const completed = habit.completedDays.length;
    const total = habit.goal;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    let currentStreak = 0;
    const sortedDays = [...habit.completedDays].sort((a, b) => b - a);
    for (let i = 0; i < sortedDays.length; i++) {
      if (sortedDays[i] === currentDay - i || sortedDays[i] === currentDay - i - 1) {
        currentStreak++;
      } else break;
    }
    return { name: habit.name, completed, total, percentage: Math.min(percentage, 100), currentStreak, longestStreak: currentStreak };
  }), [habits, currentDay]);

  const maxStreak = Math.max(...habitStats.map((h) => h.currentStreak), 0);
  const avgWeeklyProgress = weeklyProgress.length > 0 ? Math.round(weeklyProgress.reduce((sum, w) => sum + w.percentage, 0) / weeklyProgress.length) : 0;

  const bestDay = useMemo(() => {
    let best = 0, bestDayNum = 0;
    for (let day = 1; day <= currentDay; day++) {
      const completed = habits.filter(h => h.completedDays.includes(day)).length;
      if (completed > best || (completed === habits.length && completed > 0)) {
        best = completed;
        bestDayNum = day;
      }
    }
    return bestDayNum;
  }, [habits, currentDay]);

  const monthlyProgress = monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0;

  useEffect(() => {
    if (habits.length > 0 && completedToday === habits.length && prevCompletedToday.current < habits.length) {
      triggerConfetti();
      toast({ title: "🎉 Perfect Day!", description: "You completed all your habits! Amazing work!" });
    }
    prevCompletedToday.current = completedToday;
  }, [completedToday, habits.length, triggerConfetti, toast]);

  const handleOnboardingComplete = useCallback(async (selectedHabits: { name: string; goal: number }[]) => {
    for (const h of selectedHabits) {
      await addHabit(h.name, h.goal);
    }
    setShowOnboarding(false);
    toast({ title: "🚀 Dashboard ready!", description: `${selectedHabits.length} habits loaded. Start checking them off!` });
  }, [addHabit, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-display text-xl">Loading your habits...</div>
      </div>
    );
  }

  if (showOnboarding && habits.length === 0) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  const userName = user?.user_metadata?.display_name || "there";

  const handleToggleDay = async (habitId: string, day: number, event?: React.MouseEvent) => {
    const newlyCompleted = await toggleDay(habitId, day);
    if (newlyCompleted && day === currentDay) {
      addDailyXP(event);
    }
  };

  const handleToggleWeek = async (habitId: string, week: number, event?: React.MouseEvent) => {
    const newlyCompleted = await toggleWeek(habitId, week);
    if (newlyCompleted) {
      addWeeklyXP(event);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingXP notifications={xpNotifications} onComplete={removeXPNotification} />
      <ConfettiCelebration trigger={showConfetti} onComplete={resetConfetti} />
      <DashboardSidebar />

      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold font-display mb-2">
                <span className="text-gradient">{habits.length === 0 ? `Hey ${userName}!` : "Habit Tracker"}</span>
              </h1>
              <p className="text-muted-foreground">{habits.length === 0 ? "Add your first habit to get started 🌱" : "Track your daily habits and build better routines"}</p>
            </div>
            <MonthSelector currentMonth={currentMonth} onPrevMonth={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); setSelectedDate(null); }} onNextMonth={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); setSelectedDate(null); }} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <XPSystem totalXP={totalXP} dailyCompleted={completedToday} weeklyCompleted={dailyCompletedForWeek} />
            <StreakProtection emergencySkipsRemaining={emergencySkipsRemaining} emergencySkipsUsed={emergencySkipsUsed} isStreakProtected={isStreakProtected} currentStreak={maxStreak} onUseSkip={useEmergencySkip} />
          </div>

          <QuickStats totalHabits={habits.length} completedToday={completedToday} currentStreak={maxStreak} weeklyProgress={avgWeeklyProgress} monthlyProgress={monthlyProgress} bestDay={bestDay} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1">
              <TodaysFocus habits={habits} currentDay={currentDay} onToggleDay={handleToggleDay} />
            </div>
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <HabitGrid habits={habits} daysInMonth={daysInMonth} currentDay={currentDay} onToggleDay={handleToggleDay} onAddHabit={addHabit} onEditHabit={editHabit} onDeleteHabit={deleteHabit} />
            </div>
          </div>

          {habits.length > 0 && <TrendLineChart data={trendData} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <WeeklyHabits habits={weeklyHabits} numberOfWeeks={numberOfWeeks} onToggleWeek={handleToggleWeek} onAddHabit={addWeeklyHabit} onEditHabit={editWeeklyHabit} onDeleteHabit={deleteWeeklyHabit} />
            </div>
            <div className="lg:col-span-1">
              {habitStats.length > 0 && <TopHabits habits={habitStats} />}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/dashboard/calendar" className="glass-card p-4 text-center hover:scale-[1.02] transition-transform group">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-bold font-display group-hover:text-primary transition-colors">Calendar</h3>
              <p className="text-sm text-muted-foreground">View history</p>
            </Link>
            <Link to="/dashboard/analytics" className="glass-card p-4 text-center hover:scale-[1.02] transition-transform group">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold font-display group-hover:text-primary transition-colors">Analytics</h3>
              <p className="text-sm text-muted-foreground">Deep insights</p>
            </Link>
            <Link to="/dashboard/settings" className="glass-card p-4 text-center hover:scale-[1.02] transition-transform group">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-bold font-display group-hover:text-primary transition-colors">Settings</h3>
              <p className="text-sm text-muted-foreground">Customize app</p>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <AIMotivationAgent completedToday={completedToday} totalHabits={habits.length} currentStreak={maxStreak} weeklyProgress={avgWeeklyProgress} />
    </div>
  );
};

export default Dashboard;
