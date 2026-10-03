import Seo from "@/seo/Seo";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Percent, Wallet, Repeat, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, PRO_FEATURES, TRIAL_DAYS, type PlanKey } from "@/lib/plans";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const LEVELS = [
  { lvl: "Level 1", who: "Friends you invite", pct: 10 },
  { lvl: "Level 2", who: "Friends they invite", pct: 2 },
  { lvl: "Level 3", who: "One more level down", pct: 0.5 },
];

const Earn = () => {
  const { user } = useAuth();
  useEffect(() => { document.title = "Refer & Earn — Superoutine"; }, []);
  const cta = user ? "/dashboard/refer" : "/signup";

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Refer & Earn – Superoutine Referral Program" description="Earn 10% of every payment your invited friends make on Superoutine, plus 2% and 0.5% from the next two levels. Payouts start from just $10 after 30 days." path="/earn" crumbs={[{ name: "Refer & Earn", path: "/earn" }]} />
      <div className="px-4 py-4 max-w-5xl mx-auto">
        <Link to="/"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" />Back to Home</Button></Link>
      </div>
      <main className="px-4 pb-20 max-w-5xl mx-auto space-y-12">
        <section className="glass-card p-6 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h1 className="text-3xl sm:text-5xl font-bold font-display mb-4">Build habits. <span className="text-gradient">Earn while friends do too.</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">Share your link. When your friends go Pro, you earn from every payment they make, renewals included. When they invite their friends, you keep earning on three levels.</p>
            <Link to={cta}><Button variant="hero" size="lg">{user ? "Get my invite link" : `Start ${TRIAL_DAYS}-day free trial`}</Button></Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4 text-center">Three earning levels</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {LEVELS.map((l) => (
              <div key={l.lvl} className="glass-card p-6 text-center">
                <div className="text-xs font-semibold text-muted-foreground mb-1">{l.lvl}</div>
                <div className="text-4xl font-bold font-display text-primary">{l.pct}%</div>
                <div className="text-sm mt-1">{l.who}</div>
                <div className="text-xs text-muted-foreground mt-3">${(PLANS.monthly.price * l.pct / 100).toFixed(2)} per monthly payment · ${(PLANS.yearly.price * l.pct / 100).toFixed(2)} per yearly</div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="text-xl font-bold font-display mb-4">Example</h2>
          <p className="text-sm text-muted-foreground mb-4">You invite 10 friends on yearly Pro. Each invites 5 friends, and each of those invites 2 more.</p>
          <div className="grid sm:grid-cols-4 gap-3 text-sm">
            {[["10 friends × 10%", 10 * 3.9], ["50 people × 2%", 50 * 0.78], ["100 people × 0.5%", 100 * 0.195], ["Total per year", 39 + 39 + 19.5]].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-secondary/40 p-4"><div className="text-muted-foreground text-xs">{k}</div><div className="text-xl font-bold font-display">${Number(v).toFixed(2)}</div></div>
            ))}
          </div>
        </section>

        <section className="grid sm:grid-cols-4 gap-4">
          {[
            [Users, "Share your link", "From the Refer & Earn tab in your dashboard."],
            [Percent, "Earn on 3 levels", "10%, 2% and 0.5% of every payment."],
            [Repeat, "Renewals count", "Auto-renew payments earn you money every time."],
            [Wallet, "Cash out", "Earnings unlock after 30 days. Minimum $10 to your bank."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="glass-card p-5"><Icon className="w-5 h-5 text-primary mb-2" /><div className="font-semibold text-sm">{t}</div><div className="text-xs text-muted-foreground mt-1">{d}</div></div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display mb-4 text-center">Pro pricing</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {(Object.keys(PLANS) as PlanKey[]).map((k) => (
              <div key={k} className="glass-card p-6">
                <div className="text-sm text-muted-foreground">{PLANS[k].label}</div>
                <div className="text-3xl font-bold font-display">${PLANS[k].price}<span className="text-sm text-muted-foreground">{PLANS[k].per}</span></div>
                <div className="text-xs text-muted-foreground mt-1">{k === "lifetime" ? PLANS[k].note : `${PLANS[k].note} · auto-renews, cancel anytime`}</div>
              </div>
            ))}
          </div>
          <ul className="grid sm:grid-cols-3 gap-2 text-sm mt-6">
            {PRO_FEATURES.map((f) => <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{f}</li>)}
          </ul>
          <div className="text-center mt-8"><Link to={cta}><Button variant="hero" size="lg">{user ? "Open Refer & Earn" : "Join free"}</Button></Link></div>
        </section>
      </main>
    </div>
  );
};

export default Earn;
