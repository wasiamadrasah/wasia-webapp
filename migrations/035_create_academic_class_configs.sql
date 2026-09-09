-- Migration: 035_create_academic_class_configs
-- The central pivot table of the academic system.
-- Each record represents a unique combination of:
--   Session + Version + Shift + Class + Section + Group
-- Students, subjects, and teachers are linked to this record — NOT to the raw class.
--
-- NULL values in version_id, shift_id, section_id, group_id are valid:
--   e.g. a class with no group, or a school with a single shift.
-- The UNIQUE NULLS NOT DISTINCT constraint prevents duplicate combos even with NULLs.

CREATE TABLE IF NOT EXISTS academic_class_configs (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       uuid    NOT NULL REFERENCES academic_sessions(id) ON DELETE RESTRICT,
  version_id       uuid    REFERENCES academic_versions(id)  ON DELETE SET NULL,
  shift_id         uuid    REFERENCES academic_shifts(id)    ON DELETE SET NULL,
  class_id         uuid    NOT NULL REFERENCES classes(id)   ON DELETE RESTRICT,
  section_id       uuid    REFERENCES sections(id)           ON DELETE SET NULL,
  group_id         uuid    REFERENCES groups(id)             ON DELETE SET NULL,
  class_teacher_id uuid    REFERENCES staffs(id)             ON DELETE SET NULL,
  capacity         integer,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),

  -- Prevent duplicate configurations for the same combination
  UNIQUE NULLS NOT DISTINCT (session_id, version_id, shift_id, class_id, section_id, group_id)
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_acc_session_id   ON academic_class_configs (session_id);
CREATE INDEX IF NOT EXISTS idx_acc_class_id     ON academic_class_configs (class_id);
CREATE INDEX IF NOT EXISTS idx_acc_teacher_id   ON academic_class_configs (class_teacher_id);

ALTER TABLE academic_class_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_academic_class_configs"
  ON academic_class_configs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
