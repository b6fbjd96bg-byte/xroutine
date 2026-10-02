-- Routines
CREATE TABLE public.routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  time_of_day text NOT NULL DEFAULT 'morning',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routines TO authenticated;
GRANT ALL ON public.routines TO service_role;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own routines" ON public.routines FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON public.routines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.routine_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  routine_id uuid NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  done_steps text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (routine_id, date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routine_checks TO authenticated;
GRANT ALL ON public.routine_checks TO service_role;
ALTER TABLE public.routine_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own routine checks" ON public.routine_checks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Articles (admin writes, signed-in users read published)
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) BETWEEN 2 AND 160),
  summary text,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'Habits',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read published articles" ON public.articles FOR SELECT TO authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update articles" ON public.articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete articles" ON public.articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AI daily lessons (written by server only)
CREATE TABLE public.daily_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);
GRANT SELECT ON public.daily_lessons TO authenticated;
GRANT ALL ON public.daily_lessons TO service_role;
ALTER TABLE public.daily_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own lessons" ON public.daily_lessons FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Notifications: user_id NULL = message to everyone
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  kind text NOT NULL DEFAULT 'info',
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
  body text,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own and broadcast" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Admins send" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete" ON public.notifications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);

CREATE TABLE public.notification_reads (
  user_id uuid NOT NULL,
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, notification_id)
);
GRANT SELECT, INSERT, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own reads" ON public.notification_reads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Automatic notifications
CREATE OR REPLACE FUNCTION public.notify_payment() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO notifications (user_id, kind, title, body, link)
  VALUES (NEW.user_id, 'payment', 'Pro is active', NEW.plan || ' payment of $' || NEW.amount || ' received. Thank you!', '/dashboard/settings');
  RETURN NEW;
END; $$;
CREATE TRIGGER on_payment_notify AFTER INSERT ON public.payments FOR EACH ROW EXECUTE FUNCTION public.notify_payment();

CREATE OR REPLACE FUNCTION public.notify_earning() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO notifications (user_id, kind, title, body, link)
  VALUES (NEW.referrer_id, 'earning', 'You earned $' || NEW.amount, 'A level ' || NEW.level || ' friend went Pro. It unlocks in 30 days.', '/dashboard/refer');
  RETURN NEW;
END; $$;
CREATE TRIGGER on_earning_notify AFTER INSERT ON public.referral_earnings FOR EACH ROW EXECUTE FUNCTION public.notify_earning();

CREATE OR REPLACE FUNCTION public.notify_referral() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO notifications (user_id, kind, title, body, link)
  VALUES (NEW.referrer_id, 'referral', 'A friend joined with your link', 'You''ll earn 10% when they go Pro.', '/dashboard/refer');
  RETURN NEW;
END; $$;
CREATE TRIGGER on_referral_notify AFTER INSERT ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.notify_referral();

REVOKE EXECUTE ON FUNCTION public.notify_payment(), public.notify_earning(), public.notify_referral() FROM PUBLIC, anon, authenticated;