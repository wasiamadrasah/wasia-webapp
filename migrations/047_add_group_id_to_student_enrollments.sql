-- Migration: 047_add_group_id_to_student_enrollments
-- Adds a group_id foreign key column to student_enrollments to associate students with academic groups.

ALTER TABLE public.student_enrollments ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL;
