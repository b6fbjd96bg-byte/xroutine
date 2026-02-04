import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
}

interface CalendarViewProps {
  habits: Habit[];
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

const CalendarView = ({
  habits,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  selectedDate,
}: CalendarViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const today = new Date();
  const isCurrentMonth = 
    currentMonth.getMonth() === today.getMonth() && 
    currentMonth.getFullYear() === today.getFullYear();
  const currentDay = isCurrentMonth ? today.getDate() : -1;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const getCompletedHabits = (day: number) => {
    return habits.filter(h => h.completedDays.includes(day));
  };

  const getIncompleteHabits = (day: number) => {
    return habits.filter(h => !h.completedDays.includes(day));
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold font-display">Calendar Overview</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {monthName} {year}
            </span>
            <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
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
                      onClick={() => onSelectDate(new Date(year, currentMonth.getMonth(), day))}
                      className={cn(
                        "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300",
                        getDayColor(completionRate),
                        isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        isSelected && "ring-2 ring-chart-cyan ring-offset-2 ring-offset-background",
                        isFuture && "opacity-40",
                        "hover:shadow-lg"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-bold",
                        isToday && "text-primary",
                        completionRate === 100 && "text-primary-foreground"
                      )}>
                        {day}
                      </span>
                      {isPast && completionRate > 0 && (
                        <span className="text-[10px] text-foreground/70 font-medium">
                          {Math.round(completionRate)}%
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-secondary/30" />
                  <span className="text-xs text-muted-foreground">0%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-chart-pink/40" />
                  <span className="text-xs text-muted-foreground">1-30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-chart-yellow/50" />
                  <span className="text-xs text-muted-foreground">31-60%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-chart-cyan/60" />
                  <span className="text-xs text-muted-foreground">61-90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/80" />
                  <span className="text-xs text-muted-foreground">91-100%</span>
                </div>
              </div>

              {/* Selected Day Details */}
              <AnimatePresence>
                {isSelectedInCurrentMonth && selectedDayNumber && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border/30"
                  >
                    <h3 className="text-sm font-bold mb-3">
                      {selectedDate?.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Check className="w-3 h-3 text-primary" /> Completed ({getCompletedHabits(selectedDayNumber).length})
                        </p>
                        <div className="space-y-1">
                          {getCompletedHabits(selectedDayNumber).map((habit) => (
                            <div key={habit.id} className="text-xs p-2 rounded bg-primary/10 text-primary">
                              {habit.name}
                            </div>
                          ))}
                          {getCompletedHabits(selectedDayNumber).length === 0 && (
                            <p className="text-xs text-muted-foreground">None</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <X className="w-3 h-3 text-chart-pink" /> Missed ({getIncompleteHabits(selectedDayNumber).length})
                        </p>
                        <div className="space-y-1">
                          {getIncompleteHabits(selectedDayNumber).slice(0, 5).map((habit) => (
                            <div key={habit.id} className="text-xs p-2 rounded bg-chart-pink/10 text-chart-pink">
                              {habit.name}
                            </div>
                          ))}
                          {getIncompleteHabits(selectedDayNumber).length > 5 && (
                            <p className="text-xs text-muted-foreground">
                              +{getIncompleteHabits(selectedDayNumber).length - 5} more
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarView;
