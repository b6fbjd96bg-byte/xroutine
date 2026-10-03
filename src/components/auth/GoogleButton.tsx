import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getGoogleClientId, startGoogleSignIn } from "@/lib/googleAuth";

/** Google sign-in with the admin's own Google keys — users never leave this site's domain. */
const GoogleButton = ({ label = "Continue with Google" }: { label?: string }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const go = async () => {
    setLoading(true);
    const clientId = await getGoogleClientId();
    if (!clientId) {
      setLoading(false);
      toast({ title: "Google sign-in isn't ready", description: "Please use email for now.", variant: "destructive" });
      return;
    }
    startGoogleSignIn(clientId);
  };

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
