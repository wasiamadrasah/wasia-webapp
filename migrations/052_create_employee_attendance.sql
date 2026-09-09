-- Migration: 052_create_employee_attendance
-- Track employee daily logs (present, absent, leave), and attendance settings.

CREATE TABLE IF NOT EXISTS public.employee_attendance (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     uuid NOT NULL REFERENCES public.staffs(id) ON DELETE CASCADE,
  date         date NOT NULL DEFAULT CURRENT_DATE,
  status       text NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  in_time      time without time zone,
  out_time     time without time zone,
  is_late      boolean NOT NULL DEFAULT false,
  is_early_exit boolean NOT NULL DEFAULT false,
  remark       text,
  shift_id     uuid REFERENCES public.academic_shifts(id) ON DELETE SET NULL,
  action_at    timestamptz DEFAULT now(),
  CONSTRAINT employee_attendance_staff_date_unique UNIQUE (staff_id, date)
);

CREATE TABLE IF NOT EXISTS public.employee_attendance_settings (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  in_sms_enabled  boolean NOT NULL DEFAULT false,
  out_sms_enabled boolean NOT NULL DEFAULT false,
  updated_at     timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_attendance_settings ENABLE ROW LEVEL SECURITY;

-- 1. Policies for employee_attendance
CREATE POLICY "admin_all_employee_attendance"
  ON public.employee_attendance
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal', 'superadmin')
    )
  );

CREATE POLICY "staff_view_own_attendance"
  ON public.employee_attendance
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staffs s
      WHERE s.id = staff_id
      AND s.nid_number = auth.uid()::text -- Or whatever field is mapped to Auth UID in Supabase trigger. In NextAuth, staff_id resolves to staff profile ID.
    )
  );

-- 2. Policies for employee_attendance_settings
CREATE POLICY "admin_all_employee_attendance_settings"
  ON public.employee_attendance_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal', 'superadmin')
    )
  );

-- Seed default settings
INSERT INTO public.employee_attendance_settings (in_sms_enabled, out_sms_enabled)
VALUES (false, false)
ON CONFLICT DO NOTHING;

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_employee_attendance_date ON public.employee_attendance(date);
CREATE INDEX IF NOT EXISTS idx_employee_attendance_staff_id ON public.employee_attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_employee_attendance_status ON public.employee_attendance(status);
