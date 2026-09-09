-- Create governing body members table
-- Safe to run multiple times

CREATE TABLE IF NOT EXISTS public.governing_body_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_governing_body_category ON public.governing_body_members(category);

CREATE OR REPLACE FUNCTION public.touch_governing_body_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_governing_body_members_updated_at ON public.governing_body_members;
CREATE TRIGGER trg_governing_body_members_updated_at
BEFORE UPDATE ON public.governing_body_members
FOR EACH ROW
EXECUTE FUNCTION public.touch_governing_body_members_updated_at();
