-- Migration: 045_subject_system_redesign
-- Simplify subjects master and expand class_subjects with marks and config

-- ── 1. Simplify subjects master table ────────────────────────────
ALTER TABLE subjects
  ADD COLUMN IF NOT EXISTS name_bn TEXT;

-- Remove marks from master (they move to class_subjects)
ALTER TABLE subjects
  DROP COLUMN IF EXISTS subject_type CASCADE,
  DROP COLUMN IF EXISTS subject_category CASCADE,
  DROP COLUMN IF EXISTS religion CASCADE,
  DROP COLUMN IF EXISTS theory_marks CASCADE,
  DROP COLUMN IF EXISTS practical_marks CASCADE,
  DROP COLUMN IF EXISTS pass_marks CASCADE;

-- ── 2. Expand class_subjects ──────────────────────────────────────
ALTER TABLE class_subjects
  -- Subject display
  ADD COLUMN IF NOT EXISTS subject_name_override  TEXT,

  -- Student assignment type
  ADD COLUMN IF NOT EXISTS student_type  TEXT  NOT NULL  DEFAULT 'mandatory',
  -- values: 'mandatory' | 'optional' | 'religion' | 'continuous_assessment'

  -- Result inclusion
  ADD COLUMN IF NOT EXISTS count_in_result  BOOLEAN  NOT NULL  DEFAULT true,

  -- Paper grouping (Bangla-I + Bangla-II → one result entry)
  ADD COLUMN IF NOT EXISTS paper_group_code  TEXT,

  -- Theory
  ADD COLUMN IF NOT EXISTS has_theory         BOOLEAN  NOT NULL  DEFAULT true,
  ADD COLUMN IF NOT EXISTS theory_marks       INT,      -- contribution to total (e.g. 75)
  ADD COLUMN IF NOT EXISTS theory_exam_marks  INT,      -- paper total if scaling needed (e.g. 100)
  ADD COLUMN IF NOT EXISTS has_cq_mcq         BOOLEAN  NOT NULL  DEFAULT false,
  ADD COLUMN IF NOT EXISTS cq_marks           INT,      -- CQ portion  (cq + mcq = theory_marks)
  ADD COLUMN IF NOT EXISTS mcq_marks          INT,      -- MCQ portion
  ADD COLUMN IF NOT EXISTS theory_pass_marks  INT,

  -- Class Assessment
  ADD COLUMN IF NOT EXISTS ca_marks           INT,      -- NULL = no CA
  ADD COLUMN IF NOT EXISTS ca_pass_marks      INT,

  -- Practical
  ADD COLUMN IF NOT EXISTS has_practical         BOOLEAN  NOT NULL  DEFAULT false,
  ADD COLUMN IF NOT EXISTS practical_marks       INT,
  ADD COLUMN IF NOT EXISTS practical_pass_marks  INT,

  -- Overall pass
  ADD COLUMN IF NOT EXISTS total_pass_marks  INT;

-- Set student_type based on the old is_optional column
UPDATE class_subjects SET student_type = 'optional' WHERE is_optional = true;
