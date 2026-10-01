import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const KEY = "superoutine_ref";

/** Remembers ?ref=CODE from any link, then links the friend to the inviter once signed in. */
const ReferralCapture = () => {
  const { search } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const ref = new URLSearchParams(search).get("ref");
    if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) localStorage.setItem(KEY, ref.toUpperCase());
  }, [search]);

  useEffect(() => {
    const code = localStorage.getItem(KEY);
    if (!user || !code) return;
    supabase.rpc("claim_referral", { _code: code }).then(({ data }) => {
      localStorage.removeItem(KEY);
      if (data === "ok") toast.success("You joined with a friend's invite — grow together! 🌱");
    });
  }, [user]);

  return null;
};

export default ReferralCapture;
