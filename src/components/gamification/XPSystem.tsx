import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star, Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPSystemProps {
  totalXP: number;
  dailyCompleted: number;
  weeklyCompleted: number;
}

// Level thresholds - each level requires more XP
const calculateLevel = (xp: number) => {
  // Formula: Level = floor(sqrt(xp / 100))
  // Level 1: 0-99 XP, Level 2: 100-399 XP, Level 3: 400-899 XP, etc.
  let level = 1;
  let xpRequired = 100;
  let totalRequired = 0;
  
  while (totalRequired + xpRequired <= xp) {
    totalRequired += xpRequired;
    level++;
    xpRequired = level * 100; // Each level requires 100 more XP
  }
  
  const currentLevelXP = xp - totalRequired;
  const nextLevelXP = xpRequired;
  const progress = (currentLevelXP / nextLevelXP) * 100;
  
  return { level, currentLevelXP, nextLevelXP, progress, totalRequired };
};

const getLevelTitle = (level: number) => {
  if (level >= 50) return "Legendary Master";
  if (level >= 40) return "Grand Champion";
  if (level >= 30) return "Elite Warrior";
  if (level >= 20) return "Habit Hero";
  if (level >= 15) return "Discipline Master";
  if (level >= 10) return "Streak Keeper";
  if (level >= 7) return "Rising Star";
  if (level >= 5) return "Habit Builder";
  if (level >= 3) return "Beginner";
  return "Newcomer";
};

const XPSystem = ({ totalXP, dailyCompleted, weeklyCompleted }: XPSystemProps) => {
  const { level, currentLevelXP, nextLevelXP, progress } = calculateLevel(totalXP);
  const title = getLevelTitle(level);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 relative overflow-hidden"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-chart-yellow/20 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10">
        {/* Level Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-chart-cyan to-chart-purple flex items-center justify-center shadow-lg shadow-primary/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-xl font-bold text-primary-foreground">{level}</span>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-display text-lg">Level {level}</h3>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Star className="w-4 h-4 text-chart-yellow fill-chart-yellow" />
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary font-bold">
              <Zap className="w-4 h-4" />
              <span>{totalXP.toLocaleString()} XP</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {nextLevelXP - currentLevelXP} XP to next level
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative h-4 bg-secondary/50 rounded-full overflow-hidden border border-border/30">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(160, 84%, 39%), hsl(180, 70%, 50%), hsl(265, 70%, 60%))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-80, 400] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </div>

        {/* XP Breakdown */}
        <div className="flex justify-between mt-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>Today: +{dailyCompleted * 10} XP</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Trophy className="w-3 h-3" />
            <span>Weekly: +{weeklyCompleted * 50} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default XPSystem;
