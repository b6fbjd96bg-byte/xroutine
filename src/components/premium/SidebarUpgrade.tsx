import { useState } from "react";
import { Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { PLANS } from "@/lib/plans";
import UpgradePrompt from "./UpgradePrompt";
import { cn } from "@/lib/utils";

/** Upsell shown in the sidebar for anyone without paid Pro (trial or free). */
const SidebarUpgrade = ({ compact }: { compact?: boolean }) => {
  const { tier, isTrial, trialDaysLeft, loading } = useSubscription();
  const [open, setOpen] = useState(false);
  if (loading || tier === "premium") return null;

  const line = isTrial ? `Trial: ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left` : "Free plan";

  return (
    <>
      {compact ? (
        <button
          onClick={() => setOpen(true)}
          title={`${line} · Go Pro from $${PLANS.yearly.price}/yr`}
          aria-label="Go Pro"
          className="mb-2 mx-auto w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center hover:bg-primary/25 transition-colors animate-pulse"
        >
          <Crown className="w-5 h-5" />
        </button>
      ) : (
        <div className={cn("mb-3 rounded-xl border border-primary/30 bg-primary/10 p-4")}>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Crown className="w-4 h-4" /> {line}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Unlimited habits & full stats for just ${PLANS.yearly.price / 12 < 4 ? (PLANS.yearly.price / 12).toFixed(2) : PLANS.monthly.price}/month. Less than a coffee.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-3 w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2 hover:opacity-90 transition-opacity"
          >
            Go Pro
          </button>
        </div>
      )}
      <UpgradePrompt open={open} onOpenChange={setOpen} />
    </>
  );
};

export default SidebarUpgrade;
