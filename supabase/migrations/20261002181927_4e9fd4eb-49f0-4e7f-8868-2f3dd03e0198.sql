ALTER TABLE public.referral_earnings ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS razorpay_subscription_id text, ADD COLUMN IF NOT EXISTS auto_renew boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.create_referral_earning()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE _l1 uuid; _l2 uuid; _l3 uuid;
BEGIN
  SELECT referrer_id INTO _l1 FROM referrals WHERE referred_id = NEW.user_id;
  IF _l1 IS NULL THEN RETURN NEW; END IF;
  INSERT INTO referral_earnings (referrer_id, referred_id, payment_id, amount, level) VALUES (_l1, NEW.user_id, NEW.id, round(NEW.amount * 0.10, 2), 1);
  SELECT referrer_id INTO _l2 FROM referrals WHERE referred_id = _l1;
  IF _l2 IS NULL OR _l2 = NEW.user_id THEN RETURN NEW; END IF;
  INSERT INTO referral_earnings (referrer_id, referred_id, payment_id, amount, level) VALUES (_l2, NEW.user_id, NEW.id, round(NEW.amount * 0.02, 2), 2);
  SELECT referrer_id INTO _l3 FROM referrals WHERE referred_id = _l2;
  IF _l3 IS NULL OR _l3 IN (NEW.user_id, _l1) THEN RETURN NEW; END IF;
  INSERT INTO referral_earnings (referrer_id, referred_id, payment_id, amount, level) VALUES (_l3, NEW.user_id, NEW.id, round(NEW.amount * 0.005, 2), 3);
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.get_referral_wallet()
 RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT json_build_object(
    'total_earned', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid()), 0),
    'unlocked', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND available_at <= now()), 0),
    'locked', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND available_at > now()), 0),
    'withdrawn', COALESCE((SELECT sum(amount) FROM payout_requests WHERE user_id = auth.uid() AND status IN ('pending','paid')), 0),
    'invited', (SELECT count(*) FROM referrals WHERE referrer_id = auth.uid()),
    'paying_friends', (SELECT count(DISTINCT referred_id) FROM referral_earnings WHERE referrer_id = auth.uid() AND level = 1),
    'level2_people', (SELECT count(*) FROM referrals r2 JOIN referrals r1 ON r2.referrer_id = r1.referred_id WHERE r1.referrer_id = auth.uid()),
    'level3_people', (SELECT count(*) FROM referrals r3 JOIN referrals r2 ON r3.referrer_id = r2.referred_id JOIN referrals r1 ON r2.referrer_id = r1.referred_id WHERE r1.referrer_id = auth.uid()),
    'earned_l1', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND level = 1), 0),
    'earned_l2', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND level = 2), 0),
    'earned_l3', COALESCE((SELECT sum(amount) FROM referral_earnings WHERE referrer_id = auth.uid() AND level = 3), 0)
  );
$$;