import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      setBusy(false);
      toast.error("Wrong admin email or password");
      return;
    }
    const { data: role } = await supabase
      .from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    if (!role) {
      await supabase.auth.signOut();
      setBusy(false);
      toast.error("This account is not an admin");
      return;
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <form onSubmit={submit} className="glass-card w-full max-w-sm p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">Admin sign in</h1>
            <p className="text-xs text-muted-foreground">Restricted area</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-pass">Password</Label>
          <div className="relative">
            <Input id="admin-pass" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" required />
            <button type="button" onClick={() => setShow(!show)} aria-label="Show password" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign in to admin"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
