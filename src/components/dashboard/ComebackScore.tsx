import { useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Shield, Sparkles } from "lucide-react";

interface ComebackScoreProps {
  habits: { completedDays: number[] }[];
  currentDay: number;
}

const ComebackScore = ({ habits, currentDay }: ComebackScoreProps) => {
  const { score, comebacks, message, emoji } = useMemo(() => {
    if (habits.length === 0 || currentDay < 3) {
      return { score: 0, comebacks: 0, message: "Start building — every day is a new chance!", emoji: "✨" };
    }

    let gapDays = 0;
    let recoveryDays = 0;
    let comebackCount = 0;

    for (let d = 2; d <= currentDay; d++) {
      const prevCompleted = habits.filter(h => h.completedDays.includes(d - 1)).length;
      const todayCompleted = habits.filter(h => h.completedDays.includes(d)).length;
      const prevRate = prevCompleted / habits.length;
      const todayRate = todayCompleted / habits.length;

      // A gap: less than 30% completion
      if (prevRate < 0.3) {
        gapDays++;
        // Recovery: came back to 50%+ after a gap
        if (todayRate >= 0.5) {
          recoveryDays++;
          comebackCount++;
        }
      }
    }

    const s = gapDays > 0
      ? Math.min(Math.round((recoveryDays / gapDays) * 100), 100)
      : currentDay > 1 ? 100 : 0;

    let msg = "You bounce back like a champion!";
    let em = "💪";
    if (s >= 80) { msg = "Incredible resilience! You never stay down long."; em = "🏆"; }
    else if (s >= 50) { msg = "Great comeback energy! Gaps are just pauses, not stops."; em = "🔄"; }
    else if (s >= 20) { msg = "You're learning to bounce back — that takes real courage."; em = "🌱"; }
    else if (gapDays === 0) { msg = "No gaps at all — you're unstoppable!"; em = "⚡"; }
    else { msg = "Every return is a victory. Keep showing up!"; em = "💫"; }

    return { score: s, comebacks: comebackCount, message: msg, emoji: em };
  }, [habits, currentDay]);

  const ringProgress = (score / 100) * 283; // circumference of r=45 circle

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-chart-cyan/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-chart-cyan" />
          <h3 className="font-bold font-display text-base">Comeback Score</h3>
        </div>

        <div className="flex items-center gap-5">
          {/* Ring chart */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-secondary/40" />
              <motion.circle
                cx="50" cy="50" r="45"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-chart-cyan"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - ringProgress }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold">{score}%</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{emoji}</span>
              <span className="text-sm font-semibold">{comebacks} comeback{comebacks !== 1 ? "s" : ""}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComebackScore;
