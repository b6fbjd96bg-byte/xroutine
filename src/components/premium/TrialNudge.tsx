import { useState } from "react";
import { Crown, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useProgressInvestment } from "@/hooks/useProgressInvestment";
import UpgradePrompt from "./UpgradePrompt";
import { TRIAL_DAYS } from "@/lib/plans";

const DISMISS_KEY = "trial_nudge_dismissed";

/** Dashboard banner during the trial: countdown, what they've built, daily price. Grows more urgent near the end. */
const TrialNudge = () => {
  const { isTrial, trialDaysLeft } = useSubscription();
  const inv = useProgressInvestment();
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [hidden, setHidden] = useState(() => localStorage.getItem(DISMISS_KEY) === today);

  if (!isTrial) return null;
  const urgent = trialDaysLeft <= 3;
  if (hidden && !urgent) return null;

  const pct = Math.round(((TRIAL_DAYS - trialDaysLeft) / TRIAL_DAYS) * 100);
  const built = inv && (inv.checkIns > 0 || inv.habits > 0);

  const headline = urgent
    ? `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left. Don't let ${inv?.checkIns ? `${inv.checkIns} check-ins` : "your progress"} stop here.`
    : `You're ${pct}% through your trial. People who stick with it become the ones who finish.`;

  return (
    <>
      <div className={`glass-card rounded-2xl p-4 sm:p-5 border ${urgent ? "border-chart-orange/40" : "border-primary/30"}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 space-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />Free trial · {trialDaysLeft} of {TRIAL_DAYS} days left
            </p>
            <p className="font-semibold font-display text-base sm:text-lg">{headline}</p>
            {built && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-chart-orange shrink-0" />
                In {inv!.days} days you built {inv!.habits} habits, {inv!.checkIns} check-ins{inv!.tasksDone ? `, ${inv!.tasksDone} finished tasks` : ""} and {inv!.xp} XP. Pro keeps all of it going.
              </p>
            )}
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full ${urgent ? "bg-chart-orange" : "bg-primary"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="flex md:flex-col gap-2 md:items-end shrink-0">
            <Button variant="hero" className="gap-2 flex-1 md:flex-none" onClick={() => setOpen(true)}>
              <Crown className="w-4 h-4" />Keep my progress, $0.11/day
            </Button>
            {!urgent && (
              <button className="text-xs text-muted-foreground hover:text-foreground px-2" onClick={() => { localStorage.setItem(DISMISS_KEY, today); setHidden(true); }}>
                Remind me tomorrow
              </button>
            )}
          </div>
        </div>
      </div>
      <UpgradePrompt open={open} onOpenChange={setOpen} feature={urgent ? "Your trial ends soon — your habits stay saved and unlocked." : undefined} />
    </>
  );
};

export default TrialNudge;
