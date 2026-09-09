CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_class_config_id uuid NOT NULL REFERENCES public.academic_class_configs(id) ON DELETE RESTRICT,
  admission_type text NOT NULL DEFAULT 'new' CHECK (admission_type IN ('new', 'promotion', 'transfer', 're_admission')),
  student_category text NOT NULL DEFAULT 'general',
  roll_no integer NOT NULL,
  board_roll text,
  board_registration text,
  quota_id text,
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  enrollment_status text NOT NULL DEFAULT 'Active' CHECK (enrollment_status IN ('Active', 'Completed', 'Transferred', 'Cancelled')),
  promoted_from_enrollment_id uuid REFERENCES public.student_enrollments(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints:
  -- 1. Unique roll numbers within the same class configuration
  UNIQUE (academic_class_config_id, roll_no),
  -- 2. Prevent a student from having multiple active enrollments in the same class configuration
  UNIQUE (student_id, academic_class_config_id)
);

CREATE INDEX IF NOT EXISTS idx_se_student_id ON public.student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_se_class_config ON public.student_enrollments(academic_class_config_id);

-- RLS
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on student_enrollments" ON public.student_enrollments;
CREATE POLICY "Allow public read on student_enrollments" ON public.student_enrollments
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow admin all on student_enrollments" ON public.student_enrollments;
CREATE POLICY "Allow admin all on student_enrollments" ON public.student_enrollments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
