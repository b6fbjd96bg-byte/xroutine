import { supabase } from "@/integrations/supabase/client";

const FN = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-auth`;
const headers = { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY };
const STATE_KEY = "google_oauth_state";

export const googleRedirectUri = () => `${window.location.origin}/auth/google`;

/** Returns the admin-saved Google Client ID, or null if Google keys aren't set up. */
export async function getGoogleClientId(): Promise<string | null> {
  try {
    const r = await fetch(`${FN}?action=config`, { headers });
    const j = await r.json();
    return j.clientId || null;
  } catch {
    return null;
  }
}

/** Sends the browser to Google's account picker using the admin's own keys. */
export function startGoogleSignIn(clientId: string) {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);
  const p = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${p}`);
}

/** Finishes sign-in on /auth/google: swaps Google's code for a session on this site. */
export async function finishGoogleSignIn(code: string, state: string | null) {
  const expected = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  if (!expected || expected !== state) throw new Error("Sign-in expired. Please try again.");
  const r = await fetch(FN, { method: "POST", headers, body: JSON.stringify({ action: "exchange", code, redirect_uri: googleRedirectUri() }) });
  const j = await r.json();
  if (!r.ok || !j.token_hash) throw new Error(j.error || "Google sign-in failed");
  const { error } = await supabase.auth.verifyOtp({ token_hash: j.token_hash, type: "magiclink" });
  if (error) throw error;
}
