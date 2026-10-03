import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const call = async (action: string, body?: unknown) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=${action}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await res.json();
  if (j.error) throw new Error(j.error);
  return j;
};

const ORIGINS = ["https://superoutine.in", "https://www.superoutine.in", "https://routine-bloom-web.lovable.app"];

const CopyRow = ({ v }: { v: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
    <code className="text-xs flex-1 break-all">{v}</code>
    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => { navigator.clipboard.writeText(v); toast.success("Copied"); }}>
      <Copy className="w-3.5 h-3.5" />
    </Button>
  </div>
);

const AdminGoogle = () => {
  const [clientId, setClientId] = useState("");
  const [secret, setSecret] = useState("");
  const [saved, setSaved] = useState<{ secretSaved: boolean; secretHint: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => call("google-config").then((j) => { setClientId(j.clientId); setSaved(j); }).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, []);

  const save = async () => {
    setBusy(true);
    try {
      await call("save-google-config", { clientId, clientSecret: secret });
      setSecret("");
      toast.success("Google keys saved. Google sign-in now uses them.");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const origins = Array.from(new Set([...ORIGINS, window.location.origin]));

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-primary" />Google sign-in keys</CardTitle>
          <p className="text-sm text-muted-foreground">Everyone who signs up or signs in with Google uses these keys. People stay on your own website the whole time.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="gid">Client ID</Label>
            <Input id="gid" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="1234567890-abc.apps.googleusercontent.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gsec">Client Secret</Label>
            <Input id="gsec" type="password" autoComplete="off" value={secret} onChange={(e) => setSecret(e.target.value)}
              placeholder={saved?.secretSaved ? `Saved (${saved.secretHint}) — leave empty to keep it` : "GOCSPX-..."} />
          </div>
          {saved?.secretSaved && clientId && (
            <p className="text-sm text-primary flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />Google sign-in is switched on with your keys.</p>
          )}
          <Button onClick={save} disabled={busy || !clientId || (!secret && !saved?.secretSaved)}>{busy ? "Saving..." : "Save keys"}</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Paste these into Google Cloud → Credentials → your OAuth client</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Authorised JavaScript origins</p>
            {origins.map((o) => <CopyRow key={o} v={o} />)}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Authorised redirect URIs</p>
            {origins.map((o) => <CopyRow key={o} v={`${o}/auth/google`} />)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGoogle;
