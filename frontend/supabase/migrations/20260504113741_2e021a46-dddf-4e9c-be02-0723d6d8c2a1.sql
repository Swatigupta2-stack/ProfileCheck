-- Resume versions (manual snapshots)
CREATE TABLE public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'Untitled version',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resume_versions_user ON public.resume_versions(user_id, created_at DESC);

ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select versions" ON public.resume_versions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner insert versions" ON public.resume_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update versions" ON public.resume_versions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete versions" ON public.resume_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Published portfolios
CREATE TABLE public.published_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_published_portfolios_slug ON public.published_portfolios(slug);

ALTER TABLE public.published_portfolios ENABLE ROW LEVEL SECURITY;

-- Public read for published portfolios
CREATE POLICY "Anyone can view public portfolios" ON public.published_portfolios
  FOR SELECT USING (is_public = true);

-- Owner full control
CREATE POLICY "Owner manage own portfolio - select" ON public.published_portfolios
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner insert portfolio" ON public.published_portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update portfolio" ON public.published_portfolios
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete portfolio" ON public.published_portfolios
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_published_portfolios_updated_at
  BEFORE UPDATE ON public.published_portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();