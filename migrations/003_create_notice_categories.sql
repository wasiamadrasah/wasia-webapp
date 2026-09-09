-- Create notice category table and ensure notices table exists.
-- Safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  notice_type TEXT NOT NULL DEFAULT 'general',
  publish_date TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  attachment_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notices
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

CREATE TABLE IF NOT EXISTS public.notice_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure a default category always exists.
INSERT INTO public.notice_categories (name, is_active)
VALUES ('general', true)
ON CONFLICT (name) DO UPDATE
SET is_active = EXCLUDED.is_active;

-- Backfill categories from existing notices.
INSERT INTO public.notice_categories (name, is_active)
SELECT DISTINCT LOWER(TRIM(notice_type)) AS name, true
FROM public.notices
WHERE notice_type IS NOT NULL
  AND TRIM(notice_type) <> ''
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_notice_categories_name ON public.notice_categories(name);
CREATE INDEX IF NOT EXISTS idx_notice_categories_active ON public.notice_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_notices_notice_type ON public.notices(notice_type);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(published);

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

CREATE OR REPLACE FUNCTION public.touch_notice_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notice_categories_updated_at ON public.notice_categories;
CREATE TRIGGER trg_notice_categories_updated_at
BEFORE UPDATE ON public.notice_categories
FOR EACH ROW
EXECUTE FUNCTION public.touch_notice_categories_updated_at();
