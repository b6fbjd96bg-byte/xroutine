import { motion } from "framer-motion";
import { Target, Flame, TrendingUp, CheckCircle2 } from "lucide-react";

interface StatsCardsProps {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  weeklyProgress: number;
}

const StatsCards = ({ totalHabits, completedToday, currentStreak, weeklyProgress }: StatsCardsProps) => {
  const stats = [
    {
      icon: CheckCircle2,
      label: "Completed Today",
      value: `${completedToday}/${totalHabits}`,
      color: "text-primary",
      bg: "bg-primary/10",
      glow: "shadow-primary/20",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${currentStreak} days`,
      color: "text-chart-yellow",
      bg: "bg-chart-yellow/10",
      glow: "shadow-chart-yellow/20",
    },
    {
      icon: Target,
      label: "Total Habits",
      value: totalHabits.toString(),
      color: "text-chart-purple",
      bg: "bg-chart-purple/10",
      glow: "shadow-chart-purple/20",
    },
    {
      icon: TrendingUp,
      label: "Weekly Progress",
      value: `${weeklyProgress}%`,
      color: "text-chart-cyan",
      bg: "bg-chart-cyan/10",
      glow: "shadow-chart-cyan/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className={`glass-card p-6 cursor-default`}
        >
          <motion.div 
            className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </motion.div>
          <motion.div 
            className="text-3xl font-bold font-display mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {stat.value}
          </motion.div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;