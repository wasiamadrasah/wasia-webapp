-- Create downloads and download_categories tables
-- Run this in Supabase SQL editor if the tables do not exist.

CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  download_type TEXT NOT NULL DEFAULT 'general',
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  author_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.download_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure a default category always exists.
INSERT INTO public.download_categories (name, is_active)
VALUES ('general', true)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_downloads_download_type ON public.downloads(download_type);
CREATE INDEX IF NOT EXISTS idx_downloads_published ON public.downloads(published);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_download_categories_name ON public.download_categories(name);
CREATE INDEX IF NOT EXISTS idx_download_categories_active ON public.download_categories(is_active);

-- Keep updated_at fresh on updates for downloads
CREATE OR REPLACE FUNCTION public.touch_downloads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_downloads_updated_at ON public.downloads;
CREATE TRIGGER trg_downloads_updated_at
BEFORE UPDATE ON public.downloads
FOR EACH ROW
EXECUTE FUNCTION public.touch_downloads_updated_at();

-- Keep updated_at fresh on updates for download_categories
CREATE OR REPLACE FUNCTION public.touch_download_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_download_categories_updated_at ON public.download_categories;
CREATE TRIGGER trg_download_categories_updated_at
BEFORE UPDATE ON public.download_categories
FOR EACH ROW
EXECUTE FUNCTION public.touch_download_categories_updated_at();
