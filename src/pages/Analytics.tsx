import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Flame,
  Download,
  Sparkles,
  Zap,
  Trophy,
  Star,
  ChevronDown,
  FileText,
  Table,
  Activity,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
} from "recharts";

// Sample data
const generateSampleData = () => {
  const habits = [
    { id: "1", name: "Running", goal: 16, completedDays: [1, 2, 3, 4, 5, 8, 9, 10, 15, 16, 17, 22, 23, 24] },
    { id: "2", name: "Meditation", goal: 25, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 15, 16, 17, 18, 22, 23] },
    { id: "3", name: "Reading Books", goal: 10, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: "4", name: "Drink 2L of Water", goal: 25, completedDays: [1, 2, 3, 4, 8, 9, 10, 15, 16, 17, 22, 23, 24] },
    { id: "5", name: "Stretching", goal: 28, completedDays: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] },
    { id: "6", name: "Eating Healthy", goal: 25, completedDays: [1, 2, 4, 5, 8, 9, 15, 16, 22, 23, 24] },
    { id: "7", name: "Taking a Bath", goal: 5, completedDays: [1, 8, 15, 22] },
  ];

  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return { habits, currentDay, daysInMonth };
};

type ViewMode = "daily" | "weekly";
type ExportFormat = "csv" | "json";

