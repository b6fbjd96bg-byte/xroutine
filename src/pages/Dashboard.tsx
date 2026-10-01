import { BarChart3, CheckCircle2, TrendingUp, CalendarDays, Target, Flame, type LucideIcon } from "lucide-react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import HabitGrid from "@/components/dashboard/HabitGrid";
import MonthSelector from "@/components/dashboard/MonthSelector";
import TrendLineChart from "@/components/dashboard/TrendLineChart";
import WeeklyHabits from "@/components/dashboard/WeeklyHabits";
import AIMotivationAgent from "@/components/dashboard/AIMotivationAgent";
import TodaysFocus from "@/components/dashboard/TodaysFocus";
import QuickStats from "@/components/dashboard/QuickStats";
import TopHabits from "@/components/dashboard/TopHabits";
import MomentumMeter from "@/components/dashboard/MomentumMeter";
import AchievementBadges from "@/components/dashboard/AchievementBadges";
import MoodCheckin from "@/components/dashboard/MoodCheckin";
import ComebackScore from "@/components/dashboard/ComebackScore";
import DailyPlanner from "@/components/dashboard/DailyPlanner";
import DailyJournal from "@/components/dashboard/DailyJournal";
import HabitStreaksCalendar from "@/components/dashboard/HabitStreaksCalendar";
import DashboardFocusTimer from "@/components/dashboard/DashboardFocusTimer";
import XPSystem from "@/components/gamification/XPSystem";
import FloatingXP from "@/components/gamification/FloatingXP";
import StreakProtection from "@/components/gamification/StreakProtection";
import ConfettiCelebration from "@/components/gamification/ConfettiCelebration";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import DailyLoginReward from "@/components/dashboard/DailyLoginReward";
import WelcomeBack from "@/components/dashboard/WelcomeBack";
import WeeklyReportCard from "@/components/dashboard/WeeklyReportCard";
import CommitmentCard from "@/components/dashboard/CommitmentCard";
import MilestoneShare from "@/components/dashboard/MilestoneShare";
import DashboardTour from "@/components/dashboard/DashboardTour";
import PushNotificationPrompt from "@/components/dashboard/PushNotificationPrompt";
import { useGameification } from "@/hooks/useGameification";
import { useHabits } from "@/hooks/useHabits";
import { useDailyLogin } from "@/hooks/useDailyLogin";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {
    habits, weeklyHabits, loading,
    addHabit, editHabit, deleteHabit, toggleDay,
    addWeeklyHabit, editWeeklyHabit, deleteWeeklyHabit, toggleWeek,
  } = useHabits(currentMonth);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const prevCompletedToday = useRef<number>(0);
  const [taskStats, setTaskStats] = useState({ completed: 0, total: 0 });
  const handleTaskStats = useCallback((completed: number, total: number) => {
    setTaskStats(prev => (prev.completed === completed && prev.total === total ? prev : { completed, total }));
  }, []);

  const {
    totalXP, emergencySkipsRemaining, emergencySkipsUsed, isStreakProtected,
    xpNotifications, showConfetti,
    addDailyXP, addWeeklyXP, removeXPNotification, useEmergencySkip,
    triggerConfetti, resetConfetti,
  } = useGameification();

  const {
    streakCount, xpClaimed, isNewLogin, daysAway,
    dismissNewLogin, dismissWelcomeBack,
  } = useDailyLogin();

  const { canPrompt, requestPermission, dismissPrompt } = usePushNotifications();

  // Restore last scroll position on refresh (top on fresh visit)
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const save = () => sessionStorage.setItem("dash_scroll", String(window.scrollY));
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);
  useEffect(() => {
    if (loading) return;
    const y = Number(sessionStorage.getItem("dash_scroll") || 0);
    setTimeout(() => window.scrollTo(0, y), 300);
  }, [loading]);

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
      const isToday = day === currentDay;
      const habitDone = habits.filter((h) => h.completedDays.includes(day)).length;
      const completed = habitDone + (isToday ? taskStats.completed : 0);
      const total = habits.length + (isToday ? taskStats.total : 0);
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { day, completed, percentage };
    });
  }, [habits, currentDay, daysInMonth, taskStats]);

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

  // Show welcome back screen for returning users
  if (daysAway >= 2) {
    return <WelcomeBack daysAway={daysAway} onDismiss={dismissWelcomeBack} />;
  }

  const engaged = monthlyCompleted > 0 || weeklyHabits.some(h => h.completedWeeks.length > 0);
  const userName = user?.user_metadata?.display_name || "there";

  const handleToggleDay = async (habitId: string, day: number, event?: React.MouseEvent) => {
    const newlyCompleted = await toggleDay(habitId, day);
    if (newlyCompleted && day === currentDay && currentMonth.getMonth() === new Date().getMonth()) {
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

      <main className="md:ml-20 p-4 sm:p-6 lg:p-10 relative bg-[radial-gradient(60%_40%_at_70%_0%,hsl(var(--primary)/0.08),transparent),radial-gradient(40%_30%_at_10%_20%,hsl(var(--chart-purple)/0.06),transparent)]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-[1400px] mx-auto space-y-5 sm:space-y-8">
          {/* Daily Login Reward */}
          <DailyLoginReward
            streakCount={streakCount}
            xpClaimed={xpClaimed}
            isNewLogin={isNewLogin}
            onDismiss={dismissNewLogin}
          />

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold font-display mb-2">
                <span className="text-gradient">{habits.length === 0 ? `Hey ${userName}!` : "Habit Tracker"}</span>
              </h1>
              <p className="text-muted-foreground">{habits.length === 0 ? "Add your first habit to get started 🌱" : "Track your daily habits and build better routines"}</p>
            </div>
            <MonthSelector currentMonth={currentMonth} onChange={(d) => { setCurrentMonth(d); setSelectedDate(null); }} onPrevMonth={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); setSelectedDate(null); }} onNextMonth={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); setSelectedDate(null); }} />
          </motion.div>

          {/* Push Notification Prompt */}
          {engaged && <PushNotificationPrompt canPrompt={canPrompt} onAccept={requestPermission} onDismiss={dismissPrompt} />}


          {engaged && <>
          <SectionTitle icon={BarChart3} title="Your Stats" colorClass="from-chart-cyan to-chart-blue" />
          <QuickStats totalHabits={habits.length} completedToday={completedToday} currentStreak={maxStreak} weeklyProgress={avgWeeklyProgress} monthlyProgress={monthlyProgress} bestDay={bestDay} />
          </>}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div id="tour-daily" className="lg:col-span-12 space-y-4">
              <SectionTitle icon={CheckCircle2} title="Daily Habits" colorClass="from-primary to-chart-cyan" />
              <HabitGrid habits={habits} daysInMonth={daysInMonth} currentDay={currentDay} onToggleDay={handleToggleDay} onAddHabit={addHabit} onEditHabit={editHabit} onDeleteHabit={deleteHabit} />
            </div>

            <div id="tour-trend" className="lg:col-span-12"><SectionTitle icon={TrendingUp} title="Daily Completion Trend" colorClass="from-chart-purple to-chart-pink" /></div>
            <div className={habitStats.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}><TrendLineChart data={trendData} /></div>
            {habitStats.length > 0 && <div className="lg:col-span-4"><TopHabits habits={habitStats} /></div>}

            {<>
              <div className="lg:col-span-12"><SectionTitle icon={Target} title="Today's Plan & Focus — daily completion" colorClass="from-chart-blue to-primary" /></div>
              <div className="lg:col-span-4"><TodaysFocus habits={habits} currentDay={currentDay} onToggleDay={handleToggleDay} tasksCompleted={taskStats.completed} tasksTotal={taskStats.total} /></div>
              <div className="lg:col-span-4"><DailyPlanner onStatsChange={handleTaskStats} onTaskCompleted={addDailyXP} /></div>
              <div className="lg:col-span-4 space-y-4"><DashboardFocusTimer habits={habits} /><DailyJournal /></div>
            </>}

            <div className="lg:col-span-12"><SectionTitle icon={CalendarDays} title="Weekly Plans & Habits" colorClass="from-chart-yellow to-chart-pink" /></div>
            <div id="tour-weekly" className="lg:col-span-8">
              <WeeklyHabits habits={weeklyHabits} numberOfWeeks={numberOfWeeks} onToggleWeek={handleToggleWeek} onAddHabit={addWeeklyHabit} onEditHabit={editWeeklyHabit} onDeleteHabit={deleteWeeklyHabit} />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <CommitmentCard />
              {engaged && <WeeklyReportCard habits={habits} totalXP={totalXP} currentDay={currentDay} maxStreak={maxStreak} />}
            </div>

            {engaged && <>
              <div className="lg:col-span-12"><StreakDivider /></div>
              {habits.length > 0 && <div className="lg:col-span-7"><HabitStreaksCalendar habits={habits} currentDay={currentDay} /></div>}
              <div className={habits.length > 0 ? "lg:col-span-5" : "lg:col-span-12"}><MilestoneShare habits={habits} totalXP={totalXP} maxStreak={maxStreak} currentDay={currentDay} /></div>
            </>}
          </div>

          {engaged && <>
          {/* Collapsible advanced sections */}
          <div className="glass-card p-4 sm:p-5">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-display font-semibold text-sm">More Insights & Gamification</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <XPSystem totalXP={totalXP} dailyCompleted={completedToday} weeklyCompleted={dailyCompletedForWeek} />
                      <StreakProtection emergencySkipsRemaining={emergencySkipsRemaining} emergencySkipsUsed={emergencySkipsUsed} isStreakProtected={isStreakProtected} currentStreak={maxStreak} onUseSkip={useEmergencySkip} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <MomentumMeter habits={habits} currentDay={currentDay} />
                      <ComebackScore habits={habits} currentDay={currentDay} />
                    </div>
                    <MoodCheckin completedToday={completedToday} totalHabits={habits.length} />
                    <AchievementBadges habits={habits} currentDay={currentDay} totalXP={totalXP} maxStreak={maxStreak} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          </>}
        </motion.div>
      </main>

      <DashboardTour userId={user?.id} createdAt={user?.created_at} />
      <AIMotivationAgent completedToday={completedToday} totalHabits={habits.length} currentStreak={maxStreak} weeklyProgress={avgWeeklyProgress} />
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, colorClass }: { icon: LucideIcon; title: string; colorClass: string }) => (
  <div className="flex items-center gap-3 pt-4">
    <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" strokeWidth={2.25} /></span>
    <h2 className="text-lg sm:text-xl font-semibold font-display tracking-tight text-foreground">{title}</h2>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const StreakDivider = () => (
  <div className="flex items-center gap-3 pt-6">
    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Streak</span>
    <div className="flex-1 border-t-2 border-dotted border-primary/40" />
  </div>
);

export default Dashboard;
