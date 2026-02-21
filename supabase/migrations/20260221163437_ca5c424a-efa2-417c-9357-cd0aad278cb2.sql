
-- Create mood check-ins table for daily mood tracking
CREATE TABLE public.mood_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood checkins"
ON public.mood_checkins FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood checkins"
ON public.mood_checkins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood checkins"
ON public.mood_checkins FOR UPDATE
USING (auth.uid() = user_id);
