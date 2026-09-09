-- Migration: 036_create_class_subjects
-- Links subjects to academic class configurations.
-- Each class config can have many subjects; each subject can appear in many configs.

CREATE TABLE IF NOT EXISTS class_subjects (
  id                       uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_class_config_id uuid    NOT NULL REFERENCES academic_class_configs(id) ON DELETE CASCADE,
  subject_id               uuid    NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  is_optional              boolean NOT NULL DEFAULT false,
  sort_order               integer NOT NULL DEFAULT 0,
  created_at               timestamptz DEFAULT now(),

  UNIQUE (academic_class_config_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_class_subjects_config_id
  ON class_subjects (academic_class_config_id);

ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_class_subjects"
  ON class_subjects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
