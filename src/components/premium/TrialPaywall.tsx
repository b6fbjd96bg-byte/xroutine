import { useNavigate } from "react-router-dom";
import { Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlanPicker } from "./UpgradePrompt";
import { TRIAL_DAYS } from "@/lib/plans";

/** Full-screen lock shown once the free trial is over and the user hasn't paid. */
const TrialPaywall = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-yellow/15">
            <Crown className="h-7 w-7 text-chart-yellow" />
          </div>
          <h1 className="text-2xl font-bold font-display">Your {TRIAL_DAYS}-day free trial has ended</h1>
          <p className="text-sm text-muted-foreground">
            Your habits and progress are safe. Pick a plan to keep building your streak — it's cheaper than a coffee.
          </p>
        </div>
        <PlanPicker />
        <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={async () => { await signOut(); navigate("/"); }}>
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>
    </div>
  );
};

export default TrialPaywall;
