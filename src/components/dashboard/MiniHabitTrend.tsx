import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props { data: { day: number; percentage: number }[] }

const MiniHabitTrend = ({ data }: Props) => {
  if (data.length === 0) return null;
  const W = 600, H = 120;
  const n = Math.max(data.length - 1, 1);
  const pts = data.map((d, i) => [(i / n) * W, H - 10 - (d.percentage / 100) * (H - 20)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H} L0,${H} Z`;
  const today = data[data.length - 1]?.percentage ?? 0;
  const prev = data[data.length - 2]?.percentage ?? 0;
  const up = today >= prev;

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">Today's habit trend</span>
        <span className={`flex items-center gap-1 text-sm font-bold tabular-nums ${up ? "text-primary" : "text-chart-pink"}`}>
          {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <motion.span key={today} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{today}%</motion.span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-24 sm:h-28">
        <defs>
          <linearGradient id="miniTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#miniTrendFill)" animate={{ d: area }} transition={{ duration: 0.5, ease: "easeOut" }} />
        <motion.path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
          animate={{ d: line }} transition={{ duration: 0.5, ease: "easeOut" }} />
        <motion.circle r={6} fill="hsl(var(--primary))" animate={{ cx: pts[pts.length - 1][0], cy: pts[pts.length - 1][1] }} transition={{ duration: 0.5 }} />
      </svg>
    </div>
  );
};

export default MiniHabitTrend;
