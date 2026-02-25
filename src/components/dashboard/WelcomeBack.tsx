import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Zap } from "lucide-react";

interface WelcomeBackProps {
  daysAway: number;
  onDismiss: () => void;
}

const WelcomeBack = ({ daysAway, onDismiss }: WelcomeBackProps) => {
  if (daysAway < 2) return null;

  const missedXP = daysAway * 10; // rough estimate

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          className="glass-card p-6 sm:p-8 max-w-md w-full text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto"
          >
            <Heart className="w-8 h-8 text-primary" />
          </motion.div>

          <div>
            <h2 className="font-display font-bold text-xl mb-2">Welcome back! 👋</h2>
            <p className="text-muted-foreground text-sm">
              You were away for <span className="text-foreground font-semibold">{daysAway} days</span>. 
              Your habits missed you!
            </p>
          </div>

          <div className="glass-card p-4 bg-secondary/30">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>You could have earned ~<strong className="text-foreground">{missedXP} XP</strong></span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              No worries — every day is a fresh start! 🌱
            </p>
          </div>

          <Button onClick={onDismiss} variant="hero" size="lg" className="w-full">
            Jump Back In 🚀
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeBack;
