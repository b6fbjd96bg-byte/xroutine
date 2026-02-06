import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface XPNotification {
  id: string;
  amount: number;
  x: number;
  y: number;
}

interface FloatingXPProps {
  notifications: XPNotification[];
  onComplete: (id: string) => void;
}

const FloatingXP = ({ notifications, onComplete }: FloatingXPProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              x: notification.x,
              y: notification.y 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              y: notification.y - 100,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1]
            }}
            onAnimationComplete={() => onComplete(notification.id)}
            className="absolute flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, hsl(160, 84%, 39%), hsl(180, 70%, 50%))",
              boxShadow: "0 0 20px hsl(160, 84%, 39%, 0.5)",
            }}
          >
            <Zap className="w-4 h-4 text-primary-foreground" />
            <span className="text-primary-foreground">+{notification.amount} XP</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingXP;
