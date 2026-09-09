-- Migration: 046_add_subject_groups_to_class_subjects
-- Adds a subject_groups text[] column to class_subjects to allow administrators
-- to specify which academic groups a subject belongs to within a class setup.

ALTER TABLE class_subjects ADD COLUMN IF NOT EXISTS subject_groups text[] DEFAULT '{}';
