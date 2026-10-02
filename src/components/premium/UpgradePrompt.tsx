import { EmojiIcon } from "@/components/ui/emoji-icon";
import { Crown, Loader2, Check, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { payForPro, getLifetimeSpotsLeft } from "@/lib/razorpay";
import { PLANS, LIFETIME_CAP, PRO_FEATURES, type PlanKey } from "@/lib/plans";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export const PlanPicker = ({ onPaid }: { onPaid?: () => void }) => {
  const { toast } = useToast();
  const { plan: currentPlan, tier } = useSubscription();
  const [selected, setSelected] = useState<PlanKey>("yearly");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [spots, setSpots] = useState<number | null>(null);

  useEffect(() => { getLifetimeSpotsLeft().then(setSpots).catch(() => {}); }, []);

  const isLifetime = tier === "premium" && currentPlan === "lifetime";
  const soldOut = spots !== null && spots <= 0;

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await payForPro(selected);
      if (res === "paid") {
        setPaid(true);
        toast({ title: "Welcome to Pro!", description: `Your ${PLANS[selected].label.toLowerCase()} Pro plan is active.` });
        onPaid?.();
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (e: any) {
      toast({ title: "Payment not completed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isLifetime) return <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center text-sm">You have lifetime Pro. Nothing more to pay.</div>;

  const p = PLANS[selected];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(PLANS) as PlanKey[]).map((k) => {
          const pl = PLANS[k];
          const disabled = k === "lifetime" && soldOut;
          return (
            <button
              key={k}
              disabled={disabled}
              onClick={() => setSelected(k)}
              className={cn(
                "relative rounded-xl border-2 p-3 text-left transition-colors",
                selected === k ? "border-primary bg-primary/10" : "border-border/50 hover:border-border",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {k === "yearly" && <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">BEST</span>}
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                {k === "lifetime" && <InfinityIcon className="w-3.5 h-3.5" />}{pl.label}
              </div>
              <div className="text-lg sm:text-xl font-bold font-display">${pl.price}<span className="text-[10px] sm:text-xs font-medium text-muted-foreground">{pl.per}</span></div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight mt-0.5">
                {k === "lifetime" ? (soldOut ? "Sold out" : spots !== null ? `${spots} of ${LIFETIME_CAP} left` : pl.note) : pl.note}
              </div>
            </button>
          );
        })}
      </div>

      <ul className="grid sm:grid-cols-2 gap-1.5 text-xs">
        {PRO_FEATURES.map((f) => (
          <li key={f} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />{f}</li>
        ))}
      </ul>

      <div className="space-y-2">
        <Button variant="hero" size="lg" className="w-full gap-2" onClick={handlePay} disabled={loading || paid || (selected === "lifetime" && soldOut)}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : paid ? <Check className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
          {paid ? "You're Pro!" : `Pay $${p.price} — ${p.label}`}
        </Button>
        <p className="text-xs text-center text-muted-foreground">Secure payment by Razorpay in US dollars. No auto-renewal — pay again when you want more time.</p>
      </div>
    </div>
  );
};

const UpgradePrompt = ({ open, onOpenChange, feature }: UpgradePromptProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-display flex items-center gap-2 text-xl">
          <Crown className="w-6 h-6 text-chart-yellow" />
          Upgrade to Pro
        </DialogTitle>
      </DialogHeader>
      {feature && (
        <div className="rounded-xl bg-chart-yellow/10 border border-chart-yellow/20 p-3 text-sm">
          <span className="font-medium text-chart-yellow"><EmojiIcon e="🔒" /> Pro Feature:</span>{" "}
          <span className="text-muted-foreground">{feature}</span>
        </div>
      )}
      {open && <PlanPicker />}
    </DialogContent>
  </Dialog>
);

export default UpgradePrompt;
