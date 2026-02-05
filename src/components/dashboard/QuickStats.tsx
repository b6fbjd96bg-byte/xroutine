 import { motion } from "framer-motion";
 import { TrendingUp, TrendingDown, Flame, Calendar, Target, Award, Zap, Star } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface QuickStatsProps {
   totalHabits: number;
   completedToday: number;
   currentStreak: number;
   weeklyProgress: number;
   monthlyProgress: number;
   bestDay: number;
 }
 
 const QuickStats = ({
   totalHabits,
   completedToday,
   currentStreak,
   weeklyProgress,
   monthlyProgress,
   bestDay,
 }: QuickStatsProps) => {
   const stats = [
     {
       label: "Today's Progress",
       value: totalHabits > 0 ? `${Math.round((completedToday / totalHabits) * 100)}%` : "0%",
       subValue: `${completedToday}/${totalHabits}`,
       icon: Target,
       color: "text-primary",
       bgColor: "bg-primary/10",
     },
     {
       label: "Current Streak",
       value: `${currentStreak}`,
       subValue: currentStreak === 1 ? "day" : "days",
       icon: Flame,
       color: "text-chart-yellow",
       bgColor: "bg-chart-yellow/10",
     },
     {
       label: "This Week",
       value: `${weeklyProgress}%`,
       subValue: weeklyProgress >= 70 ? "Great!" : weeklyProgress >= 50 ? "Good" : "Keep going",
       icon: Zap,
       color: "text-chart-purple",
       bgColor: "bg-chart-purple/10",
       trend: weeklyProgress >= 50 ? "up" : "down",
     },
     {
       label: "This Month",
       value: `${monthlyProgress}%`,
       subValue: "completion",
       icon: Calendar,
       color: "text-chart-cyan",
       bgColor: "bg-chart-cyan/10",
     },
     {
       label: "Best Day",
       value: bestDay > 0 ? `Day ${bestDay}` : "-",
       subValue: "100% completed",
       icon: Award,
       color: "text-chart-pink",
       bgColor: "bg-chart-pink/10",
     },
     {
       label: "Total Habits",
       value: `${totalHabits}`,
       subValue: "being tracked",
       icon: Star,
       color: "text-chart-blue",
       bgColor: "bg-chart-blue/10",
     },
   ];
 
   return (
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
       {stats.map((stat, index) => (
         <motion.div
           key={stat.label}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: index * 0.05 }}
           className="glass-card p-4 relative overflow-hidden group hover:scale-[1.02] transition-transform"
         >
           <div className={cn(
             "absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center",
             stat.bgColor
           )}>
             <stat.icon className={cn("w-4 h-4", stat.color)} />
           </div>
           
           <div className="pt-1">
             <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
             <div className="flex items-baseline gap-2">
               <span className={cn("text-2xl font-bold font-display", stat.color)}>
                 {stat.value}
               </span>
               {stat.trend && (
                 stat.trend === "up" ? (
                   <TrendingUp className="w-4 h-4 text-primary" />
                 ) : (
                   <TrendingDown className="w-4 h-4 text-chart-pink" />
                 )
               )}
             </div>
             <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
           </div>
         </motion.div>
       ))}
     </div>
   );
 };
 
 export default QuickStats;