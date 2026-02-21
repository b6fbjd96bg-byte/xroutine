import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Flame, Sparkles } from "lucide-react";

interface MomentumMeterProps {
  habits: { completedDays: number[] }[];
  currentDay: number;
}

const MomentumMeter = ({ habits, currentDay }: MomentumMeterProps) => {
  const { recentRate, previousRate, trend, momentumLabel, emoji } = useMemo(() => {
    if (habits.length === 0) return { recentRate: 0, previousRate: 0, trend: 0, momentumLabel: "Getting Started", emoji: "🌱" };

    // Last 7 days
    const recentStart = Math.max(1, currentDay - 6);
    const recentDays = currentDay - recentStart + 1;
    let recentCompleted = 0;
    habits.forEach(h => {
      h.completedDays.forEach(d => {
        if (d >= recentStart && d <= currentDay) recentCompleted++;
      });
    });
    const recent = recentDays > 0 ? Math.round((recentCompleted / (habits.length * recentDays)) * 100) : 0;

    // Previous 7 days
    const prevEnd = recentStart - 1;
    const prevStart = Math.max(1, prevEnd - 6);
    const prevDays = prevEnd >= prevStart ? prevEnd - prevStart + 1 : 0;
    let prevCompleted = 0;
    if (prevDays > 0) {
      habits.forEach(h => {
        h.completedDays.forEach(d => {
          if (d >= prevStart && d <= prevEnd) prevCompleted++;
        });
      });
    }
    const prev = prevDays > 0 ? Math.round((prevCompleted / (habits.length * prevDays)) * 100) : 0;

    const diff = recent - prev;
    let label = "Steady Progress";
    let em = "💪";
    if (recent >= 80) { label = "On Fire!"; em = "🔥"; }
    else if (recent >= 60) { label = "Building Momentum"; em = "🚀"; }
    else if (diff > 10) { label = "Picking Up Speed"; em = "⚡"; }
    else if (diff < -10 && recent > 0) { label = "Room to Grow"; em = "🌱"; }
    else if (recent === 0) { label = "Fresh Start Awaits"; em = "✨"; }

    return { recentRate: recent, previousRate: prev, trend: diff, momentumLabel: label, emoji: em };
  }, [habits, currentDay]);

  const meterColor = recentRate >= 70 ? "from-emerald-500 to-teal-400" 
    : recentRate >= 40 ? "from-amber-400 to-yellow-300" 
    : "from-blue-400 to-cyan-300";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="font-bold font-display text-base">Momentum</h3>
              <p className="text-xs text-muted-foreground">{momentumLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {trend > 0 ? (
              <span className="text-emerald-500 flex items-center gap-0.5 font-medium">
                <TrendingUp className="w-4 h-4" /> +{trend}%
              </span>
            ) : trend < 0 ? (
              <span className="text-muted-foreground flex items-center gap-0.5">
                <TrendingDown className="w-4 h-4" /> {trend}%
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-0.5">
                <Minus className="w-4 h-4" /> Steady
              </span>
            )}
          </div>
        </div>

        {/* Meter bar */}
        <div className="relative h-6 bg-secondary/50 rounded-full overflow-hidden border border-border/30 mb-3">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${meterColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${recentRate}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold drop-shadow-sm">{recentRate}%</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Last 7 days completion rate — {trend > 0 ? "you're accelerating!" : trend === 0 ? "staying consistent" : "every day is a fresh opportunity"}
        </p>
      </div>
    </motion.div>
  );
};

export default MomentumMeter;
