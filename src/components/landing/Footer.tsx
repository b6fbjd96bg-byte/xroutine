import { Link } from "react-router-dom";

const cols: { title: string; links: [string, string][] }[] = [
  { title: "Product", links: [["/features", "Features"], ["/pricing", "Pricing"], ["/ai-coach", "AI Coach"], ["/faq", "FAQ"], ["/signup", "Start free trial"]] },
  { title: "Use cases", links: [["/use-cases/adhd-routine-app", "ADHD routines"], ["/use-cases/morning-routine-app", "Morning routine"], ["/use-cases/habit-tracker-for-students", "For students"], ["/use-cases/fitness-habit-tracker", "Fitness habits"]] },
  { title: "Compare", links: [["/compare/superoutine-vs-habitica", "vs Habitica"], ["/compare/superoutine-vs-streaks", "vs Streaks"], ["/compare/superoutine-vs-habitify", "vs Habitify"], ["/compare/superoutine-vs-fabulous", "vs Fabulous"], ["/blog", "Blog"]] },
  { title: "Company", links: [["/about", "About"], ["/contact", "Contact"], ["/earn", "Refer & Earn"], ["/privacy", "Privacy Policy"], ["/terms", "Terms"], ["/refunds", "Cancellation & Refunds"], ["/shipping", "Shipping Policy"]] },
];

const Footer = () => (
  <footer className="py-16 px-4 border-t border-border/50">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Superoutine logo" width={32} height={32} loading="lazy" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold font-display">Superoutine</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Superoutine is an AI habit tracker and routine planner with XP, streaks and an AI coach. From $4.99/month after a 15-day free trial.
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="font-display font-semibold mb-4 text-sm">{c.title}</h2>
            <ul className="space-y-2">
              {c.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border/30 pt-8 text-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Superoutine. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
