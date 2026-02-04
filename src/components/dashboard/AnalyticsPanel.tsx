import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  Flame,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
}

interface AnalyticsPanelProps {
  habits: Habit[];
  daysInMonth: number;
  currentDay: number;
}

type ViewMode = "daily" | "weekly" | "monthly";

const AnalyticsPanel = ({ habits, daysInMonth, currentDay }: AnalyticsPanelProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");

  // Calculate daily data
  const dailyData = useMemo(() => {
    return Array.from({ length: Math.min(currentDay, daysInMonth) }, (_, i) => {
      const day = i + 1;
      const completed = habits.filter(h => h.completedDays.includes(day)).length;
      const percentage = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { 
        label: `Day ${day}`, 
        day,
        completed, 
        percentage,
        total: habits.length 
      };
    });
  }, [habits, currentDay, daysInMonth]);

  // Calculate weekly data
  const weeklyData = useMemo(() => {
    const weeks: { label: string; week: number; completed: number; percentage: number; total: number }[] = [];
    const numWeeks = Math.ceil(daysInMonth / 7);

    for (let w = 0; w < numWeeks; w++) {
      const startDay = w * 7 + 1;
      const endDay = Math.min((w + 1) * 7, daysInMonth, currentDay);
      
      if (startDay > currentDay) break;

      const daysInWeek = Math.min(endDay - startDay + 1, currentDay - startDay + 1);
      let weekCompleted = 0;
      const weekTotal = habits.length * daysInWeek;

      habits.forEach((habit) => {
        habit.completedDays.forEach((day) => {
          if (day >= startDay && day <= endDay) {
            weekCompleted++;
          }
        });
      });

      weeks.push({
        label: `Week ${w + 1}`,
        week: w + 1,
        completed: weekCompleted,
        total: weekTotal,
        percentage: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0,
      });
    }

    return weeks;
  }, [habits, daysInMonth, currentDay]);

  // Calculate monthly data (simulated for multiple months)
  const monthlyData = useMemo(() => {
    const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
    const totalPossible = habits.length * currentDay;
    const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return [
      { label: "This Month", month: 1, completed: totalCompleted, total: totalPossible, percentage }
    ];
  }, [habits, currentDay]);

  const chartData = viewMode === "daily" ? dailyData.slice(-14) : viewMode === "weekly" ? weeklyData : monthlyData;

  // Calculate insights
  const insights = useMemo(() => {
    const avgDaily = dailyData.length > 0 
      ? Math.round(dailyData.reduce((sum, d) => sum + d.percentage, 0) / dailyData.length) 
      : 0;

    const recentAvg = dailyData.slice(-7).length > 0
      ? Math.round(dailyData.slice(-7).reduce((sum, d) => sum + d.percentage, 0) / dailyData.slice(-7).length)
      : 0;

    const olderAvg = dailyData.slice(-14, -7).length > 0
      ? Math.round(dailyData.slice(-14, -7).reduce((sum, d) => sum + d.percentage, 0) / dailyData.slice(-14, -7).length)
      : 0;

    const trend = recentAvg - olderAvg;

    // Best day
    const bestDay = dailyData.reduce((best, day) => 
      day.percentage > (best?.percentage || 0) ? day : best, dailyData[0]);

    // Most consistent habit
    const habitConsistency = habits.map(h => ({
      name: h.name,
      rate: currentDay > 0 ? Math.round((h.completedDays.length / currentDay) * 100) : 0
    })).sort((a, b) => b.rate - a.rate);

    return {
      avgDaily,
      recentAvg,
      trend,
      trendDirection: trend >= 0 ? "up" : "down",
      bestDay,
      topHabit: habitConsistency[0],
      worstHabit: habitConsistency[habitConsistency.length - 1],
    };
  }, [dailyData, habits, currentDay]);

  const barColors = ["hsl(160, 84%, 39%)", "hsl(180, 70%, 50%)", "hsl(262, 83%, 68%)", "hsl(330, 81%, 60%)", "hsl(46, 97%, 64%)"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-chart-purple" />
          <h2 className="text-xl font-bold font-display">Analytics</h2>
        </div>
        <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
          {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(mode)}
              className={cn(
                "h-8 px-3 text-xs capitalize transition-all",
                viewMode === mode && "bg-primary text-primary-foreground shadow-sm"
              )}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 18%)" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="hsl(215, 20%, 55%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={viewMode === "daily" ? 1 : 0}
              angle={viewMode === "daily" ? -45 : 0}
              textAnchor={viewMode === "daily" ? "end" : "middle"}
              height={viewMode === "daily" ? 50 : 30}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 60%, 8%)",
                border: "1px solid hsl(230, 40%, 18%)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px hsl(228, 84%, 3%, 0.6)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              formatter={(value: number, name: string) => [`${value}%`, "Completion Rate"]}
            />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={barColors[index % barColors.length]}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-xl bg-secondary/30 border border-border/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Avg. Rate</span>
          </div>
          <div className="text-xl font-bold">{insights.avgDaily}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="p-3 rounded-xl bg-secondary/30 border border-border/30"
        >
          <div className="flex items-center gap-2 mb-1">
            {insights.trendDirection === "up" ? (
              <TrendingUp className="w-4 h-4 text-primary" />
            ) : (
              <TrendingDown className="w-4 h-4 text-chart-pink" />
            )}
            <span className="text-xs text-muted-foreground">7-Day Trend</span>
          </div>
          <div className={cn(
            "text-xl font-bold flex items-center gap-1",
            insights.trendDirection === "up" ? "text-primary" : "text-chart-pink"
          )}>
            {insights.trend > 0 ? "+" : ""}{insights.trend}%
            {insights.trendDirection === "up" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-xl bg-secondary/30 border border-border/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-chart-yellow" />
            <span className="text-xs text-muted-foreground">Best Day</span>
          </div>
          <div className="text-xl font-bold">
            {insights.bestDay ? `Day ${insights.bestDay.day}` : "-"}
          </div>
          <div className="text-xs text-muted-foreground">
            {insights.bestDay ? `${insights.bestDay.percentage}%` : ""}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="p-3 rounded-xl bg-secondary/30 border border-border/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-chart-cyan" />
            <span className="text-xs text-muted-foreground">Top Habit</span>
          </div>
          <div className="text-sm font-bold truncate">
            {insights.topHabit?.name || "-"}
          </div>
          <div className="text-xs text-muted-foreground">
            {insights.topHabit ? `${insights.topHabit.rate}% consistent` : ""}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;
