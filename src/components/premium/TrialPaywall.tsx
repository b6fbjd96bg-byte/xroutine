import { useNavigate } from "react-router-dom";
import { Crown, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlanPicker } from "./UpgradePrompt";
import { TRIAL_DAYS } from "@/lib/plans";
import { useProgressInvestment } from "@/hooks/useProgressInvestment";

/** Full-screen lock shown once the free trial is over and the user hasn't paid. */
const TrialPaywall = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const inv = useProgressInvestment();
  const stats = inv ? [
    { v: inv.habits, l: "habits" },
    { v: inv.checkIns, l: "check-ins" },
    { v: inv.tasksDone, l: "tasks done" },
    { v: inv.xp, l: "XP earned" },
  ] : [];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-yellow/15">
            <Crown className="h-7 w-7 text-chart-yellow" />
          </div>
          <h1 className="text-2xl font-bold font-display">You started something. Finish it.</h1>
          <p className="text-sm text-muted-foreground">
            Your {TRIAL_DAYS}-day trial is over. Most people quit habits at this point — you got further than they do.
          </p>
        </div>

        {stats.length > 0 && (
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3"><Lock className="w-3.5 h-3.5" />Saved and waiting for you</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {stats.map((s) => (
                <div key={s.l}><div className="text-xl font-bold font-display text-primary">{s.v}</div><div className="text-[11px] text-muted-foreground">{s.l}</div></div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-sm">Yearly Pro is <b>$0.11 a day</b> — less than one sip of coffee to keep your progress.</p>
        <PlanPicker />
        <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={async () => { await signOut(); navigate("/"); }}>
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>
    </div>
  );
};

export default TrialPaywall;
