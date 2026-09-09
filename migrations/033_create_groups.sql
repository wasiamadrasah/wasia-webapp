-- Migration: 033_create_groups
-- Academic groups/departments (Science, Business Studies, Humanities, etc.)
-- Primarily used for Class 9, 10 and college-level classes.

CREATE TABLE IF NOT EXISTS groups (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,         -- "Science"
  short_name text,                     -- "Sci"
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_groups"
  ON groups
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed standard Bangladeshi SSC groups
INSERT INTO groups (name, short_name, is_active)
VALUES
  ('Science',          'Sci',  true),
  ('Business Studies', 'Bus',  true),
  ('Humanities',       'Hum',  true)
ON CONFLICT DO NOTHING;
