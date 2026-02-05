 import { useState } from "react";
 import { motion } from "framer-motion";
 import {
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Area,
   AreaChart,
   ReferenceLine,
 } from "recharts";
 import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
 import { cn } from "@/lib/utils";

interface TrendData {
  day: number;
  completed: number;
  percentage: number;
}

interface TrendLineChartProps {
  data: TrendData[];
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
   // Calculate trend
   const avgCompletion = data.length > 0 
     ? Math.round(data.reduce((sum, d) => sum + d.completed, 0) / data.length) 
     : 0;
   
   const recentData = data.slice(-7);
   const olderData = data.slice(-14, -7);
   
   const recentAvg = recentData.length > 0 
     ? recentData.reduce((sum, d) => sum + d.completed, 0) / recentData.length 
     : 0;
   const olderAvg = olderData.length > 0 
     ? olderData.reduce((sum, d) => sum + d.completed, 0) / olderData.length 
     : recentAvg;
   
   const trend = recentAvg - olderAvg;
   const trendPercentage = olderAvg > 0 ? Math.round((trend / olderAvg) * 100) : 0;
 
   // Find best and worst days
   const bestDay = data.reduce((best, current) => 
     current.completed > (best?.completed || 0) ? current : best, data[0]);
   const worstDay = data.reduce((worst, current) => 
     current.completed < (worst?.completed || Infinity) ? current : worst, data[0]);
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
       className="glass-card p-6 relative overflow-hidden"
    >
       {/* Decorative gradient */}
       <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      
       <div className="relative z-10">
         {/* Header with stats */}
         <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
               <BarChart3 className="w-5 h-5 text-primary" />
             </div>
             <div>
               <h2 className="text-xl font-bold font-display">Daily Completion Trend</h2>
               <p className="text-sm text-muted-foreground">Last {data.length} days</p>
             </div>
           </div>
           
           <div className="flex items-center gap-6">
             {/* Trend indicator */}
             <div className="text-right">
               <div className="flex items-center gap-2 justify-end">
                 {trend >= 0 ? (
                   <TrendingUp className="w-4 h-4 text-primary" />
                 ) : (
                   <TrendingDown className="w-4 h-4 text-chart-pink" />
                 )}
                 <span className={cn(
                   "text-lg font-bold",
                   trend >= 0 ? "text-primary" : "text-chart-pink"
                 )}>
                   {trend >= 0 ? "+" : ""}{trendPercentage}%
                 </span>
               </div>
               <p className="text-xs text-muted-foreground">7-day trend</p>
             </div>
             
             {/* Average */}
             <div className="text-right">
               <span className="text-lg font-bold text-chart-cyan">{avgCompletion}</span>
               <p className="text-xs text-muted-foreground">avg/day</p>
             </div>
           </div>
         </div>
 
         {/* Chart */}
         <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.5} />
                   <stop offset="50%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                   <stop offset="50%" stopColor="hsl(180, 70%, 50%)" />
                <stop offset="100%" stopColor="hsl(180, 70%, 50%)" />
              </linearGradient>
                 <filter id="glow">
                   <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                   <feMerge>
                     <feMergeNode in="coloredBlur" />
                     <feMergeNode in="SourceGraphic" />
                   </feMerge>
                 </filter>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(230, 40%, 18%)" 
              vertical={false}
                 opacity={0.5}
            />
            <XAxis 
              dataKey="day" 
              stroke="hsl(215, 20%, 55%)"
                 fontSize={10}
              tickLine={false}
              axisLine={false}
                 interval={data.length > 20 ? 2 : 0}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
               <ReferenceLine 
                 y={avgCompletion} 
                 stroke="hsl(180, 70%, 50%)" 
                 strokeDasharray="5 5" 
                 strokeOpacity={0.5}
               />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 60%, 8%)",
                border: "1px solid hsl(230, 40%, 18%)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px hsl(228, 84%, 3%, 0.6)",
                   padding: "12px 16px",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              itemStyle={{ color: "hsl(160, 84%, 39%)" }}
              formatter={(value: number) => [`${value} habits`, "Completed"]}
              labelFormatter={(label) => `Day ${label}`}
                 cursor={{ stroke: "hsl(160, 84%, 39%)", strokeWidth: 1, strokeDasharray: "5 5" }}
            />
            <Area
                 type="natural"
              dataKey="completed"
              stroke="url(#lineGradient)"
                 strokeWidth={3.5}
              fill="url(#colorCompleted)"
              dot={false}
              activeDot={{
                   r: 7,
                fill: "hsl(160, 84%, 39%)",
                stroke: "hsl(228, 84%, 5%)",
                   strokeWidth: 3,
                   filter: "url(#glow)",
              }}
                 animationDuration={1500}
                 animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
         </div>
 
         {/* Quick stats */}
         <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-xs text-muted-foreground">
                 Best: Day {bestDay?.day || "-"} ({bestDay?.completed || 0} habits)
               </span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-chart-pink" />
               <span className="text-xs text-muted-foreground">
                 Needs work: Day {worstDay?.day || "-"} ({worstDay?.completed || 0} habits)
               </span>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-8 h-0.5 bg-chart-cyan/50" style={{ borderStyle: "dashed", borderWidth: "1px 0 0 0" }} />
             <span className="text-xs text-muted-foreground">Average line</span>
           </div>
      </div>
       </div>
    </motion.div>
  );
};

export default TrendLineChart;