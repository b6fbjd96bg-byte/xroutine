ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS is_student boolean NOT NULL DEFAULT false;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS plan text;

CREATE TABLE public.student_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  school text NOT NULL,
  student_id text,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT, INSERT ON public.student_requests TO authenticated;
GRANT ALL ON public.student_requests TO service_role;
ALTER TABLE public.student_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own student request" ON public.student_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own pending student request" ON public.student_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending' AND admin_note IS NULL AND processed_at IS NULL AND length(school) BETWEEN 2 AND 150);

CREATE OR REPLACE FUNCTION public.lifetime_spots_left()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT GREATEST(0, 100 - (SELECT count(*)::int FROM payments WHERE plan = 'Pro lifetime'));
$$;
GRANT EXECUTE ON FUNCTION public.lifetime_spots_left() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.request_payout(_amount numeric, _holder text, _account text, _ifsc text)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _available numeric;
BEGIN
  IF auth.uid() IS NULL THEN RETURN 'not_signed_in'; END IF;
  IF _amount IS NULL OR _amount < 10 THEN RETURN 'min_10'; END IF;
  IF length(trim(_holder)) < 2 OR _account !~ '^[0-9]{6,20}$' OR upper(_ifsc) !~ '^[A-Z]{4}0[A-Z0-9]{6}$' THEN RETURN 'invalid_bank'; END IF;
  SELECT COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND available_at <= now()), 0)
       - COALESCE((SELECT sum(amount) FROM payout_requests WHERE user_id = auth.uid() AND status IN ('pending','paid')), 0)
    INTO _available;
  IF _amount > _available THEN RETURN 'insufficient'; END IF;
  INSERT INTO public.payout_requests (user_id, amount, account_holder, account_number, ifsc)
  VALUES (auth.uid(), _amount, trim(_holder), _account, upper(_ifsc));
  RETURN 'ok';
END; $function$;