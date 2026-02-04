import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, X, MessageCircle, Trophy, Target, Flame, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIMotivationAgentProps {
  completedToday: number;
  totalHabits: number;
  currentStreak: number;
  weeklyProgress: number;
  userName?: string;
}

const motivationalMessages = {
  morning: [
    "Rise and shine! 🌅 A new day means new opportunities to build great habits.",
    "Good morning, champion! Every habit you complete today is a step toward your best self.",
    "The early bird gets the worm! Let's make today count.",
  ],
  lowProgress: [
    "Hey, I noticed you're a bit behind today. No worries! Start with just one small habit.",
    "Every expert was once a beginner. Pick one habit and crush it!",
    "Remember: progress, not perfection. Let's get one win today! 💪",
  ],
  midProgress: [
    "You're making great progress! Keep that momentum going!",
    "Halfway there! You've got this. Finish strong today! 🔥",
    "Your consistency is inspiring. Let's complete a few more!",
  ],
  highProgress: [
    "WOW! You're on fire today! 🔥 Almost at 100%!",
    "Incredible work! You're building unstoppable momentum!",
    "You're crushing it! This is what champions look like!",
  ],
  complete: [
    "🎉 AMAZING! You've completed all habits today! You're unstoppable!",
    "100% completion! You're a habit-building machine! 🏆",
    "Perfect day! Your future self is going to thank you!",
  ],
  streak: [
    "Your {streak}-day streak is incredible! Keep it going!",
    "Consistency is your superpower! {streak} days strong! 💪",
    "{streak} days of dedication. You're rewriting your story!",
  ],
};

const tips = [
  { icon: Target, text: "Start with your easiest habit to build momentum", color: "text-chart-purple" },
  { icon: Flame, text: "Never break the chain! Streaks build lasting habits", color: "text-chart-yellow" },
  { icon: Heart, text: "Be kind to yourself on tough days - tomorrow is fresh", color: "text-chart-pink" },
  { icon: Zap, text: "Stack new habits with existing routines for success", color: "text-chart-cyan" },
  { icon: Trophy, text: "Celebrate small wins - they compound into big changes", color: "text-primary" },
];

const AIMotivationAgent = ({ 
  completedToday, 
  totalHabits, 
  currentStreak, 
  weeklyProgress,
  userName = "Champion"
}: AIMotivationAgentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const getAppropriateMessage = () => {
    const hour = new Date().getHours();
    let messagePool: string[];

    if (progressPercentage >= 100) {
      messagePool = motivationalMessages.complete;
    } else if (progressPercentage >= 70) {
      messagePool = motivationalMessages.highProgress;
    } else if (progressPercentage >= 40) {
      messagePool = motivationalMessages.midProgress;
    } else if (progressPercentage > 0) {
      messagePool = motivationalMessages.lowProgress;
    } else if (hour < 12) {
      messagePool = motivationalMessages.morning;
    } else {
      messagePool = motivationalMessages.lowProgress;
    }

    // Add streak message occasionally
    if (currentStreak >= 3 && Math.random() > 0.5) {
      const streakMessage = motivationalMessages.streak[
        Math.floor(Math.random() * motivationalMessages.streak.length)
      ].replace("{streak}", currentStreak.toString());
      return streakMessage;
    }

    return messagePool[Math.floor(Math.random() * messagePool.length)];
  };

  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      const message = getAppropriateMessage();
      let index = 0;
      setCurrentMessage("");
      
      const typingInterval = setInterval(() => {
        if (index < message.length) {
          setCurrentMessage(prev => prev + message[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [isOpen, completedToday]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 10000);
    return () => clearInterval(tipInterval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowNotification(false);
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-chart-cyan to-chart-purple shadow-xl shadow-primary/30 flex items-center justify-center group"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Bot className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Notification badge */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-chart-pink rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-background" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-6 right-6 w-[380px] max-h-[500px] z-50 glass-card overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-primary/10 to-chart-cyan/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-cyan flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display">Routine AI</h3>
                    <p className="text-xs text-muted-foreground">Your motivation coach</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                {/* Greeting */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-cyan flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="glass-card p-3 rounded-2xl rounded-tl-sm">
                      <p className="text-sm">
                        Hey {userName}! 👋
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-cyan flex-shrink-0 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="glass-card p-3 rounded-2xl rounded-tl-sm">
                      <p className="text-sm min-h-[40px]">
                        {currentMessage}
                        {isTyping && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            |
                          </motion.span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="glass-card p-3 text-center">
                    <div className="text-lg font-bold text-primary">{completedToday}/{totalHabits}</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <div className="text-lg font-bold text-chart-yellow flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4" />
                      {currentStreak}
                    </div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <div className="text-lg font-bold text-chart-cyan">{weeklyProgress}%</div>
                    <div className="text-xs text-muted-foreground">Weekly</div>
                  </div>
                </motion.div>

                {/* Tip of the day */}
                <motion.div
                  key={currentTip.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border/30"
                >
                  <currentTip.icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", currentTip.color)} />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">💡 Pro Tip</p>
                    <p className="text-xs text-muted-foreground">{currentTip.text}</p>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    View Habits
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setCurrentMessage("");
                      setIsTyping(true);
                      const message = getAppropriateMessage();
                      let index = 0;
                      const typingInterval = setInterval(() => {
                        if (index < message.length) {
                          setCurrentMessage(prev => prev + message[index]);
                          index++;
                        } else {
                          setIsTyping(false);
                          clearInterval(typingInterval);
                        }
                      }, 30);
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Motivate Me!
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMotivationAgent;
