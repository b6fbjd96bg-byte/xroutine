import { Crown, Sparkles, Zap, Shield, BarChart3, Mail, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { PRO_PRICE_MONTHLY } from "@/hooks/useSubscription";
import { payForPro } from "@/lib/razorpay";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const benefits = [
  { icon: Zap, label: "Unlimited habits", desc: "Daily & weekly, no caps" },
  { icon: BarChart3, label: "Deep analytics", desc: "Full charts & insights" },
  { icon: Shield, label: "3 streak protections/mo", desc: "Triple your safety net" },
  { icon: Mail, label: "Weekly email reports", desc: "Progress delivered to inbox" },
  { icon: Sparkles, label: "AI Motivation (full)", desc: "Personalized coaching" },
];

const UpgradePrompt = ({ open, onOpenChange, feature }: UpgradePromptProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await payForPro();
      if (res === "paid") {
        setPaid(true);
        toast({ title: "Welcome to Pro! 👑", description: "Your Pro plan is active for 1 month." });
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (e: any) {
      toast({ title: "Payment not completed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-xl">
            <Crown className="w-6 h-6 text-chart-yellow" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        {feature && (
          <div className="rounded-xl bg-chart-yellow/10 border border-chart-yellow/20 p-3 text-sm">
            <span className="font-medium text-chart-yellow">🔒 Pro Feature:</span>{" "}
            <span className="text-muted-foreground">{feature}</span>
          </div>
        )}

        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center">
          <div className="text-4xl font-bold font-display">₹{PRO_PRICE_MONTHLY}<span className="text-base font-medium text-muted-foreground">/month</span></div>
          <div className="text-sm text-primary font-medium mt-1">Less than ₹2 a day — cheaper than a cup of chai ☕</div>
        </div>

        <div className="space-y-3 py-2">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-start gap-3 p-2 rounded-xl bg-secondary/30">
              <b.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium">{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <Button variant="hero" size="lg" className="w-full gap-2" onClick={handlePay} disabled={loading || paid}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : paid ? <Check className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
            {paid ? "You're Pro!" : `Pay ₹${PRO_PRICE_MONTHLY} — Get Pro`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure payment by Razorpay · UPI, cards, netbanking. 1 month of Pro, no auto-renewal.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePrompt;
