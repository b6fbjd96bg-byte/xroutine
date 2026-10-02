import { Link } from "react-router-dom";
import { Bell, CheckCheck, Crown, Gift, Users, Megaphone } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const ICON: Record<string, any> = { payment: Crown, earning: Gift, referral: Users, info: Megaphone };
const ago = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Notifications = () => {
  const { items, unread, markRead } = useNotifications();
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 pt-20 md:pt-10 sm:p-6 lg:p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">Notifications</h1>
              <p className="text-sm text-muted-foreground">{unread ? `${unread} unread` : "You're all caught up."}</p>
            </div>
            {unread > 0 && <Button size="sm" variant="secondary" onClick={() => markRead(items.filter((x) => !x.read).map((x) => x.id))}><CheckCheck className="w-4 h-4 mr-1" />Mark all read</Button>}
          </div>
          {items.length === 0 ? (
            <div className="glass-card p-10 text-center text-muted-foreground"><Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />No notifications yet.</div>
          ) : (
            <div className="space-y-2">
              {items.map((n) => {
                const I = ICON[n.kind] || Megaphone;
                const inner = (
                  <div className={cn("glass-card p-4 flex gap-3 items-start transition-colors", !n.read && "border-primary/40")}>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><I className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="font-semibold text-sm">{n.title}</span>{!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}</div>
                      {n.body && <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap">{n.body}</p>}
                      <div className="text-xs text-muted-foreground mt-1">{ago(n.created_at)}{n.user_id === null && " · From Superoutine"}</div>
                    </div>
                  </div>
                );
                return n.link?.startsWith("/") ? (
                  <Link key={n.id} to={n.link} onClick={() => markRead([n.id])} className="block">{inner}</Link>
                ) : (
                  <div key={n.id} onClick={() => !n.read && markRead([n.id])} className="cursor-default">{inner}</div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
