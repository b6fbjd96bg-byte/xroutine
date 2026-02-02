import { motion } from "framer-motion";
import { Flame } from "lucide-react";

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
  const sortedHabits = [...habits].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold font-display mb-6">Top Daily Habits</h2>
      
      <div className="space-y-4">
        {sortedHabits.map((habit, index) => (
          <motion.div
            key={habit.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-6 text-sm font-medium text-muted-foreground">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{habit.name}</span>
                <span className="text-sm text-primary font-semibold">
                  {habit.percentage}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${habit.percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 text-chart-yellow">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{habit.currentStreak}</span>
            </div>
          </motion.div>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No habits tracked yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHabits;