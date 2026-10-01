import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Check, Trophy, Flame, TrendingUp } from "lucide-react";

const HABITS = [
  { name: "Morning Run", color: "bg-chart-pink", text: "text-chart-pink" },
  { name: "Read 20 min", color: "bg-chart-blue", text: "text-chart-blue" },
  { name: "Meditate", color: "bg-chart-purple", text: "text-chart-purple" },
  { name: "Drink Water", color: "bg-chart-cyan", text: "text-chart-cyan" },
  { name: "No Sugar", color: "bg-chart-yellow", text: "text-chart-yellow" },
];
const DAYS = 14;
// Pre-defined "story" of which cells get ticked (day-major order)
const pattern = (h: number, d: number) => ((h * 7 + d * 3) % 5 !== 0) || d > 10;

const LiveDashboardDemo = () => {
  const order = useMemo(() => {
    const o: [number, number][] = [];
    for (let d = 0; d < DAYS; d++) for (let h = 0; h < HABITS.length; h++) if (pattern(h, d)) o.push([h, d]);
    return o;
  }, []);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s >= order.length + 12 ? 0 : s + 1)), 140);
    return () => clearInterval(t);
  }, [order.length]);

  const done = useMemo(() => new Set(order.slice(0, step).map(([h, d]) => `${h}-${d}`)), [order, step]);
  useEffect(() => { if (step === order.length) { setToast(true); setTimeout(() => setToast(false), 1600); } }, [step, order.length]);

  const perDay = Array.from({ length: DAYS }, (_, d) => HABITS.filter((_, h) => done.has(`${h}-${d}`)).length / HABITS.length);
  const activeDays = Math.max(1, Math.min(DAYS, order.slice(0, step).reduce((m, [, d]) => Math.max(m, d + 1), 0)));
  const pts = perDay.slice(0, activeDays).map((v, i) => `${(i / (DAYS - 1)) * 300},${90 - v * 80}`).join(" ");
  const pct = Math.round((perDay.slice(0, activeDays).reduce((a, b) => a + b, 0) / activeDays) * 100);
  const streak = perDay.slice(0, activeDays).filter((v) => v >= 0.6).length;
  const xp = Math.min(100, Math.round((step / order.length) * 100));

  return (
    <div className="relative bg-card rounded-xl p-4 sm:p-6 border border-border/50 text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-chart-pink" /><span className="w-2.5 h-2.5 rounded-full bg-chart-yellow" /><span className="w-2.5 h-2.5 rounded-full bg-chart-green" />
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" />Live</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="bg-secondary/50 rounded-lg p-2 sm:p-3"><div className="text-[10px] sm:text-xs text-muted-foreground">Completion</div><div className="text-lg sm:text-2xl font-bold text-primary tabular-nums">{pct}%</div></div>
        <div className="bg-secondary/50 rounded-lg p-2 sm:p-3"><div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3" />Streak</div><div className="text-lg sm:text-2xl font-bold text-chart-pink tabular-nums">{streak}d</div></div>
        <div className="bg-secondary/50 rounded-lg p-2 sm:p-3"><div className="text-[10px] sm:text-xs text-muted-foreground">Level XP</div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-primary to-chart-cyan" animate={{ width: `${xp}%` }} transition={{ duration: 0.2 }} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Habit grid */}
        <div className="md:col-span-3 space-y-1.5">
          {HABITS.map((h, hi) => (
            <div key={h.name} className="flex items-center gap-2">
              <span className={`w-20 sm:w-24 shrink-0 text-[11px] sm:text-xs font-medium truncate ${h.text}`}>{h.name}</span>
              <div className="flex gap-[3px] flex-1">
                {Array.from({ length: DAYS }).map((_, d) => {
                  const on = done.has(`${hi}-${d}`);
                  return (
                    <motion.div key={d} animate={on ? { scale: [0.6, 1.15, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}
                      className={`flex-1 aspect-square rounded-[3px] flex items-center justify-center ${on ? h.color : "bg-secondary/70"}`}>
                      {on && <Check className="w-2 h-2 text-background" strokeWidth={4} />}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Trend */}
        <div className="md:col-span-2 bg-secondary/40 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1 text-xs"><span className="text-muted-foreground">Completion trend</span><TrendingUp className="w-3.5 h-3.5 text-chart-green" /></div>
          <svg viewBox="0 0 300 100" className="w-full h-24" preserveAspectRatio="none">
            <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" /></linearGradient></defs>
            {activeDays > 1 && <polygon points={`0,100 ${pts} ${((activeDays - 1) / (DAYS - 1)) * 300},100`} fill="url(#trendFill)" />}
            <polyline points={pts} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs sm:text-sm font-semibold shadow-lg">
            <Trophy className="w-4 h-4" /> Goal achieved! +50 XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveDashboardDemo;
