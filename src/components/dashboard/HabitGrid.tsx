import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, ChevronUp, Play, Link2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import HabitActions from "./HabitActions";
import FocusTimer from "@/components/gamification/FocusTimer";

interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDays: number[];
  linkedTo?: string; // Habit bundling - linked to another habit
  hasFocusTimer?: boolean; // Whether this habit has a focus timer
}

interface HabitGridProps {
  habits: Habit[];
  daysInMonth: number;
  currentDay: number;
  onToggleDay: (habitId: string, day: number, event?: React.MouseEvent) => void;
  onAddHabit: (name: string, goal: number, linkedTo?: string) => void;
  onEditHabit: (id: string, name: string, goal: number) => void;
  onDeleteHabit: (id: string) => void;
}

const weekColors = [
  "bg-chart-pink",
  "bg-chart-purple", 
  "bg-chart-blue",
  "bg-chart-yellow",
  "bg-primary",
];

// Habits that can have focus timers
const focusTimerHabits = ["meditation", "reading", "study", "work", "focus", "deep work", "writing"];

const HabitGrid = ({ habits, daysInMonth, currentDay, onToggleDay, onAddHabit, onEditHabit, onDeleteHabit }: HabitGridProps) => {
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("30");
  const [linkedHabit, setLinkedHabit] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [focusTimerHabit, setFocusTimerHabit] = useState<Habit | null>(null);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getWeekNumber = (day: number) => Math.ceil(day / 7) - 1;
  const getWeekColor = (day: number) => weekColors[getWeekNumber(day) % weekColors.length];

  const canHaveFocusTimer = (name: string) => {
    return focusTimerHabits.some(h => name.toLowerCase().includes(h));
  };

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName, parseInt(newHabitGoal) || 30, linkedHabit || undefined);
      setNewHabitName("");
      setNewHabitGoal("30");
      setLinkedHabit("");
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
                    placeholder="e.g., Meditation"
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
                
                {/* Habit Bundling */}
                {habits.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-primary" />
                      Habit Stacking (Optional)
                    </Label>
                    <Select value={linkedHabit} onValueChange={setLinkedHabit}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue placeholder="I will do this after..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No linking</SelectItem>
                        {habits.map((habit) => (
                          <SelectItem key={habit.id} value={habit.id}>
                            After: {habit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Link habits together to build stronger routines
                    </p>
                  </div>
                )}

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
              <TooltipProvider>
              {habits.map((habit, index) => {
                const linkedHabitName = habit.linkedTo 
                  ? habits.find(h => h.id === habit.linkedTo)?.name 
                  : null;
                const showFocusButton = canHaveFocusTimer(habit.name);

                return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="grid grid-cols-[150px_60px_repeat(31,32px)] gap-1 py-2 border-t border-border/30 group"
                >
                  <div className="text-sm font-medium truncate flex items-center gap-1">
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="truncate">{habit.name}</span>
                        {showFocusButton && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFocusTimerHabit(habit);
                                }}
                              >
                                <Play className="w-3 h-3 text-primary" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Focus Timer</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {linkedHabitName && (
                        <span className="text-[10px] text-primary/70 flex items-center gap-1">
                          <Link2 className="w-2.5 h-2.5" />
                          After: {linkedHabitName}
                        </span>
                      )}
                    </div>
                    <HabitActions
                      habitId={habit.id}
                      habitName={habit.name}
                      habitGoal={habit.goal}
                      onEdit={onEditHabit}
                      onDelete={onDeleteHabit}
                    />
                  </div>
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
                        onClick={(e) => !isFuture && onToggleDay(habit.id, day, e)}
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
              );
              })}
              </TooltipProvider>

              {habits.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-t border-border/30">
                  <p>No habits yet. Add your first habit to get started!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};

export default HabitGrid;