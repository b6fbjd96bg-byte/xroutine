import { Crown, Sparkles, Zap, Shield, BarChart3, Mail, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    if (open && user) {
      supabase
        .from("premium_waitlist")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setAlreadyJoined(!!data));
    }
  }, [open, user]);

  const handleJoinWaitlist = async () => {
    if (!user || alreadyJoined) return;
    setLoading(true);
    const { error } = await supabase
      .from("premium_waitlist")
      .insert({ user_id: user.id });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setAlreadyJoined(true);
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
        return;
      }
    }

    setAlreadyJoined(true);
    toast({
      title: "You're on the list! 🎉",
      description: "We'll notify you when Premium launches.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-xl">
            <Crown className="w-6 h-6 text-chart-yellow" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        {feature && (
          <div className="rounded-xl bg-chart-yellow/10 border border-chart-yellow/20 p-3 text-sm">
            <span className="font-medium text-chart-yellow">🔒 Premium Feature:</span>{" "}
            <span className="text-muted-foreground">{feature}</span>
          </div>
        )}

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
          <Button
            variant="hero"
            size="lg"
            className="w-full gap-2"
            onClick={handleJoinWaitlist}
            disabled={loading || alreadyJoined}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : alreadyJoined ? <Check className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
            {alreadyJoined ? "You're on the Waitlist!" : "Join Waitlist — Coming Soon"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Premium pricing will be announced soon. No charge today.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePrompt;
