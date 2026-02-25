import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PushNotificationPromptProps {
  canPrompt: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

const PushNotificationPrompt = ({ canPrompt, onAccept, onDismiss }: PushNotificationPromptProps) => {
  if (!canPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="glass-card p-4 sm:p-5 relative"
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm mb-0.5">Never miss a streak!</h3>
            <p className="text-xs text-muted-foreground">
              Get gentle reminders to protect your habits.
            </p>
          </div>
          <Button variant="hero" size="sm" onClick={onAccept} className="text-xs">
            Enable
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PushNotificationPrompt;
