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
  "from-chart-pink to-chart-pink/70",
  "from-chart-purple to-chart-purple/70",
  "from-chart-blue to-chart-blue/70",
  "from-chart-yellow to-chart-yellow/70",
  "from-primary to-primary/70",
];

const WeeklyProgress = ({ weeks }: WeeklyProgressProps) => {
  const maxHeight = 140;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold font-display mb-8">Weekly Progress</h2>
      
      <div className="flex items-end justify-between gap-6">
        {weeks.map((week, index) => (
          <motion.div 
            key={week.week} 
            className="flex-1 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="relative w-full flex justify-center" style={{ height: maxHeight }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: (week.percentage / 100) * maxHeight }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className={`w-full max-w-14 rounded-xl bg-gradient-to-t ${weekColors[index % weekColors.length]} shadow-lg`}
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  maxHeight: `${maxHeight}px`
                }}
              />
            </div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <div className="text-lg font-bold text-foreground">
                {week.percentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                {week.completed}/{week.goal}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">
                Week {week.week}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeeklyProgress;