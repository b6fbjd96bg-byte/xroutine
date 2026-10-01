ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS premium_until timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS razorpay_order_id text, ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_payment_id_key ON public.payments(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;