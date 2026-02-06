import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, RotateCcw, Volume2, VolumeX, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
  habitName: string;
  defaultMinutes?: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const presets = [
  { label: "5 min", minutes: 5 },
  { label: "15 min", minutes: 15 },
  { label: "25 min", minutes: 25 },
  { label: "45 min", minutes: 45 },
];

const FocusTimer = ({ habitName, defaultMinutes = 25, isOpen, onClose, onComplete }: FocusTimerProps) => {
  const [selectedMinutes, setSelectedMinutes] = useState(defaultMinutes);
  const [timeLeft, setTimeLeft] = useState(selectedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const totalSeconds = selectedMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const reset = useCallback(() => {
    setTimeLeft(selectedMinutes * 60);
    setIsRunning(false);
    setHasStarted(false);
  }, [selectedMinutes]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    setTimeLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && hasStarted) {
      setIsRunning(false);
      // Play completion sound if not muted
      if (!isMuted) {
        // Simple beep using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, hasStarted, isMuted]);

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(228, 84%, 5%), hsl(230, 60%, 8%))",
          }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/20"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Sound toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          <div className="relative z-10 flex flex-col items-center">
            {/* Habit name */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-display font-bold text-gradient mb-8"
            >
              {habitName}
            </motion.h1>

            {/* Timer circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-72 h-72 mb-8"
            >
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 283" }}
                  animate={{ strokeDasharray: `${progress * 2.83} 283` }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                    <stop offset="50%" stopColor="hsl(180, 70%, 50%)" />
                    <stop offset="100%" stopColor="hsl(265, 70%, 60%)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {timeLeft === 0 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className="text-center"
                  >
                    <Check className="w-16 h-16 text-primary mx-auto mb-2" />
                    <p className="text-xl font-display font-bold text-primary">Complete!</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.span
                      key={timeLeft}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-display font-bold tracking-tight"
                    >
                      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </motion.span>
                    <span className="text-sm text-muted-foreground mt-2">
                      {isRunning ? "Focus time" : hasStarted ? "Paused" : "Ready"}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Presets (only show before starting) */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 mb-8"
              >
                {presets.map((preset) => (
                  <Button
                    key={preset.minutes}
                    variant={selectedMinutes === preset.minutes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMinutes(preset.minutes)}
                    className={cn(
                      "rounded-full px-4",
                      selectedMinutes === preset.minutes && "shadow-lg shadow-primary/30"
                    )}
                  >
                    {preset.label}
                  </Button>
                ))}
              </motion.div>
            )}

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              {timeLeft === 0 ? (
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-chart-cyan shadow-lg shadow-primary/30"
                  onClick={handleComplete}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Mark Complete
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-14 h-14 rounded-full"
                    onClick={reset}
                    disabled={!hasStarted}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    className={cn(
                      "w-20 h-20 rounded-full shadow-lg",
                      isRunning
                        ? "bg-chart-yellow hover:bg-chart-yellow/90 shadow-chart-yellow/30"
                        : "bg-gradient-to-r from-primary to-chart-cyan shadow-primary/30"
                    )}
                    onClick={isRunning ? () => setIsRunning(false) : handleStart}
                  >
                    {isRunning ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                  <div className="w-14" /> {/* Spacer for symmetry */}
                </>
              )}
            </motion.div>

            {/* Motivational text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-sm text-muted-foreground text-center max-w-sm"
            >
              {isRunning
                ? "Stay focused. You're building something great."
                : timeLeft === 0
                ? "Amazing work! You completed your focus session."
                : "Press play when you're ready to begin your deep work session."}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusTimer;
