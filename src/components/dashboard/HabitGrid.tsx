import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
}

interface HabitGridProps {
  habits: Habit[];
  daysInMonth: number;
  currentDay: number;
  onToggleDay: (habitId: string, day: number) => void;
  onAddHabit: (name: string, goal: number) => void;
}

const weekColors = [
  "bg-chart-pink",
  "bg-chart-purple", 
  "bg-chart-blue",
  "bg-chart-yellow",
  "bg-primary",
];

const HabitGrid = ({ habits, daysInMonth, currentDay, onToggleDay, onAddHabit }: HabitGridProps) => {
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("30");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getWeekNumber = (day: number) => Math.ceil(day / 7) - 1;
  const getWeekColor = (day: number) => weekColors[getWeekNumber(day) % weekColors.length];

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName, parseInt(newHabitGoal) || 30);
      setNewHabitName("");
      setNewHabitGoal("30");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold font-display">Daily Habits</h2>
          <span className="text-sm text-muted-foreground">
            {habits.length} habits tracked
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="habitName">Habit Name</Label>
                  <Input
                    id="habitName"
                    placeholder="e.g., Running"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="habitGoal">Monthly Goal (days)</Label>
                  <Input
                    id="habitGoal"
                    type="number"
                    placeholder="30"
                    value={newHabitGoal}
                    onChange={(e) => setNewHabitGoal(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <Button onClick={handleAddHabit} className="w-full">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
            className="overflow-x-auto"
          >
            <div className="min-w-[900px] px-6 pb-6">
              {/* Header */}
              <div className="grid grid-cols-[150px_60px_repeat(31,32px)] gap-1 mb-2">
                <div className="text-sm font-medium text-muted-foreground">Habit</div>
                <div className="text-sm font-medium text-muted-foreground text-center">Goal</div>
                {days.map((day) => (
                  <div
                    key={day}
                    className={cn(
                      "text-xs font-medium text-center flex flex-col items-center justify-center",
                      day === currentDay && "text-primary"
                    )}
                  >
                    <span className="text-muted-foreground text-[10px]">
                      {dayNames[(day - 1) % 7]}
                    </span>
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                      day === currentDay && "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    )}>
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Week indicators */}
              <div className="grid grid-cols-[150px_60px_repeat(31,32px)] gap-1 mb-4">
                <div></div>
                <div></div>
                {days.map((day) => (
                  <div key={day} className="flex justify-center">
                    <div className={cn("w-full h-1.5 rounded-full", getWeekColor(day))} />
                  </div>
                ))}
              </div>

              {/* Habits */}
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="grid grid-cols-[150px_60px_repeat(31,32px)] gap-1 py-2 border-t border-border/30"
                >
                  <div className="text-sm font-medium truncate flex items-center">{habit.name}</div>
                  <div className="text-sm text-muted-foreground text-center flex items-center justify-center">
                    {habit.goal}
                  </div>
                  {days.map((day) => {
                    const isCompleted = habit.completedDays.includes(day);
                    const isPast = day < currentDay;
                    const isToday = day === currentDay;
                    const isFuture = day > currentDay;

                    return (
                      <motion.button
                        key={day}
                        whileHover={!isFuture ? { scale: 1.15 } : {}}
                        whileTap={!isFuture ? { scale: 0.9 } : {}}
                        onClick={() => !isFuture && onToggleDay(habit.id, day)}
                        disabled={isFuture}
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
                          isCompleted && "bg-primary text-primary-foreground shadow-md shadow-primary/30",
                          !isCompleted && isPast && "bg-secondary/50 hover:bg-secondary border border-border/50",
                          !isCompleted && isToday && "bg-secondary ring-2 ring-primary/50 hover:bg-primary/20",
                          isFuture && "bg-secondary/20 cursor-not-allowed opacity-40"
                        )}
                      >
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              ))}

              {habits.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-t border-border/30">
                  <p>No habits yet. Add your first habit to get started!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitGrid;