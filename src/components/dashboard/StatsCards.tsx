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
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${currentStreak} days`,
      color: "text-chart-yellow",
      bg: "bg-chart-yellow/10",
    },
    {
      icon: Target,
      label: "Total Habits",
      value: totalHabits.toString(),
      color: "text-chart-purple",
      bg: "bg-chart-purple/10",
    },
    {
      icon: TrendingUp,
      label: "Weekly Progress",
      value: `${weeklyProgress}%`,
      color: "text-chart-green",
      bg: "bg-chart-green/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6"
        >
          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold font-display mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;