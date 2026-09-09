-- Migration: 037_create_subject_teachers
-- Assigns teachers to subjects within a specific academic class configuration.
-- A subject can have multiple teachers (e.g. separate theory/practical teachers).
-- assignment_type: 'full' | 'theory' | 'practical'

CREATE TABLE IF NOT EXISTS subject_teachers (
  id                       uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_class_config_id uuid    NOT NULL REFERENCES academic_class_configs(id) ON DELETE CASCADE,
  subject_id               uuid    NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  teacher_id               uuid    NOT NULL REFERENCES staffs(id)   ON DELETE RESTRICT,
  assignment_type          text    NOT NULL DEFAULT 'full'
                           CHECK (assignment_type IN ('full', 'theory', 'practical')),
  created_at               timestamptz DEFAULT now(),

  UNIQUE (academic_class_config_id, subject_id, teacher_id, assignment_type)
);

CREATE INDEX IF NOT EXISTS idx_subject_teachers_config_id
  ON subject_teachers (academic_class_config_id);
CREATE INDEX IF NOT EXISTS idx_subject_teachers_teacher_id
  ON subject_teachers (teacher_id);

ALTER TABLE subject_teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_subject_teachers"
  ON subject_teachers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
