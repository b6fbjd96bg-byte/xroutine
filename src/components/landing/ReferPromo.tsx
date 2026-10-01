import { Link } from "react-router-dom";
import { HeartHandshake, Gift, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReferPromo = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto glass-card p-8 sm:p-12 relative overflow-hidden text-center">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"><HeartHandshake className="w-4 h-4" />Refer & Earn</div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display mb-4">Better habits are <span className="text-gradient">better together</span></h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">Bring your partner, best friend or gym buddy. Keep each other on track, and earn 10% of every Pro payment they make.</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8 text-sm">
          {[[HeartHandshake, "Invite someone you care about"], [Gift, "They go Pro, you earn 10% every month"], [Wallet, "Cash out to your bank from ₹500"]].map(([Icon, t], i) => {
            const I = Icon as typeof Gift;
            return <div key={i} className="flex flex-col items-center gap-2"><I className="w-6 h-6 text-primary" /><span>{t as string}</span></div>;
          })}
        </div>
        <Button size="lg" asChild><Link to="/signup">Start together — it's free</Link></Button>
      </div>
    </div>
  </section>
);

export default ReferPromo;
