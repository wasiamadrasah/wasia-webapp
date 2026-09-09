-- Migration: 032_create_sections
-- Sections (A, B, C, etc.) are global definitions; they are linked to classes
-- through academic_class_configs, not directly.

CREATE TABLE IF NOT EXISTS sections (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,         -- "A", "B", "C"
  capacity   integer,                  -- max students
  room_no    text,                     -- room number or label
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_sections"
  ON sections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed common sections
INSERT INTO sections (name, is_active)
VALUES
  ('A', true),
  ('B', true),
  ('C', true),
  ('D', true)
ON CONFLICT DO NOTHING;
