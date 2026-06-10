
-- Fix user_subscriptions overly permissive INSERT/UPDATE policies
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
-- Note: inserts happen via handle_new_user() SECURITY DEFINER trigger and via service_role in admin-api.
-- No client-side INSERT/UPDATE policies needed.

-- Restrict has_role execution: only authenticated and service_role need it (for RLS evaluation it runs as definer regardless, but revoke from anon/public anyway)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Same for handle_new_user / assign_admin_on_signup / update_updated_at_column (trigger-only, no client need)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_admin_on_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
