import { motion, AnimatePresence } from "framer-motion";
import { Flame, Gift, X } from "lucide-react";

interface DailyLoginRewardProps {
  streakCount: number;
  xpClaimed: number;
  isNewLogin: boolean;
  onDismiss: () => void;
}

const DailyLoginReward = ({ streakCount, xpClaimed, isNewLogin, onDismiss }: DailyLoginRewardProps) => {
  if (!isNewLogin) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-card p-4 sm:p-5 relative overflow-hidden"
      >
        {/* Subtle glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary" />
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-sm">
                Day {streakCount} Login Streak!
              </h3>
              {streakCount >= 7 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  🔥 MAX
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Welcome back! Keep the streak alive.
            </p>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15"
          >
            <Gift className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-primary text-sm">+{xpClaimed} XP</span>
          </motion.div>
        </div>

        {/* Streak dots */}
        <div className="flex items-center gap-1.5 mt-3 relative z-10">
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className={`w-6 h-1.5 rounded-full transition-colors ${
                i < streakCount ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {streakCount}/7
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyLoginReward;
