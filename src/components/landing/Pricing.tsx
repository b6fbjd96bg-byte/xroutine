import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, PlanKey, LIFETIME_CAP, PRO_FEATURES, TRIAL_DAYS } from "@/lib/plans";
import { getLifetimeSpotsLeft } from "@/lib/razorpay";
import { useAuth } from "@/contexts/AuthContext";
import UpgradePrompt from "@/components/premium/UpgradePrompt";

const ORDER: PlanKey[] = ["monthly", "yearly", "lifetime"];
const PERKS = PRO_FEATURES;

const Pricing = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [spots, setSpots] = useState<number | null>(null);
  useEffect(() => { getLifetimeSpotsLeft().then(setSpots).catch(() => {}); }, []);

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display">How much does Superoutine cost?</h2>
          <p className="text-muted-foreground mt-3">Try everything free for {TRIAL_DAYS} days. After that, keep going with Pro from just ${PLANS.monthly.price}/month.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-4">
          {ORDER.map((k) => {
            const p = PLANS[k];
            const best = k === "yearly";
            return (
              <div key={k} className={`glass-card p-6 flex flex-col relative ${best ? "border-primary/60 ring-1 ring-primary/40" : ""}`}>
                {best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">Best value</span>}
                <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Crown className="w-4 h-4" />{p.label}</div>
                <div className="mt-3"><span className="text-4xl font-bold font-display">${p.price}</span><span className="text-muted-foreground text-sm">{p.per}</span></div>
                <p className="text-xs text-muted-foreground mt-2 min-h-[2rem]">
                  {k === "lifetime" && spots !== null ? `${spots} of ${LIFETIME_CAP} spots left` : p.note}
                </p>
                <ul className="mt-4 space-y-2 text-sm flex-1">
                  {PERKS.map((x) => <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{x}</li>)}
                </ul>
                {user ? (
                  <Button className="mt-6 w-full" variant={best ? "default" : "outline"} onClick={() => setOpen(true)}>Get {p.label}</Button>
                ) : (
                  <Link to="/signup" className="mt-6"><Button className="w-full" variant={best ? "default" : "outline"}>Start free trial</Button></Link>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">Secure payment by Razorpay in USD. Monthly and yearly plans can be cancelled anytime in Settings.</p>
      </div>
      <UpgradePrompt open={open} onOpenChange={setOpen} />
    </section>
  );
};

export default Pricing;
