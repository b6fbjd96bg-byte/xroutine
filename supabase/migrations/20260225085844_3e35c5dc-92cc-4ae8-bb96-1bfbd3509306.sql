
-- Create page_views table for traffic tracking
CREATE TABLE public.page_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    path text NOT NULL,
    referrer text,
    user_agent text,
    user_id uuid,
    session_id text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (tracking doesn't require auth)
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read page views
CREATE POLICY "Admins can view page views"
ON public.page_views FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Index for fast queries
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views (path);
