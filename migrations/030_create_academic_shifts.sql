-- Migration: 030_create_academic_shifts
-- School shifts (Morning, Day, Evening, etc.)

CREATE TABLE IF NOT EXISTS academic_shifts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,         -- "Morning"
  start_time time,                     -- 08:00:00
  end_time   time,                     -- 12:00:00
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE academic_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_academic_shifts"
  ON academic_shifts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed common values
INSERT INTO academic_shifts (name, start_time, end_time, is_active)
VALUES
  ('Morning', '07:30:00', '12:30:00', true),
  ('Day',     '12:00:00', '17:00:00', true),
  ('Evening', '17:00:00', '21:00:00', false)
ON CONFLICT DO NOTHING;
