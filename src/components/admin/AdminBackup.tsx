import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, DatabaseBackup, Check } from "lucide-react";
import { toast } from "sonner";

type Summary = { users: number; tables: { name: string; rows: number }[]; at: string };

const AdminBackup = () => {
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  const run = async () => {
    setBusy(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=export-all`, {
        headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      const blob = new Blob([JSON.stringify(j, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `superoutine-backup-${j.exported_at.slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      setSummary({
        users: j.auth_users.length,
        at: new Date(j.exported_at).toLocaleString(),
        tables: Object.entries(j.tables as Record<string, unknown[]>).map(([name, rows]) => ({ name, rows: rows.length })),
      });
      toast.success("Backup downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Backup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DatabaseBackup className="w-5 h-5 text-primary" />Full data backup</CardTitle>
          <p className="text-sm text-muted-foreground">One click downloads every user, habit, task, payment, referral, payout and message as one file. Use it to move to a new server or keep a safe copy.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={run} disabled={busy} className="gap-2">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {busy ? "Preparing backup..." : "Download full backup"}
          </Button>
          {summary && (
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-2 text-sm">
              <p className="flex items-center gap-1.5 font-medium text-primary"><Check className="w-4 h-4" />Backup from {summary.at} — {summary.users} accounts</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {summary.tables.map((t) => <span key={t.name}>{t.name.replace(/_/g, " ")}: <b className="text-foreground">{t.rows}</b></span>)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Moving to a new server</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Download the backup here.</p>
          <p>2. Give the file to your developer. Every section of the file loads into the matching table on the new database.</p>
          <p>3. Passwords and secret keys are never included, for safety. On the new server, users sign in with Google or use Forgot password once.</p>
          <p>4. Set up your Razorpay and Google keys again on the new server.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackup;
