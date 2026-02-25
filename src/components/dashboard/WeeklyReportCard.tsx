import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Habit } from "@/hooks/useHabits";

interface WeeklyReportCardProps {
  habits: Habit[];
  totalXP: number;
  currentDay: number;
  maxStreak: number;
}

const WeeklyReportCard = ({ habits, totalXP, currentDay, maxStreak }: WeeklyReportCardProps) => {
  const { toast } = useToast();
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday

  // Only show on Mondays (or if it's the first 2 days of the week)
  const isReportDay = dayOfWeek <= 1; // Sunday or Monday

  const report = useMemo(() => {
    if (!isReportDay || habits.length === 0) return null;

    // Calculate last 7 days of completions
    const weekStart = Math.max(1, currentDay - 6);
    let completed = 0;
    let total = 0;
    for (let d = weekStart; d <= currentDay; d++) {
      total += habits.length;
      completed += habits.filter(h => h.completedDays.includes(d)).length;
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    let grade: string;
    let message: string;
    if (percentage >= 95) { grade = "A+"; message = "Absolutely unstoppable! 🏆"; }
    else if (percentage >= 85) { grade = "A"; message = "Crushing it! Keep going! 💪"; }
    else if (percentage >= 75) { grade = "B+"; message = "Great week! You're building momentum! 🚀"; }
    else if (percentage >= 65) { grade = "B"; message = "Solid effort! Room to grow! 🌱"; }
    else if (percentage >= 50) { grade = "C"; message = "Halfway there! Push harder this week! ⚡"; }
    else { grade = "D"; message = "Fresh start this week! You've got this! 💫"; }

    return { completed, total, percentage, grade, message };
  }, [habits, currentDay, isReportDay]);

  if (!report) return null;

  const handleShare = async () => {
    const text = `📊 My Weekly Habit Report Card: ${report.grade} (${report.percentage}%)\n🔥 ${maxStreak}-day streak | ⚡ ${totalXP} XP\n\nTracking my habits with Superoutine!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!", description: "Share your progress with friends!" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm">Weekly Report Card</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleShare} className="text-xs gap-1">
          <Share2 className="w-3 h-3" /> Share
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center">
          <span className="font-display font-bold text-2xl text-primary">{report.grade}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{report.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {report.completed}/{report.total} habits completed ({report.percentage}%)
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>🔥 {maxStreak}-day streak</span>
            <span>⚡ {totalXP} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyReportCard;
