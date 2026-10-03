import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const isLovableHost = () => {
  const h = window.location.hostname;
  return h.endsWith("lovable.app") || h.endsWith("lovableproject.com") || h === "localhost";
};

const GoogleButton = ({ label = "Continue with Google" }: { label?: string }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const autoRan = useRef(false);

  const go = async () => {
    setLoading(true);
    sessionStorage.setItem("post_auth_redirect", "/dashboard");
    // Own domain (e.g. superoutine.in on Vercel): use your own Google keys so users stay on your domain.
    if (!isLovableHost()) {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
      if (error) {
        setLoading(false);
        sessionStorage.removeItem("post_auth_redirect");
        toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
      }
      return;
    }
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setLoading(false);
      sessionStorage.removeItem("post_auth_redirect");
      toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    sessionStorage.removeItem("post_auth_redirect");
    navigate("/dashboard");
  };

  useEffect(() => {
    if (autoRan.current || !isLovableHost()) return;
    if (new URLSearchParams(window.location.search).get("google") !== "1") return;
    autoRan.current = true;
    go();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button type="button" variant="outline" size="lg" className="w-full gap-3" onClick={go} disabled={loading}>
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
      </svg>
      {loading ? "Connecting..." : label}
    </Button>
  );
};

export const OrDivider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-border" />
    <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
    <div className="flex-1 h-px bg-border" />
  </div>
);

export default GoogleButton;
