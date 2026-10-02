import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const STEPS = [
  { id: "tour-daily", title: "Add your first habit", text: "This is your Daily Habits board. Click here to add your first habit and tick today's box." },
  { id: "tour-trend", title: "Watch your trend grow", text: "Your daily completion trend animates here as you tick habits off each day." },
  { id: "tour-weekly", title: "Weekly habits", text: "Add bigger goals you want to hit once a week, like a long run or a deep clean." },
];

const DashboardTour = ({ userId, createdAt }: { userId?: string; createdAt?: string }) => {
  const key = `tour_done_${userId}`;
  const [step, setStep] = useState<number>(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const isNew = createdAt && Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
    if (userId && isNew && !localStorage.getItem(key)) setTimeout(() => setStep(0), 700);
  }, [userId, key, createdAt]);

  useEffect(() => {
    if (step < 0) return;
    const el = document.getElementById(STEPS[step].id);
    if (!el) { next(); return; }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const update = () => setRect(el.getBoundingClientRect());
    const t = setTimeout(update, 500);
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => { clearTimeout(t); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const finish = () => { localStorage.setItem(key, "1"); setStep(-1); setRect(null); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => (step >= STEPS.length - 1 ? finish() : setStep(step + 1));

  if (step < 0 || !rect) return null;
  const s = STEPS[step];
  const below = rect.top < window.innerHeight / 2;
  const cardTop = below ? Math.min(rect.bottom + 12, window.innerHeight - 180) : Math.max(rect.top - 172, 12);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <motion.div
          key={`spot-${step}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute rounded-2xl ring-2 ring-primary"
          style={{ top: rect.top - 8, left: rect.left - 8, width: rect.width + 16, height: rect.height + 16, boxShadow: "0 0 0 9999px hsl(var(--background) / 0.75)", transition: "all 0.4s ease" }}
        />
        <motion.div
          key={`card-${step}`}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="absolute left-1/2 -translate-x-1/2 w-[min(92vw,380px)] glass-card bg-card p-5 pointer-events-auto"
          style={{ top: cardTop }}
        >
          <p className="text-xs text-primary font-semibold mb-1">Step {step + 1} of {STEPS.length}</p>
          <h3 className="font-display font-bold text-lg mb-1">{s.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{s.text}</p>
          <div className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={finish}>Skip</Button>
            <Button size="sm" onClick={next}>{step === STEPS.length - 1 ? "Let's go!" : "Next"}</Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DashboardTour;
