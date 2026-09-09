-- Migration: 034_create_subjects
-- Master subject catalogue. Subjects are assigned to class configurations
-- through the class_subjects junction table.

CREATE TABLE IF NOT EXISTS subjects (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text    NOT NULL,
  code             text    NOT NULL,
  -- Theory, Practical, or Theory+Practical
  subject_type     text    NOT NULL DEFAULT 'theory'
                   CHECK (subject_type IN ('theory', 'practical', 'theory_practical')),
  -- Mandatory = required for all, Optional = student choice, Religion = based on religion
  subject_category text    NOT NULL DEFAULT 'mandatory'
                   CHECK (subject_category IN ('mandatory', 'optional', 'religion')),
  -- Only relevant when subject_category = 'religion'
  religion         text,
  -- Mark allocations
  theory_marks     integer,
  practical_marks  integer,
  pass_marks       integer,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz DEFAULT now(),
  UNIQUE (code)
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access_subjects"
  ON subjects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