const Analytics = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [selectedHabitIndex, setSelectedHabitIndex] = useState<number | null>(null);
  const { habits, currentDay, daysInMonth } = generateSampleData();
  const { toast } = useToast();

  // Calculate daily trend data
  const dailyData = useMemo(() => {
    return Array.from({ length: Math.min(currentDay, daysInMonth) }, (_, i) => {
      const day = i + 1;
      const completed = habits.filter((h) => h.completedDays.includes(day)).length;
      const percentage = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { label: `Day ${day}`, day, completed, percentage, total: habits.length };
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
          if (day >= startDay && day <= endDay) weekCompleted++;
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

  // Habit stats
  const habitStats = useMemo(() => {
    return habits
      .map((habit) => {
        const completed = habit.completedDays.length;
        const percentage = habit.goal > 0 ? Math.round((completed / habit.goal) * 100) : 0;
        return {
          name: habit.name,
          completed,
          goal: habit.goal,
          percentage: Math.min(percentage, 100),
          fill:
            percentage >= 100
              ? "hsl(160, 84%, 39%)"
              : percentage >= 75
              ? "hsl(180, 70%, 50%)"
              : percentage >= 50
              ? "hsl(46, 97%, 64%)"
              : "hsl(340, 85%, 60%)",
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [habits]);

  // Insights
  const insights = useMemo(() => {
    const avgDaily =
      dailyData.length > 0
        ? Math.round(dailyData.reduce((sum, d) => sum + d.percentage, 0) / dailyData.length)
        : 0;
    const recentAvg =
      dailyData.slice(-7).length > 0
        ? Math.round(dailyData.slice(-7).reduce((sum, d) => sum + d.percentage, 0) / dailyData.slice(-7).length)
        : 0;
    const olderAvg =
      dailyData.slice(-14, -7).length > 0
        ? Math.round(
            dailyData.slice(-14, -7).reduce((sum, d) => sum + d.percentage, 0) / dailyData.slice(-14, -7).length
          )
        : 0;
    const trend = recentAvg - olderAvg;
    const bestDay = dailyData.reduce((best, day) => (day.percentage > (best?.percentage || 0) ? day : best), dailyData[0]);
    const perfectDays = dailyData.filter((d) => d.percentage === 100).length;
    const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
    const totalPossible = habits.length * currentDay;
    const consistencyScore = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    return { avgDaily, recentAvg, trend, bestDay, perfectDays, consistencyScore };
  }, [dailyData, habits, currentDay]);

  // Radial chart data
  const radialData = useMemo(() => {
    const colors = ["hsl(160, 84%, 39%)", "hsl(180, 70%, 50%)", "hsl(262, 83%, 68%)", "hsl(330, 81%, 60%)", "hsl(46, 97%, 64%)"];
    return habitStats.slice(0, 5).map((habit, index) => ({
      name: habit.name,
      value: habit.percentage,
      fill: colors[index],
    }));
  }, [habitStats]);

  // Consistency pie data
  const consistencyPieData = useMemo(() => {
    return [
      { name: "Completed", value: insights.consistencyScore, fill: "hsl(160, 84%, 39%)" },
      { name: "Missed", value: 100 - insights.consistencyScore, fill: "hsl(230, 40%, 18%)" },
    ];
  }, [insights.consistencyScore]);

  // Achievement badges
  const achievements = useMemo(() => {
    const badges = [];
    if (insights.perfectDays >= 7) badges.push({ icon: Trophy, label: "Week Warrior", color: "text-chart-yellow" });
    if (insights.avgDaily >= 80) badges.push({ icon: Star, label: "High Achiever", color: "text-chart-cyan" });
    if (habitStats.some((h) => h.percentage >= 100)) badges.push({ icon: Zap, label: "Goal Crusher", color: "text-primary" });
    if (insights.trend > 10) badges.push({ icon: Sparkles, label: "Rising Star", color: "text-chart-purple" });
    return badges;
  }, [insights, habitStats]);

  const chartData = viewMode === "daily" ? dailyData.slice(-14) : weeklyData;
  const barColors = ["hsl(160, 84%, 39%)", "hsl(180, 70%, 50%)", "hsl(262, 83%, 68%)", "hsl(330, 81%, 60%)", "hsl(46, 97%, 64%)"];

  // Export
  const handleExport = (format: ExportFormat) => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      summary: { averageCompletion: insights.avgDaily, perfectDays: insights.perfectDays, trend: insights.trend, bestDay: insights.bestDay?.day },
      habits: habitStats,
      dailyData,
      weeklyData,
    };
    let content: string;
    let filename: string;
    let mimeType: string;
    if (format === "json") {
      content = JSON.stringify(exportData, null, 2);
      filename = `routinex-analytics-${new Date().toISOString().split("T")[0]}.json`;
      mimeType = "application/json";
    } else {
      const csvRows = [["Habit Name", "Completed Days", "Goal", "Completion %"], ...habitStats.map((h) => [h.name, h.completed, h.goal, `${h.percentage}%`])];
      content = csvRows.map((row) => row.join(",")).join("\n");
      filename = `routinex-analytics-${new Date().toISOString().split("T")[0]}.csv`;
      mimeType = "text/csv";
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export Successful! 📊", description: `Your analytics data has been downloaded as ${format.toUpperCase()}.` });
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <motion.div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-chart-purple" />
                </motion.div>
                <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-sm text-muted-foreground">Deep insights into your habit performance</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export Data</span>
                  <span className="sm:hidden">Export</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2 cursor-pointer">
                  <Table className="w-4 h-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Achievement Badges */}
          <AnimatePresence>
            {achievements.length > 0 && (
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 sm:gap-3">
                {achievements.map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    className="glass-card px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2"
                  >
                    <badge.icon className={cn("w-4 h-4", badge.color)} />
                    <span className="text-xs sm:text-sm font-medium">{badge.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "Avg Completion", value: `${insights.avgDaily}%`, icon: Target, color: "text-primary" },
              { label: "7-Day Trend", value: `${insights.trend > 0 ? "+" : ""}${insights.trend}%`, icon: insights.trend >= 0 ? TrendingUp : TrendingDown, color: insights.trend >= 0 ? "text-primary" : "text-chart-pink" },
              { label: "Perfect Days", value: `${insights.perfectDays}`, icon: Award, color: "text-chart-yellow" },
              { label: "Best Day", value: insights.bestDay ? `Day ${insights.bestDay.day}` : "-", icon: Flame, color: "text-chart-cyan" },
              { label: "Consistency", value: `${insights.consistencyScore}%`, icon: Activity, color: "text-chart-purple" },
            ].map((metric) => (
              <motion.div key={metric.label} variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} className="glass-card p-3 sm:p-5 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <metric.icon className={cn("w-4 h-4", metric.color)} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className={cn("text-xl sm:text-2xl lg:text-3xl font-bold font-display", metric.color)}>{metric.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Charts Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Completion Trend */}
            <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-xl font-bold font-display">Completion Trend</h2>
                <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
                  {(["daily", "weekly"] as ViewMode[]).map((mode) => (
                    <Button key={mode} variant="ghost" size="sm" onClick={() => setViewMode(mode)} className={cn("h-7 sm:h-8 px-2 sm:px-3 text-xs capitalize", viewMode === mode && "bg-primary text-primary-foreground")}>
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-[200px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 18%)" vertical={false} />
                    <XAxis dataKey="label" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }} formatter={(value: number) => [`${value}%`, "Completion"]} />
                    <Area type="monotone" dataKey="percentage" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#colorArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Habit Performance */}
            <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-bold font-display mb-4 sm:mb-6">Habit Performance</h2>
              <div className="h-[200px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={habitStats} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 18%)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="hsl(215, 20%, 55%)" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={10} width={80} tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }} formatter={(value: number) => [`${value}%`, "Progress"]} />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                      {habitStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>

          {/* Consistency Score + Top 5 Habits + Goal Progress */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Consistency Ring */}
            <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-base sm:text-xl font-bold font-display mb-4 w-full">Consistency Score</h2>
              <div className="h-[180px] sm:h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={consistencyPieData} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                      {consistencyPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center -mt-6">
                <div className="text-3xl sm:text-4xl font-bold font-display text-primary">{insights.consistencyScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Overall Consistency</p>
              </div>
            </motion.div>

            {/* Radial Habit Comparison */}
            <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-bold font-display mb-4">Top 5 Habits</h2>
              <div className="h-[180px] sm:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }} formatter={(value: number) => [`${value}%`, "Progress"]} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {radialData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground truncate max-w-[70px] sm:max-w-[90px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Goal Progress List */}
            <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
              <h2 className="text-base sm:text-xl font-bold font-display mb-4">Goal Progress</h2>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {habitStats.map((habit, i) => (
                  <motion.div
                    key={habit.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className={cn(
                      "p-3 rounded-xl bg-secondary/30 border border-border/20 cursor-pointer transition-all",
                      selectedHabitIndex === i && "border-primary/50 bg-primary/5"
                    )}
                    onClick={() => setSelectedHabitIndex(selectedHabitIndex === i ? null : i)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs sm:text-sm font-medium truncate max-w-[120px]">{habit.name}</span>
                      <span className="text-xs font-bold" style={{ color: habit.fill }}>{habit.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: habit.fill }}
                        initial={{ width: 0 }}
                        animate={{ width: `${habit.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">{habit.completed} done</span>
                      <span className="text-[10px] text-muted-foreground">{habit.goal} goal</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Daily Breakdown */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-xl font-bold font-display flex items-center gap-2">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-chart-cyan" />
                Daily Breakdown
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Last {Math.min(currentDay, daysInMonth)} days
              </div>
            </div>
            <div className="h-[160px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 18%)" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={9} tickLine={false} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }} formatter={(value: number) => [`${value}%`, "Completion"]} labelFormatter={(label) => `Day ${label}`} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {dailyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pro Insight */}
          <motion.div variants={itemVariants} className="glass-card p-4 sm:p-6 border-l-4 border-primary">
            <div className="flex items-start gap-3 sm:gap-4">
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
              </motion.div>
              <div>
                <h3 className="font-bold font-display text-sm sm:text-lg mb-1 sm:mb-2">Pro Insight</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {insights.trend > 0
                    ? `Great momentum! Your completion rate is up ${insights.trend}% compared to last week. Keep pushing!`
                    : insights.avgDaily >= 70
                    ? `Solid performance at ${insights.avgDaily}% average! Try focusing on your lowest-performing habit to boost overall results.`
                    : `Room for growth! Start with just 2-3 habits daily to build consistency, then gradually add more.`}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;
