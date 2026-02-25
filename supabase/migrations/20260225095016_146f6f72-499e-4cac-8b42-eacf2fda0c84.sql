
CREATE TABLE public.premium_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.premium_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own waitlist entry" ON public.premium_waitlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own waitlist entry" ON public.premium_waitlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own waitlist entry" ON public.premium_waitlist
  FOR DELETE USING (auth.uid() = user_id);
