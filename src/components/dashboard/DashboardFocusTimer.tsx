import { useState } from "react";
import { Timer, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import FocusTimer from "@/components/gamification/FocusTimer";
import type { Habit } from "@/hooks/useHabits";

interface DashboardFocusTimerProps {
  habits: Habit[];
}

const DashboardFocusTimer = ({ habits }: DashboardFocusTimerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string>("Focus Session");

  const openTimer = (habitName?: string) => {
    setSelectedHabit(habitName || "Focus Session");
    setIsOpen(true);
  };

  return (
    <>
      <div className="glass-card p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm">Focus Timer</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Start a deep work session with a Pomodoro-style timer.
        </p>
        <div className="space-y-1.5">
          <Button
            onClick={() => openTimer()}
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm h-8"
          >
            <Play className="w-3.5 h-3.5 mr-2" />
            Quick 25 min session
          </Button>
          {habits.slice(0, 3).map(h => (
            <Button
              key={h.id}
              onClick={() => openTimer(h.name)}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-7 text-muted-foreground hover:text-foreground"
            >
              <Play className="w-3 h-3 mr-2" />
              {h.name}
            </Button>
          ))}
        </div>
      </div>

      <FocusTimer
        habitName={selectedHabit}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComplete={() => setIsOpen(false)}
      />
    </>
  );
};

export default DashboardFocusTimer;
