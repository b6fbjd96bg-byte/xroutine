import {
  Flame, Rocket, Zap, Sprout, Sparkles, Dumbbell, Trophy, RefreshCw, Gem, Star, Crown, Lock, Heart,
  CalendarDays, BarChart3, Settings, Users, Wallet, Globe, Frown, Meh, Smile, Laugh, PartyPopper, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Maps legacy emoji keys to app icons with a themed tone. */
const MAP: Record<string, { icon: LucideIcon; tone: string }> = {
  "🔥": { icon: Flame, tone: "text-chart-pink" },
  "🚀": { icon: Rocket, tone: "text-chart-blue" },
  "⚡": { icon: Zap, tone: "text-chart-yellow" },
  "🌱": { icon: Sprout, tone: "text-primary" },
  "✨": { icon: Sparkles, tone: "text-chart-yellow" },
  "💫": { icon: Sparkles, tone: "text-chart-purple" },
  "🌟": { icon: Sparkles, tone: "text-chart-yellow" },
  "💪": { icon: Dumbbell, tone: "text-primary" },
  "🏆": { icon: Trophy, tone: "text-chart-yellow" },
  "🔄": { icon: RefreshCw, tone: "text-chart-cyan" },
  "💎": { icon: Gem, tone: "text-chart-cyan" },
  "⭐": { icon: Star, tone: "text-chart-yellow" },
  "👑": { icon: Crown, tone: "text-chart-yellow" },
  "🔒": { icon: Lock, tone: "text-chart-yellow" },
  "💚": { icon: Heart, tone: "text-primary" },
  "📅": { icon: CalendarDays, tone: "text-chart-blue" },
  "📊": { icon: BarChart3, tone: "text-primary" },
  "⚙️": { icon: Settings, tone: "text-muted-foreground" },
  "👥": { icon: Users, tone: "text-chart-blue" },
  "💰": { icon: Wallet, tone: "text-primary" },
  "🌐": { icon: Globe, tone: "text-chart-cyan" },
  "🎉": { icon: PartyPopper, tone: "text-chart-pink" },
  "😔": { icon: Frown, tone: "text-chart-blue" },
  "😐": { icon: Meh, tone: "text-muted-foreground" },
  "🙂": { icon: Smile, tone: "text-chart-cyan" },
  "😊": { icon: Smile, tone: "text-primary" },
  "🤩": { icon: Laugh, tone: "text-chart-yellow" },
};

export const EmojiIcon = ({ e, className, badge }: { e: string; className?: string; badge?: boolean }) => {
  const m = MAP[e] ?? MAP["✨"];
  const Icon = m.icon;
  if (badge)
    return (
      <span className={cn("inline-flex items-center justify-center rounded-xl bg-current/10", m.tone, className)}>
        <span className="flex h-full w-full items-center justify-center rounded-xl bg-secondary/40">
          <Icon className="h-1/2 w-1/2" />
        </span>
      </span>
    );
  return <Icon className={cn("inline-block h-[1em] w-[1em] align-[-0.125em]", m.tone, className)} />;
};
