-- Create student_accounts table linked to the students profile table
CREATE TABLE IF NOT EXISTS public.student_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  student_uid text NOT NULL UNIQUE,
  email text UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'student',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;

-- Allow read operations on student_accounts
DROP POLICY IF EXISTS "Allow public read on student_accounts" ON public.student_accounts;
CREATE POLICY "Allow public read on student_accounts" ON public.student_accounts
  FOR SELECT TO public USING (true);

-- Allow authenticated admins to do all operations
DROP POLICY IF EXISTS "Allow admin all on student_accounts" ON public.student_accounts;
CREATE POLICY "Allow admin all on student_accounts" ON public.student_accounts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
