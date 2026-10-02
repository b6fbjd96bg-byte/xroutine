import { EmojiIcon } from "@/components/ui/emoji-icon";
import { Crown, Sparkles, Zap, Shield, BarChart3, Mail, Loader2, Check, GraduationCap, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { payForPro, getLifetimeSpotsLeft } from "@/lib/razorpay";
import { PLANS, LIFETIME_CAP, type PlanKey } from "@/lib/plans";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const benefits = [
  { icon: Zap, label: "Unlimited habits" },
  { icon: BarChart3, label: "Deep analytics" },
  { icon: Shield, label: "3 streak protections/mo" },
  { icon: Mail, label: "Weekly email reports" },
  { icon: Sparkles, label: "Full AI coaching" },
];

const UpgradePrompt = ({ open, onOpenChange, feature }: UpgradePromptProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isStudent, plan: currentPlan, tier } = useSubscription();
  const [selected, setSelected] = useState<PlanKey>("yearly");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [spots, setSpots] = useState<number | null>(null);
  const [studentReq, setStudentReq] = useState<{ status: string } | null>(null);
  const [school, setSchool] = useState("");
  const [studentId, setStudentId] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    getLifetimeSpotsLeft().then(setSpots);
    if (user) supabase.from("student_requests" as any).select("status").eq("user_id", user.id).maybeSingle().then(({ data }) => setStudentReq(data as any));
  }, [open, user]);

  const isLifetime = tier === "premium" && currentPlan === "lifetime";
  const soldOut = spots !== null && spots <= 0;
  const needsStudentApproval = selected === "student" && !isStudent;

  const sendStudentRequest = async () => {
    if (!user || school.trim().length < 2) return toast({ title: "Enter your school or college name", variant: "destructive" });
    setSending(true);
    const { error } = await supabase.from("student_requests" as any).insert({ user_id: user.id, school: school.trim().slice(0, 150), student_id: studentId.trim().slice(0, 100) || null });
    setSending(false);
    if (error) return toast({ title: "Couldn't send request", description: error.message, variant: "destructive" });
    setStudentReq({ status: "pending" });
    toast({ title: "Request sent", description: "We'll review it soon. Once approved, the student price unlocks here." });
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await payForPro(selected);
      if (res === "paid") {
        setPaid(true);
        toast({ title: "Welcome to Pro!", description: `Your ${PLANS[selected].label.toLowerCase()} Pro plan is active.` });
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (e: any) {
      toast({ title: "Payment not completed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const p = PLANS[selected];

  return (
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

        {isLifetime ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center text-sm">You have lifetime Pro. Nothing more to pay.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PLANS) as PlanKey[]).map((k) => {
                const pl = PLANS[k];
                const disabled = k === "lifetime" && soldOut;
                return (
                  <button
                    key={k}
                    disabled={disabled}
                    onClick={() => setSelected(k)}
                    className={cn(
                      "relative rounded-xl border-2 p-3 text-left transition-all",
                      selected === k ? "border-primary bg-primary/10" : "border-border/50 hover:border-border",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {k === "yearly" && <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">BEST VALUE</span>}
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      {k === "student" && <GraduationCap className="w-3.5 h-3.5" />}
                      {k === "lifetime" && <InfinityIcon className="w-3.5 h-3.5" />}
                      {pl.label}
                    </div>
                    <div className="text-xl font-bold font-display">${pl.price}<span className="text-xs font-medium text-muted-foreground">{pl.per}</span></div>
                    <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {k === "lifetime" ? (soldOut ? "Sold out" : spots !== null ? `${spots} of ${LIFETIME_CAP} spots left` : pl.note) : pl.note}
                    </div>
                  </button>
                );
              })}
            </div>

            {needsStudentApproval && (
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-2 text-sm">
                {studentReq?.status === "pending" ? (
                  <p className="text-muted-foreground">Your student request is being reviewed. Once approved, you can pay ${PLANS.student.price}/month here.</p>
                ) : (
                  <>
                    <p className="text-muted-foreground">{studentReq?.status === "rejected" ? "Your last request wasn't approved. Contact support@superoutine.pro if this is a mistake." : "Tell us where you study. After we approve it, the student price unlocks."}</p>
                    {studentReq?.status !== "rejected" && <>
                      <Input placeholder="School or college name" value={school} onChange={(e) => setSchool(e.target.value)} />
                      <Input placeholder="Student ID number (optional)" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                      <Button className="w-full" variant="outline" onClick={sendStudentRequest} disabled={sending}>{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request student price"}</Button>
                    </>}
                  </>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {benefits.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 rounded-full bg-secondary/40 px-2.5 py-1 text-xs">
                  <b.icon className="w-3.5 h-3.5 text-primary" />{b.label}
                </span>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <Button variant="hero" size="lg" className="w-full gap-2" onClick={handlePay} disabled={loading || paid || needsStudentApproval || (selected === "lifetime" && soldOut)}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : paid ? <Check className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
                {paid ? "You're Pro!" : `Pay $${p.price} — ${p.label}`}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Secure payment by Razorpay in US dollars. No auto-renewal — pay again when you want more time.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePrompt;
