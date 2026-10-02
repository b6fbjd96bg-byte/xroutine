import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Gift, Users, Wallet, Lock, Share2, HeartHandshake, Landmark } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Wallet = { total_earned: number; unlocked: number; locked: number; withdrawn: number; invited: number; paying_friends: number };
const inr = (n: number) => `$${Number(n || 0).toFixed(2)}`;

const errors: Record<string, string> = {
  min_10: "Minimum payout is $10.",
  invalid_bank: "Check the account holder name, account number (digits only) and IFSC code.",
  insufficient: "You don't have that much unlocked balance yet.",
};

const ReferEarn = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [form, setForm] = useState({ amount: "", holder: "", account: "", ifsc: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: p }, { data: w }, { data: po }] = await Promise.all([
      supabase.from("profiles").select("referral_code").eq("id", user.id).maybeSingle(),
      supabase.rpc("get_referral_wallet"),
      supabase.from("payout_requests").select("*").order("created_at", { ascending: false }),
    ]);
    setCode((p as any)?.referral_code || "");
    setWallet(w as unknown as Wallet);
    setPayouts(po || []);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const link = code ? `${window.location.origin}/signup?ref=${code}` : "";
  const message = `Let's build better habits together! 🌱 Join me on Superoutine — we can keep each other on track every day. ${link}`;
  const available = Math.max(0, (wallet?.unlocked || 0) - (wallet?.withdrawn || 0));

  const copy = async (t: string) => { await navigator.clipboard.writeText(t); toast.success("Copied!"); };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: "Join me on Superoutine", text: message, url: link }); } catch { /* cancelled */ } }
    else copy(message);
  };

  const requestPayout = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("request_payout", { _amount: Number(form.amount), _holder: form.holder, _account: form.account.trim(), _ifsc: form.ifsc.trim() });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (data !== "ok") return toast.error(errors[data as string] || "Couldn't request payout");
    toast.success("Payout requested! We'll send it to your bank soon.");
    setForm({ amount: "", holder: "", account: "", ifsc: "" });
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-20 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"><HeartHandshake className="w-4 h-4" /> Grow together</div>
              <h1 className="text-3xl sm:text-5xl font-bold font-display mb-3">Bring your partner or friend.<br /><span className="text-gradient">Build habits side by side.</span></h1>
              <p className="text-muted-foreground max-w-xl mb-6">People who track habits with a friend stick with them longer. Invite someone you care about, and earn <b className="text-foreground">10% of every payment</b> they make on Pro, every month.</p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <Input readOnly value={link || "Loading your link…"} className="bg-secondary/50 font-mono text-sm" />
                <Button onClick={() => copy(link)} disabled={!link}><Copy className="w-4 h-4 mr-1" />Copy link</Button>
                <Button variant="secondary" onClick={share} disabled={!link}><Share2 className="w-4 h-4 mr-1" />Share</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-sm">
                <a className="underline text-primary" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Send on WhatsApp</a>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Your code: <b className="text-foreground font-mono">{code}</b></span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Friends joined", value: wallet?.invited ?? 0 },
              { icon: Gift, label: "Friends on Pro", value: wallet?.paying_friends ?? 0 },
              { icon: Lock, label: "Unlocking (30 days)", value: inr(wallet?.locked || 0) },
              { icon: Wallet, label: "Ready to cash out", value: inr(available) },
            ].map(s => (
              <div key={s.label} className="glass-card p-4">
                <s.icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-2xl font-bold font-display">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg mb-4">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[["1", "Share your link", "Send it to your partner, friend or gym buddy."], ["2", "They join & go Pro", "You both keep each other accountable."], ["3", "You earn 10%", "Of every payment they make. Cash out after 30 days (min $10)."]].map(([n, t, d]) => (
                <div key={n} className="flex gap-3"><div className="w-8 h-8 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{n}</div><div><div className="font-semibold">{t}</div><div className="text-muted-foreground">{d}</div></div></div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-3">
              <h2 className="font-display font-bold text-lg flex items-center gap-2"><Landmark className="w-5 h-5 text-primary" />Cash out to your bank</h2>
              <p className="text-xs text-muted-foreground">Available: <b className="text-foreground">{inr(available)}</b> · Minimum $10</p>
              <Input placeholder="Amount ($)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              <Input placeholder="Account holder name" value={form.holder} onChange={e => setForm({ ...form, holder: e.target.value })} />
              <Input placeholder="Account number" value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} />
              <Input placeholder="IFSC code" value={form.ifsc} onChange={e => setForm({ ...form, ifsc: e.target.value.toUpperCase() })} />
              <Button className="w-full" onClick={requestPayout} disabled={busy || available < 10}>{available < 10 ? "Reach $10 to cash out" : "Request payout"}</Button>
            </div>
            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg mb-3">Payout history</h2>
              {payouts.length === 0 ? <p className="text-sm text-muted-foreground">No payouts yet. Your first one is a few friends away.</p> : (
                <div className="space-y-2">
                  {payouts.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm border-b border-border/40 pb-2">
                      <div><div className="font-semibold">{inr(p.amount)}</div><div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()} · A/C ••{String(p.account_number).slice(-4)}</div></div>
                      <span className={`text-xs px-2 py-1 rounded-full ${p.status === "paid" ? "bg-primary/15 text-primary" : p.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReferEarn;
