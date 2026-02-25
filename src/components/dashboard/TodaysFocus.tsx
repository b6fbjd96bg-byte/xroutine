import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Target, Flame, Trophy, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FocusTimer from "@/components/gamification/FocusTimer";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
}

interface TodaysFocusProps {
  habits: Habit[];
  currentDay: number;
  onToggleDay: (habitId: string, day: number, event?: React.MouseEvent) => void;
}

const focusTimerHabits = ["meditation", "reading", "study", "work", "focus", "deep work", "writing"];

const TodaysFocus = ({ habits, currentDay, onToggleDay }: TodaysFocusProps) => {
  const [focusTimerHabit, setFocusTimerHabit] = useState<Habit | null>(null);

  const completedToday = habits.filter(h => h.completedDays.includes(currentDay));
  const pendingToday = habits.filter(h => !h.completedDays.includes(currentDay));
  const completionPercentage = habits.length > 0
    ? Math.round((completedToday.length / habits.length) * 100)
    : 0;

  const canHaveFocusTimer = (name: string) =>
    focusTimerHabits.some(h => name.toLowerCase().includes(h));

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) return "🎉 Perfect day!";
    if (completionPercentage >= 75) return "🔥 Almost there!";
    if (completionPercentage >= 50) return "💪 Halfway done!";
    if (completionPercentage >= 25) return "🌱 Good start!";
    return "☀️ Let's go!";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Compact header with inline progress */}
        <div className="flex items-center gap-4 mb-4">
          {/* Mini progress ring */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
              <motion.circle
                cx="50" cy="50" r="40" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="10" strokeLinecap="round"
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${completionPercentage * 2.512} 251.2` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {completionPercentage === 100 ? (
                <Trophy className="w-5 h-5 text-chart-yellow" />
              ) : (
                <span className="text-xs font-bold">{completionPercentage}%</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{getGreeting()}</p>
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Today's Focus
            </h2>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              {completedToday.length}/{habits.length}
            </span>
            <p className="text-xs text-muted-foreground">{getMotivationalMessage()}</p>
          </div>
        </div>

        {/* Compact habit list */}
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
          {pendingToday.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/20 hover:border-primary/30 transition-all group cursor-pointer"
              onClick={(e) => onToggleDay(habit.id, currentDay, e)}
            >
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary transition-colors flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
              </div>
              <span className="flex-1 text-sm font-medium truncate">{habit.name}</span>
              {canHaveFocusTimer(habit.name) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusTimerHabit(habit);
                  }}
                >
                  <Play className="w-3.5 h-3.5 text-primary" />
                </Button>
              )}
            </motion.div>
          ))}

          {completedToday.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/10 transition-all cursor-pointer hover:bg-primary/10"
              onClick={(e) => onToggleDay(habit.id, currentDay, e)}
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium text-muted-foreground line-through truncate">{habit.name}</span>
            </motion.div>
          ))}
        </div>

        {habits.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">No habits yet. Add one to get started!</p>
        )}
      </div>

      {focusTimerHabit && (
        <FocusTimer
          habitName={focusTimerHabit.name}
          isOpen={!!focusTimerHabit}
          onClose={() => setFocusTimerHabit(null)}
          onComplete={() => {
            if (focusTimerHabit) onToggleDay(focusTimerHabit.id, currentDay);
            setFocusTimerHabit(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default TodaysFocus;
