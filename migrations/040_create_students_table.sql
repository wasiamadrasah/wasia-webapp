CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_uid text UNIQUE NOT NULL, -- Permanent 8-digit ID: YYCCSSSS
  name_en text NOT NULL,
  name_bn text,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  religion text NOT NULL CHECK (religion IN ('Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other')),
  blood_group text CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  date_of_birth date NOT NULL,
  birth_certificate_no text, -- Checked for 17 digits in application layer
  national_id text,          -- Checked for 10 or 17 digits in application layer
  passport_no text,
  mobile text,               -- Checked for 11 digits in application layer
  email text,
  photo text,
  note text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on students" ON public.students;
CREATE POLICY "Allow public read on students" ON public.students
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow admin all on students" ON public.students;
CREATE POLICY "Allow admin all on students" ON public.students
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
