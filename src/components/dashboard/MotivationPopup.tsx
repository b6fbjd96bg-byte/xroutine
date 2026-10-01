import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import DailyQuote from "@/components/gamification/DailyQuote";

const MotivationPopup = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setOpen(true), 1500);
    const b = setTimeout(() => setOpen(false), 9500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 md:left-24 z-40 flex flex-col items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="relative w-[min(88vw,340px)] rounded-2xl border border-primary/40 bg-card shadow-xl"
          >
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 z-10 p-1 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            <DailyQuote />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
        className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        aria-label="Daily motivation"
      >
        <Lightbulb className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default MotivationPopup;
