import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { finishGoogleSignIn } from "@/lib/googleAuth";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const q = new URLSearchParams(window.location.search);
    const code = q.get("code");
    if (q.get("error") || !code) {
      setError(q.get("error") === "access_denied" ? "Google sign-in was cancelled." : "Google sign-in failed. Please try again.");
      return;
    }
    finishGoogleSignIn(code, q.get("state"))
      .then(() => navigate("/dashboard", { replace: true }))
      .catch((e) => setError(e instanceof Error ? e.message : "Google sign-in failed"));
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
        {error ? (
          <>
            <p className="font-semibold">{error}</p>
            <Button asChild className="w-full"><Link to="/login">Back to sign in</Link></Button>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Signing you in with Google…</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
