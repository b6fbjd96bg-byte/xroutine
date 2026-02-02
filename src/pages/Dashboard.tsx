import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import HabitGrid from "@/components/dashboard/HabitGrid";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import ProgressChart from "@/components/dashboard/ProgressChart";
import TopHabits from "@/components/dashboard/TopHabits";
import StatsCards from "@/components/dashboard/StatsCards";
import MonthSelector from "@/components/dashboard/MonthSelector";
import TrendLineChart from "@/components/dashboard/TrendLineChart";
import WeeklyHabits from "@/components/dashboard/WeeklyHabits";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
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
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleToggleDay = (habitId: string, day: number) => {
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
  };

  const handleToggleWeek = (habitId: string, week: number) => {
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
  };

  const handleAddHabit = (name: string, goal: number) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      goal,
      completedDays: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleAddWeeklyHabit = (name: string, goal: number) => {
    const newHabit: WeeklyHabit = {
      id: `w${Date.now()}`,
      name,
      goal,
      completedWeeks: [],
    };
    setWeeklyHabits((prev) => [...prev, newHabit]);
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

  // Calculate total progress
  const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
  const totalPossible = habits.reduce((sum, h) => sum + Math.min(currentDay, h.goal), 0);

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
  const maxStreak = Math.max(...habitStats.map((h) => h.currentStreak), 0);
  const avgWeeklyProgress = weeklyProgress.length > 0
    ? Math.round(weeklyProgress.reduce((sum, w) => sum + w.percentage, 0) / weeklyProgress.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-[1600px] mx-auto space-y-8"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">
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

          {/* Stats Cards */}
          <StatsCards
            totalHabits={habits.length}
            completedToday={completedToday}
            currentStreak={maxStreak}
            weeklyProgress={avgWeeklyProgress}
          />

          {/* Trend Chart */}
          <TrendLineChart data={trendData} />

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <HabitGrid
                habits={habits}
                daysInMonth={daysInMonth}
                currentDay={currentDay}
                onToggleDay={handleToggleDay}
                onAddHabit={handleAddHabit}
              />
              <WeeklyHabits
                habits={weeklyHabits}
                numberOfWeeks={numberOfWeeks}
                onToggleWeek={handleToggleWeek}
                onAddHabit={handleAddWeeklyHabit}
              />
            </div>
            <div className="space-y-8">
              <ProgressChart completed={totalCompleted} total={totalPossible} />
              <TopHabits habits={habitStats} />
            </div>
          </div>

          {/* Weekly Progress */}
          <WeeklyProgress weeks={weeklyProgress} />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;