import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { usd } from "@/lib/plans";

type Pay = { id: string; user_id: string; email: string; amount: number; plan: string; note: string | null; created_at: string; razorpay_payment_id: string | null };

const call = async (action: string) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=${action}`, {
    headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  });
  const j = await res.json();
  if (j.error) throw new Error(j.error);
  return j;
};

const day = (d: Date) => d.toISOString().split("T")[0];

const AdminRevenue = ({ onChanged }: { onChanged: () => void }) => {
  const [pays, setPays] = useState<Pay[]>([]);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    try { setPays((await call("money")).payments); } catch (e: any) { toast.error(e.message); }
  }, []);
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const sync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("razorpay", { body: { action: "admin-sync" } });
    setSyncing(false);
    if (error || data?.error) return toast.error(data?.error || "Sync failed");
    toast.success(data.added ? `${data.added} missed payment(s) found, users promoted to Pro` : `All ${data.checked} Razorpay payments already recorded`);
    load(); onChanged();
  };

  const s = useMemo(() => {
    const now = Date.now(), today = day(new Date());
    const sum = (arr: Pay[]) => arr.reduce((a, p) => a + Number(p.amount), 0);
    const in30 = pays.filter(p => now - new Date(p.created_at).getTime() < 30 * 86400000);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const byDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) byDay[day(new Date(now - i * 86400000))] = 0;
    pays.forEach(p => { const k = day(new Date(p.created_at)); if (k in byDay) byDay[k] += Number(p.amount); });
    const byPlan: Record<string, { n: number; total: number }> = {};
    pays.forEach(p => { byPlan[p.plan] = byPlan[p.plan] || { n: 0, total: 0 }; byPlan[p.plan].n++; byPlan[p.plan].total += Number(p.amount); });
    return {
      all: sum(pays),
      today: sum(pays.filter(p => day(new Date(p.created_at)) === today)),
      month: sum(pays.filter(p => new Date(p.created_at) >= monthStart)),
      last30: sum(in30),
      payers: new Set(pays.map(p => p.user_id)).size,
      avg: pays.length ? sum(pays) / pays.length : 0,
      chart: Object.entries(byDay).map(([date, amount]) => ({ date: date.slice(5), amount: Number(amount.toFixed(2)) })),
      byPlan: Object.entries(byPlan).sort((a, b) => b[1].total - a[1].total),
    };
  }, [pays]);

  const cards: [string, string | number][] = [
    ["Total revenue", usd(s.all)], ["Today", usd(s.today)], ["This month", usd(s.month)],
    ["Last 30 days", usd(s.last30)], ["Paying users", s.payers], ["Avg. payment", usd(s.avg)],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Every Razorpay payment is checked on the server and the buyer is moved to Pro automatically.</p>
        <Button size="sm" onClick={sync} disabled={syncing}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${syncing ? "animate-spin" : ""}`} />{syncing ? "Checking Razorpay…" : "Check Razorpay for missed payments"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(([k, v]) => (
          <Card key={k} className="border-border/50"><CardContent className="p-4">
            <div className="text-2xl font-bold font-display">{v}</div>
            <div className="text-xs text-muted-foreground mt-1">{k}</div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Revenue, last 30 days (USD)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} formatter={(v: number) => usd(v)} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">By plan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {s.byPlan.length === 0 && <p className="text-sm text-muted-foreground">No payments yet.</p>}
            {s.byPlan.map(([plan, v]) => (
              <div key={plan} className="flex items-center justify-between text-sm">
                <span>{plan} <span className="text-muted-foreground">× {v.n}</span></span>
                <span className="font-semibold">{usd(v.total)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">All payments ({pays.length})</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Source</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {pays.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No payments yet.</TableCell></TableRow>}
              {pays.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{p.email}</TableCell>
                  <TableCell className="text-sm">{p.plan}</TableCell>
                  <TableCell className="font-semibold">{usd(p.amount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.razorpay_payment_id || p.note || "Manual"}</TableCell>
                  <TableCell><Badge variant="outline" className="border-primary/40 text-primary">{p.razorpay_payment_id ? "Verified · Pro" : "Recorded · Pro"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenue;
