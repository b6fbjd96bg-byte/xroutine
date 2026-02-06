import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Sparkles, Trophy, Target, Flame, Clock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DailyQuote from "@/components/gamification/DailyQuote";
import FocusTimer from "@/components/gamification/FocusTimer";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
}

interface TodaysFocusProps {
  habits: Habit[];
  currentDay: number;
  onToggleDay: (habitId: string, day: number, event?: React.MouseEvent) => void;
}

// Habits that can have focus timers
const focusTimerHabits = ["meditation", "reading", "study", "work", "focus", "deep work", "writing"];
 
const TodaysFocus = ({ habits, currentDay, onToggleDay }: TodaysFocusProps) => {
  const [focusTimerHabit, setFocusTimerHabit] = useState<Habit | null>(null);
  
  const completedToday = habits.filter(h => h.completedDays.includes(currentDay));
  const pendingToday = habits.filter(h => !h.completedDays.includes(currentDay));

  const canHaveFocusTimer = (name: string) => {
    return focusTimerHabits.some(h => name.toLowerCase().includes(h));
  };
   const completionPercentage = habits.length > 0 
     ? Math.round((completedToday.length / habits.length) * 100) 
     : 0;
 
   const getMotivationalMessage = () => {
     if (completionPercentage === 100) return "🎉 Perfect day! You crushed it!";
     if (completionPercentage >= 75) return "🔥 Almost there! Keep pushing!";
     if (completionPercentage >= 50) return "💪 Halfway done! You got this!";
     if (completionPercentage >= 25) return "🌱 Good start! Keep going!";
     return "☀️ New day, new opportunities!";
   };
 
   const getTimeOfDayGreeting = () => {
     const hour = new Date().getHours();
     if (hour < 12) return "Good morning";
     if (hour < 17) return "Good afternoon";
     return "Good evening";
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="glass-card p-6 relative overflow-hidden"
     >
       {/* Animated background gradient */}
       <div className="absolute inset-0 opacity-30">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-chart-purple/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
       </div>
 
       <div className="relative z-10">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
           <div>
             <p className="text-muted-foreground text-sm mb-1">{getTimeOfDayGreeting()}</p>
             <h2 className="text-2xl font-bold font-display flex items-center gap-2">
               <Target className="w-6 h-6 text-primary" />
               Today's Focus
             </h2>
           </div>
           <div className="text-right">
             <div className="text-3xl font-bold text-gradient">{completionPercentage}%</div>
             <div className="text-xs text-muted-foreground">{completedToday.length}/{habits.length} completed</div>
           </div>
         </div>
 
          {/* Motivational Message */}
          <motion.div
            key={completionPercentage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-chart-purple/10 border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-chart-yellow" />
              <span className="font-medium">{getMotivationalMessage()}</span>
            </div>
          </motion.div>

          {/* Daily Quote */}
          <div className="mb-6">
            <DailyQuote />
          </div>
 
         {/* Progress Ring */}
         <div className="flex justify-center mb-6">
           <div className="relative w-32 h-32">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               <circle
                 cx="50"
                 cy="50"
                 r="40"
                 fill="none"
                 stroke="hsl(var(--secondary))"
                 strokeWidth="8"
               />
               <motion.circle
                 cx="50"
                 cy="50"
                 r="40"
                 fill="none"
                 stroke="url(#progressGradient)"
                 strokeWidth="8"
                 strokeLinecap="round"
                 initial={{ strokeDasharray: "0 251.2" }}
                 animate={{ strokeDasharray: `${completionPercentage * 2.512} 251.2` }}
                 transition={{ duration: 1, ease: "easeOut" }}
               />
               <defs>
                 <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                   <stop offset="100%" stopColor="hsl(180, 70%, 50%)" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               {completionPercentage === 100 ? (
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 500, damping: 15 }}
                 >
                   <Trophy className="w-12 h-12 text-chart-yellow" />
                 </motion.div>
               ) : (
                 <Flame className="w-10 h-10 text-primary" />
               )}
             </div>
           </div>
         </div>
 
         {/* Pending Habits */}
         {pendingToday.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Pending ({pendingToday.length})
              </h3>
              <div className="space-y-2">
                {pendingToday.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/30 hover:border-primary/30 transition-all group"
                  >
                    <button
                      onClick={(e) => onToggleDay(habit.id, currentDay, e)}
                      className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary transition-colors flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
                    </button>
                    <span className="flex-1 text-left font-medium">{habit.name}</span>
                    {canHaveFocusTimer(habit.name) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFocusTimerHabit(habit);
                        }}
                      >
                        <Play className="w-4 h-4 text-primary" />
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to complete
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
 
          {completedToday.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Completed ({completedToday.length})
              </h3>
              <div className="space-y-2">
                {completedToday.map((habit, index) => (
                  <motion.button
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => onToggleDay(habit.id, currentDay, e)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 transition-all group hover:bg-primary/20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                    <span className="flex-1 text-left font-medium text-primary line-through opacity-80">{habit.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {habits.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No habits yet. Add your first habit to get started!</p>
            </div>
          )}
        </div>

        {/* Focus Timer Modal */}
        {focusTimerHabit && (
          <FocusTimer
            habitName={focusTimerHabit.name}
            isOpen={!!focusTimerHabit}
            onClose={() => setFocusTimerHabit(null)}
            onComplete={() => {
              if (focusTimerHabit) {
                onToggleDay(focusTimerHabit.id, currentDay);
              }
              setFocusTimerHabit(null);
            }}
          />
        )}
      </motion.div>
    );
  };

export default TodaysFocus;