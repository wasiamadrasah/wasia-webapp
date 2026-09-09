-- Migration 050: Create homepage_extracurriculars table and seed initial clubs
CREATE TABLE IF NOT EXISTS public.homepage_extracurriculars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_key TEXT NOT NULL DEFAULT 'sparkles',
  logo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS homepage_extracurriculars_order_idx
  ON public.homepage_extracurriculars (display_order ASC, created_at DESC);

-- Trigger to touch updated_at
CREATE OR REPLACE FUNCTION public.set_homepage_extracurriculars_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_homepage_extracurriculars_updated_at ON public.homepage_extracurriculars;
CREATE TRIGGER trg_homepage_extracurriculars_updated_at
BEFORE UPDATE ON public.homepage_extracurriculars
FOR EACH ROW EXECUTE FUNCTION public.set_homepage_extracurriculars_updated_at();

-- Seed initial data matching the hardcoded frontend extracurriculars
INSERT INTO public.homepage_extracurriculars (name, slug, description, icon_key, logo_url, display_order, is_active)
VALUES
  ('Scouts', 'scouts', 'Leadership & Adventure', 'compass', NULL, 1, true),
  ('Red Crescent', 'red-crescent', 'First Aid & Service', 'heart', NULL, 2, true),
  ('Football Club', 'football-club', 'Athleticism & Teamwork', 'trophy', NULL, 3, true),
  ('Cricket Club', 'cricket-club', 'Precision & Discipline', 'award', NULL, 4, true),
  ('Debate Club', 'debate-club', 'Public Speaking & Logic', 'message-square', NULL, 5, true),
  ('English Club', 'english-club', 'Language & Literature', 'languages', NULL, 6, true)
ON CONFLICT (slug) DO NOTHING;
