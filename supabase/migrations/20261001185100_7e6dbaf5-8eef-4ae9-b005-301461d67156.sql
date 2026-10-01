-- Referral codes on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
UPDATE public.profiles SET referral_code = upper(substr(md5(id::text || random()::text), 1, 8)) WHERE referral_code IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, referral_code)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'), upper(substr(md5(NEW.id::text || random()::text), 1, 8)));
  INSERT INTO public.user_gamification (user_id) VALUES (NEW.id);
  INSERT INTO public.email_preferences (user_id) VALUES (NEW.id);
  INSERT INTO public.user_subscriptions (user_id, tier) VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$function$;

-- Referrals
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Payments (recorded by admin for now)
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  plan text NOT NULL DEFAULT 'premium',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Referral earnings
CREATE TABLE public.referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL,
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  available_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.referral_earnings TO authenticated;
GRANT ALL ON public.referral_earnings TO service_role;
ALTER TABLE public.referral_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own earnings" ON public.referral_earnings FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

-- Payout requests
CREATE TABLE public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric(10,2) NOT NULL,
  account_holder text NOT NULL,
  account_number text NOT NULL,
  ifsc text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT ON public.payout_requests TO authenticated;
GRANT ALL ON public.payout_requests TO service_role;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payouts" ON public.payout_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Commission trigger: 10% of every payment to the referrer
CREATE OR REPLACE FUNCTION public.create_referral_earning()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE _ref uuid;
BEGIN
  SELECT referrer_id INTO _ref FROM public.referrals WHERE referred_id = NEW.user_id;
  IF _ref IS NOT NULL THEN
    INSERT INTO public.referral_earnings (referrer_id, referred_id, payment_id, amount)
    VALUES (_ref, NEW.user_id, NEW.id, round(NEW.amount * 0.10, 2));
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_payment_created AFTER INSERT ON public.payments FOR EACH ROW EXECUTE FUNCTION public.create_referral_earning();

-- Claim a referral code (new accounts only)
CREATE OR REPLACE FUNCTION public.claim_referral(_code text)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE _referrer uuid; _created timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RETURN 'not_signed_in'; END IF;
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = auth.uid()) THEN RETURN 'already_claimed'; END IF;
  SELECT created_at INTO _created FROM auth.users WHERE id = auth.uid();
  IF _created < now() - interval '7 days' THEN RETURN 'too_old'; END IF;
  SELECT id INTO _referrer FROM public.profiles WHERE referral_code = upper(trim(_code));
  IF _referrer IS NULL THEN RETURN 'invalid_code'; END IF;
  IF _referrer = auth.uid() THEN RETURN 'self'; END IF;
  INSERT INTO public.referrals (referrer_id, referred_id) VALUES (_referrer, auth.uid());
  RETURN 'ok';
END; $$;

-- Wallet summary
CREATE OR REPLACE FUNCTION public.get_referral_wallet()
 RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT json_build_object(
    'total_earned', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid()), 0),
    'unlocked', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND available_at <= now()), 0),
    'locked', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND available_at > now()), 0),
    'withdrawn', COALESCE((SELECT sum(amount) FROM payout_requests WHERE user_id = auth.uid() AND status IN ('pending','paid')), 0),
    'invited', (SELECT count(*) FROM referrals WHERE referrer_id = auth.uid()),
    'paying_friends', (SELECT count(DISTINCT referred_id) FROM referral_earnings WHERE referrer_id = auth.uid())
  );
$$;

CREATE OR REPLACE FUNCTION public.request_payout(_amount numeric, _holder text, _account text, _ifsc text)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE _available numeric;
BEGIN
  IF auth.uid() IS NULL THEN RETURN 'not_signed_in'; END IF;
  IF _amount IS NULL OR _amount < 500 THEN RETURN 'min_500'; END IF;
  IF length(trim(_holder)) < 2 OR _account !~ '^[0-9]{6,20}$' OR upper(_ifsc) !~ '^[A-Z]{4}0[A-Z0-9]{6}$' THEN RETURN 'invalid_bank'; END IF;
  SELECT COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND available_at <= now()), 0)
       - COALESCE((SELECT sum(amount) FROM payout_requests WHERE user_id = auth.uid() AND status IN ('pending','paid')), 0)
    INTO _available;
  IF _amount > _available THEN RETURN 'insufficient'; END IF;
  INSERT INTO public.payout_requests (user_id, amount, account_holder, account_number, ifsc)
  VALUES (auth.uid(), _amount, trim(_holder), _account, upper(_ifsc));
  RETURN 'ok';
END; $$;

REVOKE EXECUTE ON FUNCTION public.claim_referral(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_referral_wallet() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.request_payout(numeric, text, text, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_referral_earning() FROM anon, public, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_referral(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_wallet() TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_payout(numeric, text, text, text) TO authenticated;