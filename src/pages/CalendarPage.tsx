 import { useState, useMemo } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Link } from "react-router-dom";
 import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X, Target, Flame } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 
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
 
   return habits;
 };
 
 const CalendarPage = () => {
   const [currentMonth, setCurrentMonth] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const habits = generateSampleData();
 
   const monthName = currentMonth.toLocaleString("default", { month: "long" });
   const year = currentMonth.getFullYear();
   const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
   const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();
   const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
 
   const today = new Date();
   const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
   const currentDay = isCurrentMonth ? today.getDate() : -1;
 
   const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
 
   const handlePrevMonth = () => {
     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
     setSelectedDate(null);
   };
 
   const handleNextMonth = () => {
     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
     setSelectedDate(null);
   };
 
   const getDayCompletionRate = (day: number) => {
     if (habits.length === 0) return 0;
     const completed = habits.filter(h => h.completedDays.includes(day)).length;
     return (completed / habits.length) * 100;
   };
 
   const getDayColor = (rate: number) => {
     if (rate === 0) return "bg-secondary/30";
     if (rate < 30) return "bg-chart-pink/40";
     if (rate < 60) return "bg-chart-yellow/50";
     if (rate < 90) return "bg-chart-cyan/60";
     return "bg-primary/80";
   };
 
   const getCompletedHabits = (day: number) => habits.filter(h => h.completedDays.includes(day));
   const getIncompleteHabits = (day: number) => habits.filter(h => !h.completedDays.includes(day));
 
   // Generate calendar days
   const calendarDays = [];
   for (let i = 0; i < adjustedFirstDay; i++) {
     calendarDays.push(null);
   }
   for (let i = 1; i <= daysInMonth; i++) {
     calendarDays.push(i);
   }
 
   const selectedDayNumber = selectedDate?.getDate() || null;
   const isSelectedInCurrentMonth = selectedDate && 
     selectedDate.getMonth() === currentMonth.getMonth() && 
     selectedDate.getFullYear() === currentMonth.getFullYear();
 
   // Calculate monthly stats
   const monthlyStats = useMemo(() => {
     let totalCompleted = 0;
     let totalPossible = 0;
     let perfectDays = 0;
 
     for (let day = 1; day <= Math.min(currentDay, daysInMonth); day++) {
       const completed = habits.filter(h => h.completedDays.includes(day)).length;
       totalCompleted += completed;
       totalPossible += habits.length;
       if (completed === habits.length) perfectDays++;
     }
 
     return {
       completionRate: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
       perfectDays,
       currentStreak: perfectDays, // Simplified
     };
   }, [habits, currentDay, daysInMonth]);
 
   return (
     <div className="min-h-screen bg-background p-8">
       <div className="max-w-[1200px] mx-auto space-y-8">
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
                 <CalendarIcon className="w-8 h-8 text-primary" />
                 <span className="text-gradient">Calendar</span>
               </h1>
               <p className="text-muted-foreground">View your habit completion history</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
               <ChevronLeft className="w-5 h-5" />
             </Button>
             <span className="font-display font-bold text-xl min-w-[180px] text-center">
               {monthName} {year}
             </span>
             <Button variant="ghost" size="icon" onClick={handleNextMonth}>
               <ChevronRight className="w-5 h-5" />
             </Button>
           </div>
         </motion.div>
 
         {/* Stats Cards */}
         <div className="grid grid-cols-3 gap-4">
           {[
             { label: "Monthly Completion", value: `${monthlyStats.completionRate}%`, icon: Target, color: "text-primary" },
             { label: "Perfect Days", value: `${monthlyStats.perfectDays}`, icon: Flame, color: "text-chart-yellow" },
             { label: "Total Habits", value: `${habits.length}`, icon: CalendarIcon, color: "text-chart-cyan" },
           ].map((stat, index) => (
             <motion.div
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               className="glass-card p-4"
             >
               <div className="flex items-center gap-2 mb-1">
                 <stat.icon className={cn("w-4 h-4", stat.color)} />
                 <span className="text-xs text-muted-foreground">{stat.label}</span>
               </div>
               <div className={cn("text-2xl font-bold font-display", stat.color)}>
                 {stat.value}
               </div>
             </motion.div>
           ))}
         </div>
 
         {/* Calendar Grid */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="glass-card p-8"
         >
           {/* Day headers */}
           <div className="grid grid-cols-7 gap-3 mb-4">
             {dayNames.map((day) => (
               <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                 {day}
               </div>
             ))}
           </div>
 
           {/* Calendar grid */}
           <div className="grid grid-cols-7 gap-3">
             {calendarDays.map((day, index) => {
               if (day === null) {
                 return <div key={`empty-${index}`} className="aspect-square" />;
               }
 
               const completionRate = getDayCompletionRate(day);
               const isToday = day === currentDay;
               const isPast = isCurrentMonth ? day < currentDay : currentMonth < today;
               const isFuture = isCurrentMonth ? day > currentDay : currentMonth > today;
               const isSelected = isSelectedInCurrentMonth && day === selectedDayNumber;
 
               return (
                 <motion.button
                   key={day}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setSelectedDate(new Date(year, currentMonth.getMonth(), day))}
                   className={cn(
                     "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300",
                     getDayColor(completionRate),
                     isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                     isSelected && "ring-2 ring-chart-cyan ring-offset-2 ring-offset-background",
                     isFuture && "opacity-40 cursor-not-allowed",
                     "hover:shadow-lg"
                   )}
                 >
                   <span className={cn(
                     "text-lg font-bold",
                     isToday && "text-primary",
                     completionRate === 100 && "text-primary-foreground"
                   )}>
                     {day}
                   </span>
                   {isPast && completionRate > 0 && (
                     <span className="text-xs text-foreground/70 font-medium">
                       {Math.round(completionRate)}%
                     </span>
                   )}
                   {completionRate === 100 && isPast && (
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-chart-yellow rounded-full flex items-center justify-center">
                       <Check className="w-3 h-3 text-background" />
                     </div>
                   )}
                 </motion.button>
               );
             })}
           </div>
 
           {/* Legend */}
           <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-border/30">
             {[
               { color: "bg-secondary/30", label: "0%" },
               { color: "bg-chart-pink/40", label: "1-30%" },
               { color: "bg-chart-yellow/50", label: "31-60%" },
               { color: "bg-chart-cyan/60", label: "61-90%" },
               { color: "bg-primary/80", label: "91-100%" },
             ].map((item) => (
               <div key={item.label} className="flex items-center gap-2">
                 <div className={cn("w-4 h-4 rounded", item.color)} />
                 <span className="text-sm text-muted-foreground">{item.label}</span>
               </div>
             ))}
           </div>
         </motion.div>
 
         {/* Selected Day Details */}
         <AnimatePresence>
           {isSelectedInCurrentMonth && selectedDayNumber && (
             <motion.div
               initial={{ opacity: 0, y: 20, height: 0 }}
               animate={{ opacity: 1, y: 0, height: "auto" }}
               exit={{ opacity: 0, y: 20, height: 0 }}
               className="glass-card p-6"
             >
               <h3 className="text-xl font-bold font-display mb-4">
                 {selectedDate?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
               </h3>
               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                     <Check className="w-4 h-4 text-primary" />
                     Completed ({getCompletedHabits(selectedDayNumber).length})
                   </p>
                   <div className="space-y-2">
                     {getCompletedHabits(selectedDayNumber).map((habit) => (
                       <div key={habit.id} className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium">
                         {habit.name}
                       </div>
                     ))}
                     {getCompletedHabits(selectedDayNumber).length === 0 && (
                       <p className="text-sm text-muted-foreground">No habits completed</p>
                     )}
                   </div>
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                     <X className="w-4 h-4 text-chart-pink" />
                     Missed ({getIncompleteHabits(selectedDayNumber).length})
                   </p>
                   <div className="space-y-2">
                     {getIncompleteHabits(selectedDayNumber).map((habit) => (
                       <div key={habit.id} className="p-3 rounded-xl bg-chart-pink/10 border border-chart-pink/20 text-chart-pink font-medium">
                         {habit.name}
                       </div>
                     ))}
                     {getIncompleteHabits(selectedDayNumber).length === 0 && (
                       <p className="text-sm text-muted-foreground">All habits completed! 🎉</p>
                     )}
                   </div>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </div>
   );
 };
 
 export default CalendarPage;