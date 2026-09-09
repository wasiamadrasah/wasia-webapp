-- Online Admissions
CREATE TABLE IF NOT EXISTS public.admission_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_no text UNIQUE NOT NULL,
  session_id uuid NOT NULL REFERENCES public.academic_sessions(id) ON DELETE RESTRICT,
  academic_class_config_id uuid NOT NULL REFERENCES public.academic_class_configs(id) ON DELETE RESTRICT,
  student_data_json jsonb NOT NULL,
  guardian_data_json jsonb NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Waiting')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES public.staffs(id) ON DELETE SET NULL
);

-- Admission Settings
CREATE TABLE IF NOT EXISTS public.admission_settings (
  id text PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  enable_online_admission boolean NOT NULL DEFAULT false,
  start_date date,
  end_date date,
  allowed_classes jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of class_ids
  require_approval boolean NOT NULL DEFAULT true,
  auto_roll_generation boolean NOT NULL DEFAULT true
);

-- Populate default admission settings
INSERT INTO public.admission_settings (id, enable_online_admission) VALUES ('default', false) ON CONFLICT DO NOTHING;

ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/insert applications" ON public.admission_applications;
CREATE POLICY "Allow public read/insert applications" ON public.admission_applications FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow public insert applications" ON public.admission_applications;
CREATE POLICY "Allow public insert applications" ON public.admission_applications FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Allow admin all on applications" ON public.admission_applications;
CREATE POLICY "Allow admin all on applications" ON public.admission_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read settings" ON public.admission_settings;
CREATE POLICY "Allow public read settings" ON public.admission_settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow admin all on settings" ON public.admission_settings;
CREATE POLICY "Allow admin all on settings" ON public.admission_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
