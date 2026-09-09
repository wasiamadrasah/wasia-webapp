-- Migration: 029_create_academic_versions
-- Medium-of-instruction versions (Bangla Version, English Version, etc.)

CREATE TABLE IF NOT EXISTS academic_versions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,         -- "Bangla Version"
  code       text    NOT NULL,         -- "BV"
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE (code)
);

ALTER TABLE academic_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_academic_versions"
  ON academic_versions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed common values
INSERT INTO academic_versions (name, code, is_active)
VALUES
  ('Bangla Version', 'BV', true),
  ('English Version', 'EV', true)
ON CONFLICT (code) DO NOTHING;
