import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DailyQuote from "@/components/gamification/DailyQuote";

const MotivationPopup = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setOpen(true), 1500);
    const b = setTimeout(() => setOpen(false), 9500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="relative w-[min(88vw,340px)] rounded-2xl border border-primary/40 bg-card shadow-xl pointer-events-auto"
          >
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 z-10 p-1 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            <DailyQuote />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotivationPopup;
