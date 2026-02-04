import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Target } from "lucide-react";

interface EnhancedProgressChartProps {
  dailyCompleted: number;
  dailyTotal: number;
  weeklyCompleted: number;
  weeklyTotal: number;
  monthlyCompleted: number;
  monthlyTotal: number;
}

type ProgressView = "daily" | "weekly" | "monthly";

const EnhancedProgressChart = ({
  dailyCompleted,
  dailyTotal,
  weeklyCompleted,
  weeklyTotal,
  monthlyCompleted,
  monthlyTotal,
}: EnhancedProgressChartProps) => {
  const [view, setView] = useState<ProgressView>("daily");

  const getProgressData = () => {
    switch (view) {
      case "daily":
        return { completed: dailyCompleted, total: dailyTotal, label: "Today" };
      case "weekly":
        return { completed: weeklyCompleted, total: weeklyTotal, label: "This Week" };
      case "monthly":
        return { completed: monthlyCompleted, total: monthlyTotal, label: "This Month" };
    }
  };

  const progressData = getProgressData();
  const percentage = progressData.total > 0 
    ? Math.round((progressData.completed / progressData.total) * 100) 
    : 0;
  const remaining = progressData.total - progressData.completed;

  const data = [
    { name: "Completed", value: progressData.completed },
    { name: "Remaining", value: remaining > 0 ? remaining : 0 },
  ];

  const COLORS = {
    daily: ["hsl(160, 84%, 39%)", "hsl(230, 40%, 14%)"],
    weekly: ["hsl(180, 70%, 50%)", "hsl(230, 40%, 14%)"],
    monthly: ["hsl(262, 83%, 68%)", "hsl(230, 40%, 14%)"],
  };

  const viewIcons = {
    daily: Clock,
    weekly: Calendar,
    monthly: Target,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6"
    >
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display">Progress</h2>
        <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
          {(["daily", "weekly", "monthly"] as ProgressView[]).map((v) => {
            const Icon = viewIcons[v];
            return (
              <Button
                key={v}
                variant="ghost"
                size="sm"
                onClick={() => setView(v)}
                className={cn(
                  "h-8 px-2 text-xs capitalize transition-all",
                  view === v && "bg-primary text-primary-foreground shadow-sm"
                )}
              >
                <Icon className="w-3 h-3 mr-1" />
                {v}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-40 h-40 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[view][index % COLORS[view].length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              key={`${view}-${percentage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-gradient"
            >
              {percentage}%
            </motion.div>
            <div className="text-xs text-muted-foreground">{progressData.label}</div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 pt-4 border-t border-border/30"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Completed</span>
          <span className="font-bold text-primary">{progressData.completed}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-bold">{remaining > 0 ? remaining : 0}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold text-muted-foreground">{progressData.total}</span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[view][0] }} />
          <span className="text-xs text-muted-foreground">Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="text-xs text-muted-foreground">Left</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedProgressChart;
