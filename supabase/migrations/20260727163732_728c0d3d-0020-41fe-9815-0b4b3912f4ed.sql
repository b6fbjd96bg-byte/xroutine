DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;

CREATE POLICY "Anon can insert anonymous page views"
ON public.page_views
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

CREATE POLICY "Authenticated can insert own page views"
ON public.page_views
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());