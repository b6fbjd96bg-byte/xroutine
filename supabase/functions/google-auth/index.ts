// Google sign-in using the admin's own Google Client ID + Secret (saved in the admin panel).
// Users stay on the site's own domain: Google -> <origin>/auth/google -> this function -> session.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const admin = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function getKeys() {
  const { data } = await admin().from("app_settings").select("key,value").in("key", ["google_client_id", "google_client_secret"]);
  const m = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
  return {
    clientId: (m.google_client_id || Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "").trim(),
    clientSecret: (m.google_client_secret || Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "").trim(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = new URL(req.url).searchParams.get("action") || body.action;

    if (action === "config") {
      const { clientId, clientSecret } = await getKeys();
      return json({ clientId: clientId && clientSecret ? clientId : null });
    }

    if (action === "exchange") {
      const { code, redirect_uri } = body as { code?: string; redirect_uri?: string };
      if (!code || !redirect_uri || !/^https?:\/\/[^/]+\/auth\/google$/.test(redirect_uri)) return json({ error: "Bad request" }, 400);
      const { clientId, clientSecret } = await getKeys();
      if (!clientId || !clientSecret) return json({ error: "Google sign-in is not set up yet" }, 400);

      const tokRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri, grant_type: "authorization_code" }),
      });
      const tok = await tokRes.json();
      if (!tokRes.ok || !tok.access_token) return json({ error: `Google rejected the sign-in: ${tok.error_description || tok.error || "unknown"}` }, 400);

      const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tok.access_token}` } });
      const info = await infoRes.json();
      const email = String(info.email || "").toLowerCase();
      if (!infoRes.ok || !email || info.email_verified !== true) return json({ error: "Your Google email isn't verified" }, 400);

      const sb = admin();
      const name = info.name || info.given_name || email.split("@")[0];
      const { error: cErr } = await sb.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { display_name: name, full_name: name, avatar_url: info.picture, provider: "google" },
      });
      if (cErr && !/already|exists|registered/i.test(cErr.message)) throw cErr;

      const { data: link, error: lErr } = await sb.auth.admin.generateLink({ type: "magiclink", email });
      if (lErr || !link?.properties?.hashed_token) throw lErr || new Error("Could not create session");
      return json({ token_hash: link.properties.hashed_token, is_new: !cErr });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("google-auth error", e);
    return json({ error: e instanceof Error ? e.message : "Server error" }, 500);
  }
});
