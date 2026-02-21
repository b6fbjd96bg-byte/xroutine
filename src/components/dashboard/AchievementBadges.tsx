import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Target, Zap, Crown, Heart, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementBadgesProps {
  habits: { completedDays: number[] }[];
  currentDay: number;
  totalXP: number;
  maxStreak: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress: number; // 0-100
  color: string;
}

const AchievementBadges = ({ habits, currentDay, totalXP, maxStreak }: AchievementBadgesProps) => {
  const badges: Badge[] = useMemo(() => {
    const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
    const perfectDays = (() => {
      let count = 0;
      for (let d = 1; d <= currentDay; d++) {
        if (habits.every(h => h.completedDays.includes(d))) count++;
      }
      return count;
    })();

    return [
      {
        id: "first-step",
        name: "First Step",
        description: "Complete your first habit",
        icon: <Star className="w-5 h-5" />,
        earned: totalCompleted >= 1,
        progress: Math.min(totalCompleted, 1) * 100,
        color: "from-yellow-400 to-amber-500",
      },
      {
        id: "streak-3",
        name: "On a Roll",
        description: "3-day streak",
        icon: <Flame className="w-5 h-5" />,
        earned: maxStreak >= 3,
        progress: Math.min((maxStreak / 3) * 100, 100),
        color: "from-orange-400 to-red-500",
      },
      {
        id: "streak-7",
        name: "Week Warrior",
        description: "7-day streak",
        icon: <Zap className="w-5 h-5" />,
        earned: maxStreak >= 7,
        progress: Math.min((maxStreak / 7) * 100, 100),
        color: "from-cyan-400 to-blue-500",
      },
      {
        id: "perfect-day",
        name: "Perfect Day",
        description: "Complete all habits in one day",
        icon: <Crown className="w-5 h-5" />,
        earned: perfectDays >= 1,
        progress: Math.min(perfectDays, 1) * 100,
        color: "from-purple-400 to-violet-500",
      },
      {
        id: "dedicated",
        name: "Dedicated",
        description: "50 total completions",
        icon: <Target className="w-5 h-5" />,
        earned: totalCompleted >= 50,
        progress: Math.min((totalCompleted / 50) * 100, 100),
        color: "from-emerald-400 to-green-500",
      },
      {
        id: "xp-500",
        name: "XP Hunter",
        description: "Earn 500 XP",
        icon: <Trophy className="w-5 h-5" />,
        earned: totalXP >= 500,
        progress: Math.min((totalXP / 500) * 100, 100),
        color: "from-pink-400 to-rose-500",
      },
    ];
  }, [habits, currentDay, totalXP, maxStreak]);

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="font-bold font-display text-base">Achievements</h3>
        </div>
        <span className="text-xs text-muted-foreground">{earnedCount}/{badges.length} unlocked</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "relative flex flex-col items-center text-center p-3 rounded-xl border transition-all",
              badge.earned
                ? "border-primary/30 bg-primary/5"
                : "border-border/30 bg-secondary/20 opacity-60"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-2",
              badge.earned
                ? `bg-gradient-to-br ${badge.color} text-white shadow-lg`
                : "bg-secondary text-muted-foreground"
            )}>
              {badge.icon}
            </div>
            <p className="text-xs font-semibold leading-tight">{badge.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
            
            {!badge.earned && (
              <div className="w-full mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${badge.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            )}
            {badge.earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
              >
                <span className="text-[10px]">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementBadges;
