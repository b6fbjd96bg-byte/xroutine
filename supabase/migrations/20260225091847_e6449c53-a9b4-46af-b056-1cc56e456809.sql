
-- Daily logins table for login streak tracking
CREATE TABLE public.daily_logins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_count INTEGER NOT NULL DEFAULT 1,
  xp_claimed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, login_date)
);

ALTER TABLE public.daily_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily logins"
ON public.daily_logins FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logins"
ON public.daily_logins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logins"
ON public.daily_logins FOR UPDATE
USING (auth.uid() = user_id);

-- User commitments table
CREATE TABLE public.user_commitments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  commitment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.user_commitments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own commitments"
ON public.user_commitments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own commitments"
ON public.user_commitments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own commitments"
ON public.user_commitments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own commitments"
ON public.user_commitments FOR DELETE
USING (auth.uid() = user_id);
