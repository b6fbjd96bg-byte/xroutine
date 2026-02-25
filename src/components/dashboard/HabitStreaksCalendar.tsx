import { useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Habit } from "@/hooks/useHabits";

interface HabitStreaksCalendarProps {
  habits: Habit[];
  currentDay: number;
}

const HabitStreaksCalendar = ({ habits, currentDay }: HabitStreaksCalendarProps) => {
  const cells = useMemo(() => {
    const result: { day: number; count: number; total: number; percentage: number }[] = [];
    for (let d = 1; d <= currentDay; d++) {
      const count = habits.filter(h => h.completedDays.includes(d)).length;
      const total = habits.length;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      result.push({ day: d, count, total, percentage });
    }
    return result;
  }, [habits, currentDay]);

  const getColor = (percentage: number) => {
    if (percentage === 0) return "bg-secondary/50";
    if (percentage < 25) return "bg-primary/20";
    if (percentage < 50) return "bg-primary/40";
    if (percentage < 75) return "bg-primary/60";
    return "bg-primary";
  };

  if (habits.length === 0) return null;

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-sm">🔥 Habit Streaks</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 25, 50, 75, 100].map(p => (
            <div key={p} className={`w-3 h-3 rounded-sm ${getColor(p)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {cells.map((cell, i) => (
          <Tooltip key={cell.day}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`w-4 h-4 rounded-sm cursor-default ${getColor(cell.percentage)} transition-colors`}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>Day {cell.day}: {cell.count}/{cell.total} habits ({cell.percentage}%)</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default HabitStreaksCalendar;
