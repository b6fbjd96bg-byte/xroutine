import { motion } from "framer-motion";

interface WeekData {
  week: number;
  completed: number;
  goal: number;
  percentage: number;
}

interface WeeklyProgressProps {
  weeks: WeekData[];
}

const weekColors = [
  "bg-chart-pink",
  "bg-chart-purple",
  "bg-chart-blue",
  "bg-chart-yellow",
  "bg-primary",
];

const WeeklyProgress = ({ weeks }: WeeklyProgressProps) => {
  const maxHeight = 120;

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold font-display mb-6">Weekly Progress</h2>
      
      <div className="flex items-end justify-between gap-4">
        {weeks.map((week, index) => (
          <div key={week.week} className="flex-1 flex flex-col items-center gap-3">
            <div className="relative w-full flex justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: (week.percentage / 100) * maxHeight }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full max-w-12 rounded-t-lg ${weekColors[index % weekColors.length]}`}
                style={{ maxHeight: `${maxHeight}px` }}
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-foreground">
                {week.percentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                {week.completed}/{week.goal}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Week {week.week}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;