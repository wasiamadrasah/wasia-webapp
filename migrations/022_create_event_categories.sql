-- Create event_categories table for organizing events by type
-- Safe to run multiple times

CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill existing categories from events table
INSERT INTO public.event_categories (name, slug, is_active)
SELECT DISTINCT 
  COALESCE(NULLIF(BTRIM(category), ''), 'general') as name,
  LOWER(REGEXP_REPLACE(COALESCE(NULLIF(BTRIM(category), ''), 'general'), '[^a-z0-9]+', '-', 'g')) as slug,
  true
FROM public.events
WHERE category IS NOT NULL AND BTRIM(category) != ''
ON CONFLICT (name) DO NOTHING;

-- Ensure 'general' category exists
INSERT INTO public.event_categories (name, slug, is_active)
VALUES ('general', 'general', true)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_categories_slug ON public.event_categories(slug);
CREATE INDEX IF NOT EXISTS idx_event_categories_is_active ON public.event_categories(is_active);
