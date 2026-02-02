import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

interface HabitStats {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  currentStreak: number;
  longestStreak: number;
}

interface TopHabitsProps {
  habits: HabitStats[];
}

const TopHabits = ({ habits }: TopHabitsProps) => {
  const sortedHabits = [...habits].sort((a, b) => b.percentage - a.percentage).slice(0, 7);

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-chart-yellow";
    if (index === 1) return "text-muted-foreground";
    if (index === 2) return "text-chart-yellow/60";
    return "text-muted-foreground/50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-chart-yellow" />
        <h2 className="text-xl font-bold font-display">Top Habits</h2>
      </div>
      
      <div className="space-y-4">
        {sortedHabits.map((habit, index) => (
          <motion.div
            key={habit.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            className="group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 text-sm font-bold ${getMedalColor(index)}`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {habit.name}
                  </span>
                  <span className="text-sm text-primary font-bold">
                    {habit.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${habit.percentage}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full bg-gradient-to-r from-primary to-chart-cyan rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 text-chart-yellow min-w-[40px] justify-end">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{habit.currentStreak}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No habits tracked yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopHabits;