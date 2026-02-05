 import { useState, useMemo } from "react";
 import { motion } from "framer-motion";
 import { Link } from "react-router-dom";
 import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Target, Award, Flame, Calendar, Download } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
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
   LineChart,
   Line,
   PieChart,
   Pie,
 } from "recharts";
 
 // Sample data - in real app, this would come from state/props/context
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
 
 type ViewMode = "daily" | "weekly" | "monthly";
 
 const Analytics = () => {
   const [viewMode, setViewMode] = useState<ViewMode>("weekly");
   const { habits, currentDay, daysInMonth } = generateSampleData();
 
   // Calculate daily trend data
   const dailyData = useMemo(() => {
     return Array.from({ length: Math.min(currentDay, daysInMonth) }, (_, i) => {
       const day = i + 1;
       const completed = habits.filter(h => h.completedDays.includes(day)).length;
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
 
   // Calculate habit stats
   const habitStats = useMemo(() => {
     return habits.map(habit => {
       const completed = habit.completedDays.length;
       const percentage = habit.goal > 0 ? Math.round((completed / habit.goal) * 100) : 0;
       return {
         name: habit.name,
         completed,
         goal: habit.goal,
         percentage: Math.min(percentage, 100),
         fill: percentage >= 100 ? "hsl(160, 84%, 39%)" : percentage >= 75 ? "hsl(180, 70%, 50%)" : percentage >= 50 ? "hsl(46, 97%, 64%)" : "hsl(340, 85%, 60%)"
       };
     }).sort((a, b) => b.percentage - a.percentage);
   }, [habits]);
 
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
     const bestDay = dailyData.reduce((best, day) => 
       day.percentage > (best?.percentage || 0) ? day : best, dailyData[0]);
 
     const perfectDays = dailyData.filter(d => d.percentage === 100).length;
 
     return { avgDaily, recentAvg, trend, bestDay, perfectDays };
   }, [dailyData]);
 
   const chartData = viewMode === "daily" ? dailyData.slice(-14) : weeklyData;
   const barColors = ["hsl(160, 84%, 39%)", "hsl(180, 70%, 50%)", "hsl(262, 83%, 68%)", "hsl(330, 81%, 60%)", "hsl(46, 97%, 64%)"];
 
   return (
     <div className="min-h-screen bg-background p-8">
       <div className="max-w-[1600px] mx-auto space-y-8">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center justify-between"
         >
           <div className="flex items-center gap-4">
             <Link to="/dashboard">
               <Button variant="ghost" size="icon">
                 <ArrowLeft className="w-5 h-5" />
               </Button>
             </Link>
             <div>
               <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                 <BarChart3 className="w-8 h-8 text-chart-purple" />
                 <span className="text-gradient">Analytics</span>
               </h1>
               <p className="text-muted-foreground">Deep insights into your habit performance</p>
             </div>
           </div>
           <Button variant="outline" className="gap-2">
             <Download className="w-4 h-4" />
             Export Data
           </Button>
         </motion.div>
 
         {/* Key Metrics */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Average Completion", value: `${insights.avgDaily}%`, icon: Target, color: "text-primary", trend: null },
             { label: "7-Day Trend", value: `${insights.trend > 0 ? '+' : ''}${insights.trend}%`, icon: insights.trend >= 0 ? TrendingUp : TrendingDown, color: insights.trend >= 0 ? "text-primary" : "text-chart-pink", trend: insights.trend >= 0 ? "up" : "down" },
             { label: "Perfect Days", value: `${insights.perfectDays}`, icon: Award, color: "text-chart-yellow", trend: null },
             { label: "Best Day", value: insights.bestDay ? `Day ${insights.bestDay.day}` : "-", icon: Flame, color: "text-chart-cyan", trend: null },
           ].map((metric, index) => (
             <motion.div
               key={metric.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               className="glass-card p-6"
             >
               <div className="flex items-center gap-2 mb-2">
                 <metric.icon className={cn("w-5 h-5", metric.color)} />
                 <span className="text-sm text-muted-foreground">{metric.label}</span>
               </div>
               <div className={cn("text-3xl font-bold font-display", metric.color)}>
                 {metric.value}
               </div>
             </motion.div>
           ))}
         </div>
 
         {/* Main Charts */}
         <div className="grid lg:grid-cols-2 gap-6">
           {/* Completion Trend */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-card p-6"
           >
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold font-display">Completion Trend</h2>
               <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
                 {(["daily", "weekly"] as ViewMode[]).map((mode) => (
                   <Button
                     key={mode}
                     variant="ghost"
                     size="sm"
                     onClick={() => setViewMode(mode)}
                     className={cn(
                       "h-8 px-3 text-xs capitalize",
                       viewMode === mode && "bg-primary text-primary-foreground"
                     )}
                   >
                     {mode}
                   </Button>
                 ))}
               </div>
             </div>
             <div className="h-[300px]">
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
                   <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                   <Tooltip
                     contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }}
                     formatter={(value: number) => [`${value}%`, "Completion"]}
                   />
                   <Area type="monotone" dataKey="percentage" stroke="hsl(160, 84%, 39%)" strokeWidth={3} fill="url(#colorArea)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </motion.div>
 
           {/* Habit Performance */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="glass-card p-6"
           >
             <h2 className="text-xl font-bold font-display mb-6">Habit Performance</h2>
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={habitStats} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 18%)" horizontal={false} />
                   <XAxis type="number" domain={[0, 100]} stroke="hsl(215, 20%, 55%)" fontSize={11} tickFormatter={(v) => `${v}%`} />
                   <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={100} />
                   <Tooltip
                     contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }}
                     formatter={(value: number) => [`${value}%`, "Progress"]}
                   />
                   <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                     {habitStats.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.fill} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </motion.div>
         </div>
 
         {/* Daily Breakdown */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="glass-card p-6"
         >
           <h2 className="text-xl font-bold font-display mb-6">Daily Breakdown</h2>
           <div className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 18%)" vertical={false} />
                 <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} />
                 <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                 <Tooltip
                   contentStyle={{ backgroundColor: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 18%)", borderRadius: "12px" }}
                   formatter={(value: number) => [`${value}%`, "Completion"]}
                   labelFormatter={(label) => `Day ${label}`}
                 />
                 <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                   {dailyData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} fillOpacity={0.8} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
         </motion.div>
       </div>
     </div>
   );
 };
 
 export default Analytics;