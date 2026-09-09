-- Migration: 031_create_classes
-- Class/grade definitions. display_order controls sorting in dropdowns and lists.
-- numeric_value allows numeric comparisons (e.g. for promotion logic later).

CREATE TABLE IF NOT EXISTS classes (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text    NOT NULL,         -- "Class 9", "KG", "Play", "Nursery"
  numeric_value integer,                  -- 9 for Class 9, null for non-numeric classes
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- Index for ordered retrieval
CREATE INDEX IF NOT EXISTS idx_classes_display_order ON classes (display_order ASC);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_classes"
  ON classes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed typical Bangladeshi school class structure
INSERT INTO classes (name, numeric_value, display_order, is_active)
VALUES
  ('Play',    null,  1,  true),
  ('Nursery', null,  2,  true),
  ('KG',      null,  3,  true),
  ('Class 1', 1,     4,  true),
  ('Class 2', 2,     5,  true),
  ('Class 3', 3,     6,  true),
  ('Class 4', 4,     7,  true),
  ('Class 5', 5,     8,  true),
  ('Class 6', 6,     9,  true),
  ('Class 7', 7,     10, true),
  ('Class 8', 8,     11, true),
  ('Class 9', 9,     12, true),
  ('Class 10',10,    13, true)
ON CONFLICT DO NOTHING;
