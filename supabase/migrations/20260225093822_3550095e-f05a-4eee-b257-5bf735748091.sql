
-- Remove the user-level insert policy since the trigger runs as SECURITY DEFINER
-- and the service-role policy covers it. Users don't insert their own subscription rows.
DROP POLICY "Users can insert own subscription" ON public.user_subscriptions;
