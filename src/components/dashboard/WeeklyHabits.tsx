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

interface WeeklyHabit {
  id: string;
  name: string;
  goal: number;
  completedWeeks: number[];
}

interface WeeklyHabitsProps {
  habits: WeeklyHabit[];
  numberOfWeeks: number;
  onToggleWeek: (habitId: string, week: number) => void;
  onAddHabit: (name: string, goal: number) => void;
}

const weekColors = [
  "bg-chart-pink",
  "bg-chart-purple",
  "bg-chart-blue",
  "bg-chart-yellow",
  "bg-primary",
];

const weekBorderColors = [
  "border-chart-pink",
  "border-chart-purple",
  "border-chart-blue",
  "border-chart-yellow",
  "border-primary",
];

const WeeklyHabits = ({ habits, numberOfWeeks, onToggleWeek, onAddHabit }: WeeklyHabitsProps) => {
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("5");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const weeks = Array.from({ length: numberOfWeeks }, (_, i) => i + 1);

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName, parseInt(newHabitGoal) || 5);
      setNewHabitName("");
      setNewHabitGoal("5");
      setIsDialogOpen(false);
    }
  };

  // Calculate weekly progress
  const weeklyProgress = weeks.map((week) => {
    const completed = habits.filter((h) => h.completedWeeks.includes(week)).length;
    const goal = habits.length;
    return { week, completed, goal, percentage: goal > 0 ? Math.round((completed / goal) * 100) : 0 };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold font-display">Weekly Habits</h2>
          <span className="text-sm text-muted-foreground">
            {habits.length} habits • {numberOfWeeks} weeks
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4" />
                Add Weekly Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display">Add Weekly Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyHabitName">Habit Name</Label>
                  <Input
                    id="weeklyHabitName"
                    placeholder="e.g., Laundry"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyHabitGoal">Monthly Goal (weeks)</Label>
                  <Input
                    id="weeklyHabitGoal"
                    type="number"
                    placeholder="5"
                    value={newHabitGoal}
                    onChange={(e) => setNewHabitGoal(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <Button onClick={handleAddHabit} className="w-full">
                  Add Weekly Habit
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
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {/* Week Headers */}
              <div className="grid grid-cols-[180px_60px_repeat(5,1fr)_100px] gap-3 mb-4">
                <div className="text-sm font-medium text-muted-foreground">Habit</div>
                <div className="text-sm font-medium text-muted-foreground text-center">Goal</div>
                {weeks.map((week, index) => (
                  <div 
                    key={week} 
                    className="text-center"
                  >
                    <div className={cn(
                      "text-xs font-bold py-1 px-2 rounded-full inline-block",
                      weekColors[index % weekColors.length],
                      "text-background"
                    )}>
                      Week {week}
                    </div>
                  </div>
                ))}
                <div className="text-sm font-medium text-muted-foreground text-center">Progress</div>
              </div>

              {/* Habits */}
              {habits.map((habit, index) => {
                const completedCount = habit.completedWeeks.length;
                const percentage = habit.goal > 0 ? Math.round((completedCount / habit.goal) * 100) : 0;

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="grid grid-cols-[180px_60px_repeat(5,1fr)_100px] gap-3 py-3 border-t border-border/30 items-center"
                  >
                    <div className="text-sm font-medium truncate">{habit.name}</div>
                    <div className="text-sm text-muted-foreground text-center">{habit.goal}</div>
                    {weeks.map((week, weekIndex) => {
                      const isCompleted = habit.completedWeeks.includes(week);

                      return (
                        <div key={week} className="flex justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onToggleWeek(habit.id, week)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                              isCompleted 
                                ? `${weekColors[weekIndex % weekColors.length]} shadow-lg`
                                : `bg-secondary/50 border-2 ${weekBorderColors[weekIndex % weekBorderColors.length]} border-opacity-30 hover:border-opacity-100`
                            )}
                          >
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              >
                                <Check className="w-5 h-5 text-background" />
                              </motion.div>
                            )}
                          </motion.button>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-chart-cyan rounded-full"
                        />
                      </div>
                      <span className="text-xs font-semibold text-primary w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {habits.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-t border-border/30">
                  <p>No weekly habits yet. Add your first weekly habit!</p>
                </div>
              )}

              {/* Weekly Summary */}
              {habits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-[180px_60px_repeat(5,1fr)_100px] gap-3 pt-4 mt-4 border-t-2 border-border/50"
                >
                  <div className="text-sm font-bold">Weekly Progress</div>
                  <div></div>
                  {weeklyProgress.map((wp, index) => (
                    <div key={wp.week} className="text-center">
                      <div className="text-lg font-bold text-foreground">{wp.percentage}%</div>
                      <div className="text-xs text-muted-foreground">{wp.completed}/{wp.goal}</div>
                    </div>
                  ))}
                  <div></div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeeklyHabits;