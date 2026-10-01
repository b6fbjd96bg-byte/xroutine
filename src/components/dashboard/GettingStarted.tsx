import { motion } from "framer-motion";
import { Plus, CheckCircle2, Sparkles, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  habitCount: number;
  everCompleted: boolean;
  completedToday: number;
}

const scrollToHabits = () =>
  document.getElementById("daily-habits")?.scrollIntoView({ behavior: "smooth", block: "start" });

const GettingStarted = ({ habitCount, everCompleted, completedToday }: Props) => {
  const step = habitCount === 0 ? 1 : !everCompleted ? 2 : 3;

  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.03, 1] }}
        transition={{ scale: { duration: 1.6, repeat: Infinity }, opacity: { duration: 0.4 } }}
        className="glass-card p-4 sm:p-5 text-center"
      >
        <p className="text-lg sm:text-2xl font-bold font-display text-gradient">
          {completedToday > 0 ? `🔥 ${completedToday} done today. You're building momentum!` : "Every day is a fresh start. Tick one habit to keep growing!"}
        </p>
      </motion.div>
    );
  }

  const steps = [
    { n: 1, icon: Plus, title: "Create your first habit", desc: "Add one small thing you want to do every day." },
    { n: 2, icon: CheckCircle2, title: "Tick it off today", desc: "Tap today's box to earn your first XP." },
    { n: 3, icon: Sparkles, title: "Unlock your full dashboard", desc: "Stats, trends and streaks appear as you grow." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 border border-primary/30">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-bold font-display">Let's get you started</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {steps.map((s) => {
          const active = s.n === step;
          const done = s.n < step;
          return (
            <motion.div
              key={s.n}
              animate={active ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`rounded-xl p-4 border transition-colors ${active ? "border-primary bg-primary/10" : done ? "border-primary/30 bg-primary/5" : "border-border/50 opacity-60"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {done ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <s.icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />}
                <span className="font-semibold font-display text-sm">Step {s.n}: {s.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
      <Button onClick={scrollToHabits} className="gap-2">
        {step === 1 ? "Create my first habit" : "Go tick today's habit"} <ArrowDown className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default GettingStarted;
