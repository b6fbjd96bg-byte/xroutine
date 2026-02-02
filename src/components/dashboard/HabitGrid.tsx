import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
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
    <div className="glass-card p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-display">Daily Habits</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
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
      </div>

      <div className="min-w-[800px]">
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
                "w-6 h-6 rounded-full flex items-center justify-center",
                day === currentDay && "bg-primary text-primary-foreground"
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
              <div className={cn("w-full h-1 rounded-full", getWeekColor(day))} />
            </div>
          ))}
        </div>

        {/* Habits */}
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
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
                <button
                  key={day}
                  onClick={() => !isFuture && onToggleDay(habit.id, day)}
                  disabled={isFuture}
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground",
                    !isCompleted && isPast && "bg-secondary/50 hover:bg-secondary",
                    !isCompleted && isToday && "bg-secondary ring-2 ring-primary/50 hover:bg-primary/20",
                    isFuture && "bg-secondary/20 cursor-not-allowed opacity-50"
                  )}
                >
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No habits yet. Add your first habit to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitGrid;