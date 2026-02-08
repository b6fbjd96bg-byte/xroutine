import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  X,
  Target,
  Flame,
  TrendingUp,
  Filter,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// Sample data
const generateSampleData = () => {
  return [
    { id: "1", name: "Running", goal: 16, completedDays: [1, 2, 3, 4, 5, 8, 9, 10, 15, 16, 17, 22, 23, 24] },
    { id: "2", name: "Meditation", goal: 25, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 15, 16, 17, 18, 22, 23] },
    { id: "3", name: "Reading Books", goal: 10, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: "4", name: "Drink 2L of Water", goal: 25, completedDays: [1, 2, 3, 4, 8, 9, 10, 15, 16, 17, 22, 23, 24] },
    { id: "5", name: "Stretching", goal: 28, completedDays: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] },
    { id: "6", name: "Eating Healthy", goal: 25, completedDays: [1, 2, 4, 5, 8, 9, 15, 16, 22, 23, 24] },
    { id: "7", name: "Taking a Bath", goal: 5, completedDays: [1, 8, 15, 22] },
  ];
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterHabit, setFilterHabit] = useState<string | null>(null);
  const habits = generateSampleData();

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const today = new Date();
  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
  const currentDay = isCurrentMonth ? today.getDate() : -1;

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNamesMobile = ["M", "T", "W", "T", "F", "S", "S"];

  const filteredHabits = filterHabit ? habits.filter((h) => h.id === filterHabit) : habits;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const getDayCompletionRate = (day: number) => {
    if (filteredHabits.length === 0) return 0;
    const completed = filteredHabits.filter((h) => h.completedDays.includes(day)).length;
    return (completed / filteredHabits.length) * 100;
  };

  const getDayColor = (rate: number) => {
    if (rate === 0) return "bg-secondary/30";
    if (rate < 30) return "bg-chart-pink/40";
    if (rate < 60) return "bg-chart-yellow/50";
    if (rate < 90) return "bg-chart-cyan/60";
    return "bg-primary/80";
  };

  const getCompletedHabits = (day: number) => habits.filter((h) => h.completedDays.includes(day));
  const getIncompleteHabits = (day: number) => habits.filter((h) => !h.completedDays.includes(day));

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const selectedDayNumber = selectedDate?.getDate() || null;
  const isSelectedInCurrentMonth = selectedDate && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();

  // Monthly stats
  const monthlyStats = useMemo(() => {
    let totalCompleted = 0;
    let totalPossible = 0;
    let perfectDays = 0;
    const maxDay = isCurrentMonth ? currentDay : daysInMonth;
    for (let day = 1; day <= maxDay; day++) {
      const completed = habits.filter((h) => h.completedDays.includes(day)).length;
      totalCompleted += completed;
      totalPossible += habits.length;
      if (completed === habits.length) perfectDays++;
    }

    // Streak calculation
    let streak = 0;
    for (let day = maxDay; day >= 1; day--) {
      const completed = habits.filter((h) => h.completedDays.includes(day)).length;
      if (completed === habits.length) streak++;
      else break;
    }

    // Best week
    let bestWeekPct = 0;
    let bestWeekNum = 1;
    const numWeeks = Math.ceil(daysInMonth / 7);
    for (let w = 0; w < numWeeks; w++) {
      const startDay = w * 7 + 1;
      const endDay = Math.min((w + 1) * 7, maxDay);
      if (startDay > maxDay) break;
      let weekCompleted = 0;
      let weekTotal = 0;
      for (let d = startDay; d <= endDay; d++) {
        weekCompleted += habits.filter((h) => h.completedDays.includes(d)).length;
        weekTotal += habits.length;
      }
      const pct = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
      if (pct > bestWeekPct) {
        bestWeekPct = pct;
        bestWeekNum = w + 1;
      }
    }

    return {
      completionRate: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      perfectDays,
      currentStreak: streak,
      bestWeek: { num: bestWeekNum, pct: bestWeekPct },
    };
  }, [habits, currentDay, daysInMonth, isCurrentMonth]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <motion.div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <span className="text-gradient">Calendar</span>
              </h1>
              <p className="text-sm text-muted-foreground">View your habit completion history</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 sm:h-9 sm:w-9">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <span className="font-display font-bold text-base sm:text-xl min-w-[140px] sm:min-w-[180px] text-center">
                {monthName} {year}
              </span>
              <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 sm:h-9 sm:w-9">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Monthly Completion", value: `${monthlyStats.completionRate}%`, icon: Target, color: "text-primary" },
              { label: "Perfect Days", value: `${monthlyStats.perfectDays}`, icon: Flame, color: "text-chart-yellow" },
              { label: "Current Streak", value: `${monthlyStats.currentStreak}`, icon: TrendingUp, color: "text-chart-cyan" },
              { label: "Best Week", value: `W${monthlyStats.bestWeek.num} (${monthlyStats.bestWeek.pct}%)`, icon: BarChart3, color: "text-chart-purple" },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ scale: 1.02, y: -2 }} className="glass-card p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", stat.color)} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className={cn("text-lg sm:text-2xl font-bold font-display", stat.color)}>{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Habit Filter */}
          <motion.div variants={itemVariants} className="glass-card p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Filter by habit</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterHabit(null)}
                className={cn("h-7 sm:h-8 text-xs px-2 sm:px-3 rounded-lg", !filterHabit && "bg-primary text-primary-foreground")}
              >
                All Habits
              </Button>
              {habits.map((h) => (
                <Button
                  key={h.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterHabit(filterHabit === h.id ? null : h.id)}
                  className={cn("h-7 sm:h-8 text-xs px-2 sm:px-3 rounded-lg", filterHabit === h.id && "bg-primary text-primary-foreground")}
                >
                  {h.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Calendar Grid */}
          <motion.div variants={itemVariants} className="glass-card p-3 sm:p-6 lg:p-8">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-2 sm:mb-4">
              {dayNames.map((day, i) => (
                <div key={day} className="text-center text-[10px] sm:text-sm font-semibold text-muted-foreground py-1 sm:py-2">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{dayNamesMobile[i]}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
              {calendarDays.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} className="aspect-square" />;

                const completionRate = getDayCompletionRate(day);
                const isToday = day === currentDay;
                const isPast = isCurrentMonth ? day < currentDay : currentMonth < today;
                const isFuture = isCurrentMonth ? day > currentDay : currentMonth > today;
                const isSelected = isSelectedInCurrentMonth && day === selectedDayNumber;

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(new Date(year, currentMonth.getMonth(), day))}
                    className={cn(
                      "aspect-square rounded-lg sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300",
                      getDayColor(completionRate),
                      isToday && "ring-2 ring-primary ring-offset-1 sm:ring-offset-2 ring-offset-background",
                      isSelected && "ring-2 ring-chart-cyan ring-offset-1 sm:ring-offset-2 ring-offset-background",
                      isFuture && "opacity-40 cursor-not-allowed",
                      "hover:shadow-lg"
                    )}
                  >
                    <span className={cn("text-xs sm:text-lg font-bold", isToday && "text-primary", completionRate === 100 && "text-primary-foreground")}>
                      {day}
                    </span>
                    {isPast && completionRate > 0 && (
                      <span className="text-[8px] sm:text-xs text-foreground/70 font-medium hidden xs:inline">
                        {Math.round(completionRate)}%
                      </span>
                    )}
                    {completionRate === 100 && isPast && (
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-chart-yellow rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-background" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-border/30">
              {[
                { color: "bg-secondary/30", label: "0%" },
                { color: "bg-chart-pink/40", label: "1-30%" },
                { color: "bg-chart-yellow/50", label: "31-60%" },
                { color: "bg-chart-cyan/60", label: "61-90%" },
                { color: "bg-primary/80", label: "91-100%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={cn("w-3 h-3 sm:w-4 sm:h-4 rounded", item.color)} />
                  <span className="text-[10px] sm:text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Selected Day Details */}
          <AnimatePresence>
            {isSelectedInCurrentMonth && selectedDayNumber && (
              <motion.div initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: 20, height: 0 }} className="glass-card p-4 sm:p-6">
                <h3 className="text-base sm:text-xl font-bold font-display mb-3 sm:mb-4">
                  {selectedDate?.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
                </h3>

                {/* Day summary bar */}
                <div className="mb-4 p-3 rounded-xl bg-secondary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Daily Score</span>
                    <span className="text-sm sm:text-base font-bold text-primary">
                      {Math.round(getDayCompletionRate(selectedDayNumber))}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${getDayCompletionRate(selectedDayNumber)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Completed ({getCompletedHabits(selectedDayNumber).length})
                    </p>
                    <div className="space-y-1.5 sm:space-y-2">
                      {getCompletedHabits(selectedDayNumber).map((habit) => (
                        <div key={habit.id} className="p-2.5 sm:p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
                          {habit.name}
                        </div>
                      ))}
                      {getCompletedHabits(selectedDayNumber).length === 0 && <p className="text-xs sm:text-sm text-muted-foreground">No habits completed</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-chart-pink" />
                      Missed ({getIncompleteHabits(selectedDayNumber).length})
                    </p>
                    <div className="space-y-1.5 sm:space-y-2">
                      {getIncompleteHabits(selectedDayNumber).map((habit) => (
                        <div key={habit.id} className="p-2.5 sm:p-3 rounded-xl bg-chart-pink/10 border border-chart-pink/20 text-chart-pink text-xs sm:text-sm font-medium">
                          {habit.name}
                        </div>
                      ))}
                      {getIncompleteHabits(selectedDayNumber).length === 0 && <p className="text-xs sm:text-sm text-muted-foreground">All habits completed! 🎉</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Habit Streaks Overview */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold font-display mb-3 sm:mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-chart-yellow" />
              Habit Streaks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {habits.map((habit) => {
                const maxDay = isCurrentMonth ? currentDay : daysInMonth;
                let streak = 0;
                for (let d = maxDay; d >= 1; d--) {
                  if (habit.completedDays.includes(d)) streak++;
                  else break;
                }
                const completionRate = maxDay > 0 ? Math.round((habit.completedDays.length / maxDay) * 100) : 0;
                return (
                  <motion.div key={habit.id} whileHover={{ scale: 1.02 }} className="p-3 rounded-xl bg-secondary/30 border border-border/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium truncate max-w-[140px]">{habit.name}</span>
                      <div className="flex items-center gap-1">
                        <Flame className={cn("w-3.5 h-3.5", streak > 0 ? "text-chart-yellow" : "text-muted-foreground")} />
                        <span className={cn("text-xs font-bold", streak > 0 ? "text-chart-yellow" : "text-muted-foreground")}>{streak}d</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completionRate}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">{habit.completedDays.length} days done</span>
                      <span className="text-[10px] text-muted-foreground">{completionRate}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CalendarPage;
