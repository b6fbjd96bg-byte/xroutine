import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Snowflake, Flame, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StreakProtectionProps {
  emergencySkipsRemaining: number;
  emergencySkipsUsed: number;
  isStreakProtected: boolean;
  currentStreak: number;
  onUseSkip: () => void;
}

const StreakProtection = ({
  emergencySkipsRemaining,
  emergencySkipsUsed,
  isStreakProtected,
  currentStreak,
  onUseSkip,
}: StreakProtectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUseSkip = () => {
    onUseSkip();
    setIsDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "glass-card p-4 relative overflow-hidden",
        isStreakProtected && "border-chart-cyan/50"
      )}
    >
      {/* Protected state background */}
      {isStreakProtected && (
        <div className="absolute inset-0 bg-gradient-to-br from-chart-cyan/10 to-chart-blue/10" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isStreakProtected ? (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-cyan to-chart-blue flex items-center justify-center"
              >
                <Snowflake className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-yellow to-chart-pink flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-bold font-display text-sm">
                {isStreakProtected ? "Streak Protected" : "Streak Shield"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isStreakProtected 
                  ? "Your streak is safe today!" 
                  : `${emergencySkipsRemaining} skip${emergencySkipsRemaining !== 1 ? 's' : ''} available`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Skip indicators */}
            <div className="flex gap-1">
              {[...Array(1)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    i < emergencySkipsRemaining
                      ? "bg-primary shadow-lg shadow-primary/30"
                      : "bg-secondary"
                  )}
                  animate={i < emergencySkipsRemaining ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={emergencySkipsRemaining === 0 || isStreakProtected}
                  className="text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Use Skip
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-display">
                    <Snowflake className="w-5 h-5 text-chart-cyan" />
                    Activate "Life Happens" Pass?
                  </DialogTitle>
                  <DialogDescription className="space-y-4 pt-4">
                    <p>
                      Everyone needs a break sometimes. Using your emergency skip will:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>Protect your {currentStreak}-day streak</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Snowflake className="w-4 h-4 text-chart-cyan" />
                        <span>Turn your flame icy blue for today</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-chart-yellow" />
                        <span>Use 1 of your monthly skips</span>
                      </li>
                    </ul>
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleUseSkip} className="flex-1 bg-gradient-to-r from-chart-cyan to-chart-blue">
                        <Snowflake className="w-4 h-4 mr-2" />
                        Use Skip
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Current streak display */}
        <div className={cn(
          "flex items-center justify-center gap-2 p-3 rounded-xl",
          isStreakProtected 
            ? "bg-gradient-to-r from-chart-cyan/20 to-chart-blue/20 border border-chart-cyan/30"
            : "bg-secondary/30 border border-border/30"
        )}>
          <motion.div
            animate={isStreakProtected ? { rotate: [0, 5, -5, 0] } : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isStreakProtected ? (
              <Snowflake className="w-6 h-6 text-chart-cyan" />
            ) : (
              <Flame className="w-6 h-6 text-chart-yellow" />
            )}
          </motion.div>
          <span className="font-bold font-display text-2xl">{currentStreak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakProtection;
