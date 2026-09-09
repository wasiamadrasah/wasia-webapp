-- Create notices table required by admin notices CRUD
-- Run this in Supabase SQL editor if the table does not exist.

CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  notice_type TEXT NOT NULL DEFAULT 'general',
  publish_date TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notices_notice_type ON public.notices(notice_type);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(published);
CREATE INDEX IF NOT EXISTS idx_notices_publish_date ON public.notices(publish_date);

-- Keep updated_at fresh on updates
CREATE OR REPLACE FUNCTION public.touch_notices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notices_updated_at ON public.notices;
CREATE TRIGGER trg_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.touch_notices_updated_at();
