
-- Create user_subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert own subscription (for trigger)
CREATE POLICY "Users can insert own subscription"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role insert policy for trigger
CREATE POLICY "Service role can insert subscriptions"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (true);

-- Update handle_new_user to also create subscription row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'));
  
  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id);

  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_subscriptions (user_id, tier)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$;

-- Backfill existing users
INSERT INTO public.user_subscriptions (user_id, tier)
SELECT id, 'free' FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_subscriptions)
ON CONFLICT (user_id) DO NOTHING;

-- Timestamp trigger
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
