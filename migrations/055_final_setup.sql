-- ============================================================================
-- 1. Rate Limits Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key VARCHAR PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_time TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.rate_limits;
CREATE POLICY "Service role full access" ON public.rate_limits
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================================
-- 2. Roles and Permissions Tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_role_permission UNIQUE (role_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_roles_slug ON public.roles(slug);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_key ON public.role_permissions(permission_key);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on roles" ON public.roles;
CREATE POLICY "Service role full access on roles" ON public.roles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on role_permissions" ON public.role_permissions;
CREATE POLICY "Service role full access on role_permissions" ON public.role_permissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed Initial Roles
INSERT INTO public.roles (name, slug, description, is_system)
VALUES
  ('Super Admin', 'superadmin', 'Complete unrestricted system access across all modules and settings.', true),
  ('Admin', 'admin', 'System administrative staff with comprehensive operational permissions.', true),
  ('Teacher', 'teacher', 'Academic staff managing classroom lessons, student attendance, exams, and grades.', true),
  ('Accountant', 'accountant', 'Finance and accounts management, fees collection, billing, and financial reports.', true),
  ('Librarian', 'librarian', 'Library books cataloging, issue and return management, and inventory tracking.', true),
  ('Receptionist', 'receptionist', 'Front office management, student admissions inquiries, and visitor logging.', true),
  ('Student', 'student', 'Student portal access for timetable, grades, attendance records, and notices.', true),
  ('Parent', 'parent', 'Parent portal to track children attendance, fees payment, and academic progress.', true),
  ('Driver', 'driver', 'School transport vehicle driver with route and transport schedule access.', true),
  ('Staff', 'staff', 'General support and administrative school staff members.', true)
ON CONFLICT (name) DO UPDATE 
SET 
  description = EXCLUDED.description,
  is_system = EXCLUDED.is_system;

-- Seed Default Permissions
DO $$
DECLARE
  superadmin_id UUID;
  admin_id UUID;
  teacher_id UUID;
  accountant_id UUID;
  librarian_id UUID;
  receptionist_id UUID;
  perm TEXT;
  all_perms TEXT[] := ARRAY[
    'students_view', 'students_add', 'students_edit', 'students_delete',
    'academics_view', 'academics_add', 'academics_edit', 'academics_delete',
    'teachers_view', 'teachers_add', 'teachers_edit', 'teachers_delete',
    'attendance_view', 'attendance_add', 'attendance_edit', 'attendance_delete',
    'exams_view', 'exams_add', 'exams_edit', 'exams_delete',
    'fees_view', 'fees_add', 'fees_edit', 'fees_delete',
    'library_view', 'library_add', 'library_edit', 'library_delete',
    'admissions_view', 'admissions_add', 'admissions_edit', 'admissions_delete',
    'notices_view', 'notices_add', 'notices_edit', 'notices_delete',
    'events_view', 'events_add', 'events_edit', 'events_delete',
    'reports_view', 'reports_add', 'reports_edit', 'reports_delete',
    'settings_view', 'settings_add', 'settings_edit', 'settings_delete'
  ];
BEGIN
  SELECT id INTO superadmin_id FROM public.roles WHERE slug = 'superadmin';
  SELECT id INTO admin_id FROM public.roles WHERE slug = 'admin';
  SELECT id INTO teacher_id FROM public.roles WHERE slug = 'teacher';
  SELECT id INTO accountant_id FROM public.roles WHERE slug = 'accountant';
  SELECT id INTO librarian_id FROM public.roles WHERE slug = 'librarian';
  SELECT id INTO receptionist_id FROM public.roles WHERE slug = 'receptionist';

  IF superadmin_id IS NOT NULL THEN
    FOREACH perm IN ARRAY all_perms LOOP
      INSERT INTO public.role_permissions (role_id, permission_key)
      VALUES (superadmin_id, perm)
      ON CONFLICT (role_id, permission_key) DO NOTHING;
    END LOOP;
  END IF;

  IF admin_id IS NOT NULL THEN
    FOREACH perm IN ARRAY ARRAY[
      'students_view', 'students_add', 'students_edit',
      'academics_view', 'academics_add', 'academics_edit',
      'teachers_view', 'teachers_add',
      'attendance_view', 'attendance_add', 'attendance_edit',
      'exams_view', 'exams_add', 'exams_edit',
      'notices_view', 'notices_add', 'notices_edit',
      'events_view', 'events_add', 'events_edit',
      'reports_view'
    ] LOOP
      INSERT INTO public.role_permissions (role_id, permission_key)
      VALUES (admin_id, perm)
      ON CONFLICT (role_id, permission_key) DO NOTHING;
    END LOOP;
  END IF;

  IF teacher_id IS NOT NULL THEN
    FOREACH perm IN ARRAY ARRAY[
      'students_view', 'academics_view', 'attendance_view', 'attendance_add', 'attendance_edit', 'exams_view', 'exams_add', 'notices_view'
    ] LOOP
      INSERT INTO public.role_permissions (role_id, permission_key)
      VALUES (teacher_id, perm)
      ON CONFLICT (role_id, permission_key) DO NOTHING;
    END LOOP;
  END IF;

  IF accountant_id IS NOT NULL THEN
    FOREACH perm IN ARRAY ARRAY[
      'students_view', 'fees_view', 'fees_add', 'fees_edit', 'fees_delete', 'reports_view'
    ] LOOP
      INSERT INTO public.role_permissions (role_id, permission_key)
      VALUES (accountant_id, perm)
      ON CONFLICT (role_id, permission_key) DO NOTHING;
    END LOOP;
  END IF;

  IF librarian_id IS NOT NULL THEN
    FOREACH perm IN ARRAY ARRAY[
      'students_view', 'library_view', 'library_add', 'library_edit', 'library_delete'
    ] LOOP
      INSERT INTO public.role_permissions (role_id, permission_key)
      VALUES (librarian_id, perm)
      ON CONFLICT (role_id, permission_key) DO NOTHING;
    END LOOP;
  END IF;

  IF receptionist_id IS NOT NULL THEN
    FOREACH perm IN ARRAY ARRAY[
      'students_view', 'admissions_view', 'admissions_add', 'admissions_edit', 'notices_view', 'events_view'
    ] LOOP
      INSERT INTO public.role_permissions (role_id, permission_key)
      VALUES (receptionist_id, perm)
      ON CONFLICT (role_id, permission_key) DO NOTHING;
    END LOOP;
  END IF;
END $$;
