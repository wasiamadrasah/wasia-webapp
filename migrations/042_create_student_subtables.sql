-- Guardians Info
CREATE TABLE IF NOT EXISTS public.student_guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relation_type text NOT NULL CHECK (relation_type IN ('Father', 'Mother', 'Guardian')),
  name_en text NOT NULL,
  name_bn text,
  occupation text,
  yearly_income numeric,
  mobile text,
  email text,
  nid_no text
);

-- Addresses
CREATE TABLE IF NOT EXISTS public.student_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  address_type text NOT NULL CHECK (address_type IN ('Present', 'Permanent')),
  country text NOT NULL DEFAULT 'Bangladesh',
  division text,
  district text,
  thana text,
  address_line text NOT NULL
);

-- Previous Academic Info
CREATE TABLE IF NOT EXISTS public.student_previous_academics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  institute_name text NOT NULL,
  previous_class text,
  previous_gpa numeric(3,2),
  previous_marks integer,
  previous_result text,
  tc_number text,
  tc_date date,
  institute_location text
);

-- Documents
CREATE TABLE IF NOT EXISTS public.student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('Birth Certificate', 'Photo', 'Transcript', 'TC')),
  file_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Assigned Subjects (yearly enrollment mapping)
CREATE TABLE IF NOT EXISTS public.student_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
  subject_category text NOT NULL CHECK (subject_category IN ('Mandatory', 'Optional', 'Religion')),
  UNIQUE(enrollment_id, subject_id)
);

-- Enable RLS for all
ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_previous_academics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on guardians" ON public.student_guardians;
CREATE POLICY "Allow public read on guardians" ON public.student_guardians FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow admin all on guardians" ON public.student_guardians;
CREATE POLICY "Allow admin all on guardians" ON public.student_guardians FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on addresses" ON public.student_addresses;
CREATE POLICY "Allow public read on addresses" ON public.student_addresses FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow admin all on addresses" ON public.student_addresses;
CREATE POLICY "Allow admin all on addresses" ON public.student_addresses FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on previous_academics" ON public.student_previous_academics;
CREATE POLICY "Allow public read on previous_academics" ON public.student_previous_academics FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow admin all on previous_academics" ON public.student_previous_academics;
CREATE POLICY "Allow admin all on previous_academics" ON public.student_previous_academics FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on documents" ON public.student_documents;
CREATE POLICY "Allow public read on documents" ON public.student_documents FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow admin all on documents" ON public.student_documents;
CREATE POLICY "Allow admin all on documents" ON public.student_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on student_subjects" ON public.student_subjects;
CREATE POLICY "Allow public read on student_subjects" ON public.student_subjects FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow admin all on student_subjects" ON public.student_subjects;
CREATE POLICY "Allow admin all on student_subjects" ON public.student_subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);
