import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
import { useGameification } from "@/hooks/useGameification";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
  linkedTo?: string;
}

interface WeeklyHabit {
  id: string;
  name: string;
  goal: number;
  completedWeeks: number[];
}

const initialHabits: Habit[] = [
  { id: "1", name: "Running", goal: 16, completedDays: [1, 2, 3, 4, 5, 8, 9, 10, 15, 16, 17, 22, 23, 24] },
  { id: "2", name: "Meditation", goal: 25, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 15, 16, 17, 18, 22, 23] },
  { id: "3", name: "Reading Books", goal: 10, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: "4", name: "Drink 2L of Water", goal: 25, completedDays: [1, 2, 3, 4, 8, 9, 10, 15, 16, 17, 22, 23, 24] },
  { id: "5", name: "Stretching", goal: 28, completedDays: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] },
  { id: "6", name: "Eating Healthy", goal: 25, completedDays: [1, 2, 4, 5, 8, 9, 15, 16, 22, 23, 24] },
  { id: "7", name: "Taking a Bath", goal: 5, completedDays: [1, 8, 15, 22] },
];

const initialWeeklyHabits: WeeklyHabit[] = [
  { id: "w1", name: "Laundry", goal: 5, completedWeeks: [1, 2, 4] },
  { id: "w2", name: "Meal Prep", goal: 5, completedWeeks: [3] },
  { id: "w3", name: "Deep Clean", goal: 4, completedWeeks: [1, 3] },
  { id: "w4", name: "Grocery Shopping", goal: 5, completedWeeks: [1, 2, 3, 4] },
];

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [weeklyHabits, setWeeklyHabits] = useState<WeeklyHabit[]>(initialWeeklyHabits);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const prevCompletedToday = useRef<number>(0);
  const { toast } = useToast();
  
  // Gamification hooks
  const {
    totalXP,
    emergencySkipsRemaining,
    emergencySkipsUsed,
    isStreakProtected,
    xpNotifications,
    showConfetti,
    addDailyXP,
    addWeeklyXP,
    removeXPNotification,
    useEmergencySkip,
    triggerConfetti,
    resetConfetti,
  } = useGameification();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const numberOfWeeks = Math.ceil(daysInMonth / 7);

  const today = new Date();
  const currentDay = 
    currentMonth.getMonth() === today.getMonth() && 
    currentMonth.getFullYear() === today.getFullYear()
      ? today.getDate()
      : currentMonth > today ? 0 : daysInMonth;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleToggleDay = (habitId: string, day: number, event?: React.MouseEvent) => {
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.completedDays.includes(day);
    
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDays.includes(day);
          return {
            ...habit,
            completedDays: isCompleted
              ? habit.completedDays.filter((d) => d !== day)
              : [...habit.completedDays, day].sort((a, b) => a - b),
          };
        }
        return habit;
      })
    );

    // Award XP for completing (not uncompleting)
    if (!wasCompleted && day === currentDay) {
      addDailyXP(event);
      toast({
        title: "Habit completed! 🎯",
        description: `+10 XP earned`,
      });
    }
  };

  const handleToggleWeek = (habitId: string, week: number, event?: React.MouseEvent) => {
    const habit = weeklyHabits.find(h => h.id === habitId);
    const wasCompleted = habit?.completedWeeks.includes(week);
    
    setWeeklyHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedWeeks.includes(week);
          return {
            ...habit,
            completedWeeks: isCompleted
              ? habit.completedWeeks.filter((w) => w !== week)
              : [...habit.completedWeeks, week].sort((a, b) => a - b),
          };
        }
        return habit;
      })
    );

    // Award XP for completing weekly habit
    if (!wasCompleted) {
      addWeeklyXP(event);
      toast({
        title: "Weekly habit completed! 🏆",
        description: `+50 XP earned`,
      });
    }
  };

  const handleAddHabit = (name: string, goal: number, linkedTo?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      goal,
      completedDays: [],
      linkedTo,
    };
    setHabits((prev) => [...prev, newHabit]);
    toast({
      title: "Habit created! 🌱",
      description: `"${name}" has been added to your tracker`,
    });
  };

  const handleEditHabit = (id: string, name: string, goal: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, name, goal } : habit
      )
    );
    toast({
      title: "Habit updated! ✏️",
      description: `Changes saved successfully`,
    });
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: "The habit has been removed",
    });
  };

  const handleAddWeeklyHabit = (name: string, goal: number) => {
    const newHabit: WeeklyHabit = {
      id: `w${Date.now()}`,
      name,
      goal,
      completedWeeks: [],
    };
    setWeeklyHabits((prev) => [...prev, newHabit]);
    toast({
      title: "Weekly habit created! 📅",
      description: `"${name}" has been added`,
    });
  };

  const handleEditWeeklyHabit = (id: string, name: string, goal: number) => {
    setWeeklyHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, name, goal } : habit
      )
    );
    toast({
      title: "Habit updated! ✏️",
      description: `Changes saved successfully`,
    });
  };

  const handleDeleteWeeklyHabit = (id: string) => {
    setWeeklyHabits((prev) => prev.filter((habit) => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: "The weekly habit has been removed",
    });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Calculate daily trend data
  const trendData = useMemo(() => {
    return Array.from({ length: Math.min(currentDay, daysInMonth) }, (_, i) => {
      const day = i + 1;
      const completed = habits.filter((h) => h.completedDays.includes(day)).length;
      const percentage = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { day, completed, percentage };
    });
  }, [habits, currentDay, daysInMonth]);

  // Calculate weekly progress
  const weeklyProgress = useMemo(() => {
    const weeks: { week: number; completed: number; goal: number; percentage: number }[] = [];
    const numWeeks = Math.ceil(daysInMonth / 7);

    for (let w = 0; w < numWeeks; w++) {
      const startDay = w * 7 + 1;
      const endDay = Math.min((w + 1) * 7, daysInMonth);
      const daysInWeek = endDay - startDay + 1;

      let weekCompleted = 0;
      let weekGoal = habits.length * daysInWeek;

      habits.forEach((habit) => {
        habit.completedDays.forEach((day) => {
          if (day >= startDay && day <= endDay) {
            weekCompleted++;
          }
        });
      });

      weeks.push({
        week: w + 1,
        completed: weekCompleted,
        goal: weekGoal,
        percentage: weekGoal > 0 ? Math.round((weekCompleted / weekGoal) * 100) : 0,
      });
    }

    return weeks;
  }, [habits, daysInMonth]);

  // Calculate progress stats
  const dailyCompleted = habits.filter((h) => h.completedDays.includes(currentDay)).length;
  const dailyTotal = habits.length;

  const weeklyCompleted = useMemo(() => {
    const currentWeek = Math.ceil(currentDay / 7);
    const startDay = (currentWeek - 1) * 7 + 1;
    const endDay = Math.min(currentWeek * 7, currentDay);
    let count = 0;
    habits.forEach((habit) => {
      habit.completedDays.forEach((day) => {
        if (day >= startDay && day <= endDay) count++;
      });
    });
    return count;
  }, [habits, currentDay]);

  const weeklyTotal = useMemo(() => {
    const currentWeek = Math.ceil(currentDay / 7);
    const startDay = (currentWeek - 1) * 7 + 1;
    const endDay = Math.min(currentWeek * 7, currentDay);
    return habits.length * (endDay - startDay + 1);
  }, [habits, currentDay]);

  const monthlyCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
  const monthlyTotal = habits.length * currentDay;

  // Calculate habit stats for top habits
  const habitStats = habits.map((habit) => {
    const completed = habit.completedDays.length;
    const total = habit.goal;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedDays = [...habit.completedDays].sort((a, b) => b - a);
    for (let i = 0; i < sortedDays.length; i++) {
      if (sortedDays[i] === currentDay - i || sortedDays[i] === currentDay - i - 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      name: habit.name,
      completed,
      total,
      percentage: Math.min(percentage, 100),
      currentStreak,
      longestStreak: currentStreak,
    };
  });

  const completedToday = habits.filter((h) => h.completedDays.includes(currentDay)).length;
  const dailyCompletedForWeek = weeklyHabits.filter(h => h.completedWeeks.includes(Math.ceil(currentDay / 7))).length;

  // Check for 100% completion and trigger confetti
  useEffect(() => {
    if (habits.length > 0 && completedToday === habits.length && prevCompletedToday.current < habits.length) {
      triggerConfetti();
      toast({
        title: "🎉 Perfect Day!",
        description: "You completed all your habits! Amazing work!",
      });
    }
    prevCompletedToday.current = completedToday;
  }, [completedToday, habits.length, triggerConfetti, toast]);

  const maxStreak = Math.max(...habitStats.map((h) => h.currentStreak), 0);
  const avgWeeklyProgress = weeklyProgress.length > 0
    ? Math.round(weeklyProgress.reduce((sum, w) => sum + w.percentage, 0) / weeklyProgress.length)
    : 0;

   // Calculate best day
   const bestDay = useMemo(() => {
     let best = 0;
     let bestDayNum = 0;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Floating XP Notifications */}
      <FloatingXP notifications={xpNotifications} onComplete={removeXPNotification} />
      
      {/* Confetti Celebration */}
      <ConfettiCelebration trigger={showConfetti} onComplete={resetConfetti} />

      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
           className="max-w-[1400px] mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div>
               <h1 className="text-4xl font-bold font-display mb-2">
                <span className="text-gradient">Habit Tracker</span>
              </h1>
              <p className="text-muted-foreground">Track your daily habits and build better routines</p>
            </div>
            <MonthSelector
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </motion.div>

           {/* XP System & Streak Protection Row */}
           <div className="grid lg:grid-cols-2 gap-4">
             <XPSystem
               totalXP={totalXP}
               dailyCompleted={completedToday}
               weeklyCompleted={dailyCompletedForWeek}
             />
             <StreakProtection
               emergencySkipsRemaining={emergencySkipsRemaining}
               emergencySkipsUsed={emergencySkipsUsed}
               isStreakProtected={isStreakProtected}
               currentStreak={maxStreak}
               onUseSkip={useEmergencySkip}
             />
           </div>

           {/* Quick Stats Row */}
           <QuickStats
            totalHabits={habits.length}
            completedToday={completedToday}
            currentStreak={maxStreak}
            weeklyProgress={avgWeeklyProgress}
             monthlyProgress={monthlyProgress}
             bestDay={bestDay}
          />
           <div className="grid lg:grid-cols-3 gap-6">
             {/* Today's Focus - Most important, leftmost position */}
             <div className="lg:col-span-1">
               <TodaysFocus
                 habits={habits}
                 currentDay={currentDay}
                 onToggleDay={handleToggleDay}
               />
             </div>
 
             {/* Daily Habits Grid - Main content */}
             <div className="lg:col-span-2 space-y-6">
               <HabitGrid
                 habits={habits}
                 daysInMonth={daysInMonth}
                 currentDay={currentDay}
                 onToggleDay={handleToggleDay}
                 onAddHabit={handleAddHabit}
                 onEditHabit={handleEditHabit}
                 onDeleteHabit={handleDeleteHabit}
               />
             </div>
           </div>
 
           {/* Trend Chart - Full width for impact */}
           <TrendLineChart data={trendData} />
 
           {/* Secondary Content */}
           <div className="grid lg:grid-cols-3 gap-6">
             {/* Weekly Habits */}
             <div className="lg:col-span-2">
               <WeeklyHabits
                 habits={weeklyHabits}
                 numberOfWeeks={numberOfWeeks}
                 onToggleWeek={handleToggleWeek}
                 onAddHabit={handleAddWeeklyHabit}
                 onEditHabit={handleEditWeeklyHabit}
                 onDeleteHabit={handleDeleteWeeklyHabit}
               />
             </div>
 
             {/* Top Habits */}
             <div className="lg:col-span-1">
               <TopHabits habits={habitStats} />
             </div>
           </div>
 
           {/* Quick Links to other pages */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="grid grid-cols-3 gap-4"
           >
             <a
               href="/dashboard/calendar"
               className="glass-card p-4 text-center hover:scale-[1.02] transition-transform group"
             >
               <div className="text-3xl mb-2">📅</div>
               <h3 className="font-bold font-display group-hover:text-primary transition-colors">Calendar</h3>
               <p className="text-sm text-muted-foreground">View history</p>
             </a>
             <a
               href="/dashboard/analytics"
               className="glass-card p-4 text-center hover:scale-[1.02] transition-transform group"
             >
               <div className="text-3xl mb-2">📊</div>
               <h3 className="font-bold font-display group-hover:text-primary transition-colors">Analytics</h3>
               <p className="text-sm text-muted-foreground">Deep insights</p>
             </a>
             <a
               href="/dashboard/settings"
               className="glass-card p-4 text-center hover:scale-[1.02] transition-transform group"
             >
               <div className="text-3xl mb-2">⚙️</div>
               <h3 className="font-bold font-display group-hover:text-primary transition-colors">Settings</h3>
               <p className="text-sm text-muted-foreground">Customize app</p>
             </a>
           </motion.div>
         </motion.div>
       </main>
 
       {/* AI Motivation Agent */}
       <AIMotivationAgent
         completedToday={completedToday}
         totalHabits={habits.length}
         currentStreak={maxStreak}
         weeklyProgress={avgWeeklyProgress}
       />
     </div>
   );
 };
 
 export default Dashboard;
