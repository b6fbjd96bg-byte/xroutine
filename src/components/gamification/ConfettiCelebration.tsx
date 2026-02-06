import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

const ConfettiCelebration = ({ trigger, onComplete }: ConfettiCelebrationProps) => {
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    // Brand colors in RGB
    const colors = ["#00ffa3", "#00d4aa", "#00b8d4", "#a855f7"];

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        onComplete?.();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left side
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: colors,
        shapes: ["circle", "square"],
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
        ticks: 200,
      });

      // Confetti from right side
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: colors,
        shapes: ["circle", "square"],
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
        ticks: 200,
      });
    }, 250);

    // Initial burst from center
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
      shapes: ["circle", "square"],
      gravity: 0.8,
      scalar: 1.5,
      ticks: 300,
    });
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  return null;
};

export default ConfettiCelebration;
