CREATE OR REPLACE FUNCTION public.notify_payment()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  -- Monthly/yearly Razorpay payments get a detailed notice (with renewal date) from the payment function
  IF NEW.razorpay_payment_id IS NOT NULL AND NEW.plan IN ('Pro monthly','Pro yearly') THEN RETURN NEW; END IF;
  INSERT INTO notifications (user_id, kind, title, body, link)
  VALUES (NEW.user_id, 'payment', 'Pro is active', NEW.plan || ' payment of $' || NEW.amount || ' received. Thank you!', '/dashboard/settings');
  RETURN NEW;
END; $function$;