import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Habit } from "@/hooks/useHabits";

interface MilestoneShareProps {
  habits: Habit[];
  totalXP: number;
  maxStreak: number;
  currentDay: number;
}

interface Milestone {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const MilestoneShare = ({ habits, totalXP, maxStreak, currentDay }: MilestoneShareProps) => {
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const milestones = useMemo(() => {
    const totalCompletions = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
    const achieved: Milestone[] = [];

    if (maxStreak >= 7 && !dismissed.includes("streak7"))
      achieved.push({ id: "streak7", emoji: "🔥", title: "7-Day Streak!", description: "One full week of consistency!" });
    if (maxStreak >= 30 && !dismissed.includes("streak30"))
      achieved.push({ id: "streak30", emoji: "💎", title: "30-Day Streak!", description: "A month of dedication!" });
    if (totalCompletions >= 50 && !dismissed.includes("comp50"))
      achieved.push({ id: "comp50", emoji: "⭐", title: "50 Habits Done!", description: "You're building real momentum!" });
    if (totalCompletions >= 100 && !dismissed.includes("comp100"))
      achieved.push({ id: "comp100", emoji: "🏆", title: "100 Habits Done!", description: "Triple digits! Incredible!" });
    if (totalXP >= 500 && !dismissed.includes("xp500"))
      achieved.push({ id: "xp500", emoji: "⚡", title: "500 XP Earned!", description: "You're leveling up fast!" });
    if (totalXP >= 1000 && !dismissed.includes("xp1000"))
      achieved.push({ id: "xp1000", emoji: "🌟", title: "1000 XP Club!", description: "Welcome to the big leagues!" });

    return achieved;
  }, [habits, totalXP, maxStreak, dismissed]);

  const latestMilestone = milestones[milestones.length - 1];

  if (!latestMilestone) return null;

  const handleShare = async () => {
    const text = `${latestMilestone.emoji} ${latestMilestone.title}\n${latestMilestone.description}\n\n🔥 ${maxStreak}-day streak | ⚡ ${totalXP} XP\n\nBuilding better habits with Superoutine!`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Share your milestone!" });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card p-4 sm:p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none" />

        <button
          onClick={() => setDismissed(prev => [...prev, latestMilestone.id])}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-2xl">
            {latestMilestone.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-sm">{latestMilestone.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{latestMilestone.description}</p>
          </div>
          <Button variant="glass" size="sm" onClick={handleShare} className="text-xs gap-1">
            <Share2 className="w-3 h-3" /> Share
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MilestoneShare;
