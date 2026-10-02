import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, Crown, DollarSign, FileText, CreditCard, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { usd } from "@/lib/plans";

type U = { id: string; email: string; display_name: string; created_at: string; tier: string };
type Traffic = { viewsByDay: { date: string; views: number; unique: number }[]; topPages: { path: string; views: number }[]; totalViews: number; prevViews: number; sources: { name: string; value: number }[] } | null;
type Pay = { id: string; email: string; amount: number; plan: string; created_at: string };

const DAY = 86400000;
const ago = (s: string) => {
  const m = Math.floor((Date.now() - new Date(s).getTime()) / 60000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  if (m < 1440) return `${Math.floor(m / 60)} hours ago`;
  return `${Math.floor(m / 1440)} days ago`;
};
const initials = (n: string, e: string) => (n && n !== "User" ? n : e).split(/[\s@._]+/).filter(Boolean).slice(0, 2).map(x => x[0]?.toUpperCase()).join("");
const pct = (cur: number, prev: number) => (prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100));
const SRC_COLORS = ["hsl(var(--chart-blue))", "hsl(var(--chart-purple))", "hsl(var(--chart-green))", "hsl(var(--chart-yellow))"];

const Spark = ({ data, color, id }: { data: number[]; color: string; id: string }) => (
  <div className="w-28 h-14">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.map((v, i) => ({ i, v }))}>
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.5} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const Panel = ({ title, icon: Icon, action, children, className = "" }: any) => (
  <div className={`rounded-2xl border border-border/60 bg-card/60 p-5 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="flex items-center gap-2.5 font-semibold font-display">{Icon && <Icon className="w-5 h-5 text-primary" />}{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const AdminOverview = ({ users, traffic, onGo }: { users: U[]; traffic: Traffic; onGo: (tab: "users" | "revenue" | "traffic") => void }) => {
  const [pays, setPays] = useState<Pay[]>([]);
  useEffect(() => {
    const load = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=money`, { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
      const j = await r.json();
      if (!j.error) setPays(j.payments || []);
    };
    load(); const t = setInterval(load, 30000); return () => clearInterval(t);
  }, []);

  const d = useMemo(() => {
    const now = Date.now();
    const days = Array.from({ length: 30 }, (_, i) => new Date(now - (29 - i) * DAY).toISOString().split("T")[0]);
    const inRange = (s: string, from: number, to: number) => { const t = new Date(s).getTime(); return t >= now - from * DAY && t < now - to * DAY; };
    const signups = days.map(day => users.filter(u => u.created_at.startsWith(day)).length);
    const revDay = days.map(day => pays.filter(p => p.created_at.startsWith(day)).reduce((a, p) => a + Number(p.amount), 0));
    const viewsMap = Object.fromEntries((traffic?.viewsByDay || []).map(v => [v.date, v]));
    const chart = days.map((day, i) => ({ date: new Date(day).toLocaleDateString("en", { month: "short", day: "2-digit" }), views: viewsMap[day]?.views || 0, unique: viewsMap[day]?.unique || 0, signups: signups[i] }));
    const u30 = users.filter(u => inRange(u.created_at, 30, 0)).length, u60 = users.filter(u => inRange(u.created_at, 60, 30)).length;
    const r30 = pays.filter(p => inRange(p.created_at, 30, 0)).reduce((a, p) => a + Number(p.amount), 0);
    const r60 = pays.filter(p => inRange(p.created_at, 60, 30)).reduce((a, p) => a + Number(p.amount), 0);
    let cum = users.length - signups.reduce((a, b) => a + b, 0);
    const userCum = signups.map(s => (cum += s));
    return {
      chart, userCum, revDay,
      usersPct: pct(u30, u60), revPct: pct(r30, r60),
      viewsPct: pct(traffic?.totalViews || 0, traffic?.prevViews || 0),
      subs: users.filter(u => u.tier === "premium").length,
      revenue: pays.reduce((a, p) => a + Number(p.amount), 0),
    };
  }, [users, pays, traffic]);

  const totalSrc = (traffic?.sources || []).reduce((a, s) => a + s.value, 0);
  const cards = [
    { t: "Total Users", v: users.length.toLocaleString(), p: d.usersPct, icon: Users, c: "hsl(var(--chart-blue))", bg: "bg-chart-blue/15 text-chart-blue", s: d.userCum },
    { t: "Page Views", v: (traffic?.totalViews || 0).toLocaleString(), p: d.viewsPct, icon: Eye, c: "hsl(var(--chart-purple))", bg: "bg-chart-purple/15 text-chart-purple", s: d.chart.map(x => x.views) },
    { t: "Active Subscribers", v: d.subs.toLocaleString(), p: null, sub: `of ${users.length} users`, icon: Crown, c: "hsl(var(--chart-yellow))", bg: "bg-chart-yellow/15 text-chart-yellow", s: d.userCum.map(() => d.subs) },
    { t: "Total Revenue", v: usd(d.revenue), p: d.revPct, icon: DollarSign, c: "hsl(var(--chart-green))", bg: "bg-chart-green/15 text-chart-green", s: d.revDay },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={c.t} className="rounded-2xl border border-border/60 bg-card/60 p-5 flex items-end justify-between gap-2 overflow-hidden">
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}><c.icon className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{c.t}</p>
                <p className="text-3xl font-bold font-display mt-1">{c.v}</p>
                {c.p === null ? <p className="text-xs text-muted-foreground mt-2">{c.sub}</p> : (
                  <p className={`text-xs mt-2 flex items-center gap-1 ${c.p >= 0 ? "text-chart-green" : "text-destructive"}`}>
                    {c.p >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}<b>{Math.abs(c.p)}%</b><span className="text-muted-foreground">from last month</span>
                  </p>
                )}
              </div>
            </div>
            <Spark data={c.s} color={c.c} id={`sp${i}`} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Panel title="Page Views — Last 30 Days" icon={Eye} className="lg:col-span-2"
          action={<div className="hidden md:flex gap-4 text-xs text-muted-foreground">{[["Page Views", 0], ["Unique Visitors", 1], ["Sign Ups", 2]].map(([l, i]) => <span key={l} className="flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ background: SRC_COLORS[i as number] }} />{l}</span>)}</div>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.chart}>
                <defs>{["v", "u", "s"].map((k, i) => <linearGradient key={k} id={`g${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SRC_COLORS[i]} stopOpacity={0.45} /><stop offset="100%" stopColor={SRC_COLORS[i]} stopOpacity={0} /></linearGradient>)}</defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={3} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="views" name="Page Views" stroke={SRC_COLORS[0]} strokeWidth={2} fill="url(#gv)" />
                <Area type="monotone" dataKey="unique" name="Unique Visitors" stroke={SRC_COLORS[1]} strokeWidth={2} fill="url(#gu)" />
                <Area type="monotone" dataKey="signups" name="Sign Ups" stroke={SRC_COLORS[2]} strokeWidth={2} fill="url(#gs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Traffic Sources">
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
            <div className="relative w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={totalSrc ? traffic!.sources : [{ name: "none", value: 1 }]} dataKey="value" innerRadius={50} outerRadius={75} stroke="none" paddingAngle={totalSrc ? 2 : 0}>
                    {(totalSrc ? traffic!.sources : [{ name: "none", value: 1 }]).map((_, i) => <Cell key={i} fill={totalSrc ? SRC_COLORS[i] : "hsl(var(--muted))"} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold">{totalSrc}</span><span className="text-xs text-muted-foreground">Views</span></div>
            </div>
            <ul className="space-y-3 text-sm w-full">
              {(traffic?.sources || []).map((s, i) => (
                <li key={s.name} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: SRC_COLORS[i] }} />{s.name}</span>
                  <span className="font-medium">{totalSrc ? Math.round((s.value / totalSrc) * 100) : 0}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Panel title="Top Pages" icon={FileText} action={<button onClick={() => onGo("traffic")} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">View All</button>}>
          <table className="w-full text-sm">
            <thead><tr className="text-muted-foreground text-left bg-secondary/40"><th className="py-2 px-3 rounded-l-lg">#</th><th>Page</th><th className="text-right px-3 rounded-r-lg">Views</th></tr></thead>
            <tbody>
              {(traffic?.topPages || []).slice(0, 5).map((p, i) => (
                <tr key={p.path} className="border-b border-border/40 last:border-0"><td className="py-3 px-3 text-muted-foreground">{i + 1}</td><td className="text-chart-blue truncate max-w-[10rem]">{p.path}</td><td className="text-right px-3">{p.views}</td></tr>
              ))}
              {!traffic?.topPages?.length && <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">No visits yet</td></tr>}
            </tbody>
          </table>
        </Panel>

        <Panel title="Recent Users" icon={Users} action={<button onClick={() => onGo("users")} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">View All</button>}>
          <ul className="divide-y divide-border/40">
            {[...users].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5).map(u => (
              <li key={u.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="w-8 h-8 rounded-full bg-chart-blue/15 text-chart-blue text-xs font-semibold flex items-center justify-center shrink-0">{initials(u.display_name, u.email)}</span>
                <div className="min-w-0 flex-1"><p className="truncate font-medium">{u.display_name}</p><p className="truncate text-xs text-muted-foreground">{u.email}</p></div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{ago(u.created_at)}</span>
              </li>
            ))}
            {!users.length && <li className="py-6 text-center text-muted-foreground text-sm">No users yet</li>}
          </ul>
        </Panel>

        <Panel title="Recent Payments" icon={CreditCard} action={<button onClick={() => onGo("revenue")} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">View All</button>}>
          <ul className="divide-y divide-border/40">
            {pays.slice(0, 5).map(p => (
              <li key={p.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="truncate flex-1">{p.email}</span>
                <span className="text-xs px-2 py-0.5 rounded-md border border-chart-green/40 text-chart-green bg-chart-green/10 whitespace-nowrap">{p.plan.replace("Pro ", "")}</span>
                <span className="font-semibold w-16 text-right">{usd(p.amount)}</span>
                <span className="text-xs text-muted-foreground w-14 text-right">{new Date(p.created_at).toLocaleDateString("en", { month: "short", day: "2-digit" })}</span>
              </li>
            ))}
            {!pays.length && <li className="py-6 text-center text-muted-foreground text-sm">No payments yet</li>}
          </ul>
        </Panel>
      </div>
    </div>
  );
};

export default AdminOverview;
