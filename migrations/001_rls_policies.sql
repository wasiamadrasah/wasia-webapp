-- ============================================================================
-- Row-Level Security (RLS) Policies for School System
-- ============================================================================
-- Enable RLS on all sensitive tables and create policies for:
-- 1. Public tables: notices, events (no auth required for reading)
-- 2. Protected tables: teachers, staff, schedules (auth required)
-- 3. Admin tables: audit_logs (admin only)
-- ============================================================================

-- ============================================================================
-- 1. TEACHERS TABLE - RLS Policies
-- ============================================================================

ALTER TABLE IF EXISTS public.teachers ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can view their own profile
CREATE POLICY "teachers_view_own_profile"
  ON public.teachers
  FOR SELECT
  USING (
    auth.uid()::text = user_id 
    OR EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Teachers can update their own profile
CREATE POLICY "teachers_update_own_profile"
  ON public.teachers
  FOR UPDATE
  USING (
    auth.uid()::text = user_id
  )
  WITH CHECK (
    auth.uid()::text = user_id
  );

-- Policy: Admins can view all teachers
CREATE POLICY "admin_view_all_teachers"
  ON public.teachers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Admins can update any teacher
CREATE POLICY "admin_update_teachers"
  ON public.teachers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Policy: Admins can delete teachers (with soft delete pattern)
CREATE POLICY "admin_delete_teachers"
  ON public.teachers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Policy: Admins can insert new teachers
CREATE POLICY "admin_insert_teachers"
  ON public.teachers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- ============================================================================
-- 2. STAFF TABLE - RLS Policies
-- ============================================================================

ALTER TABLE IF EXISTS public.staff ENABLE ROW LEVEL SECURITY;

-- Policy: Staff can view their own profile
CREATE POLICY "staff_view_own_profile"
  ON public.staff
  FOR SELECT
  USING (
    auth.uid()::text = user_id 
    OR EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Staff can update their own profile
CREATE POLICY "staff_update_own_profile"
  ON public.staff
  FOR UPDATE
  USING (
    auth.uid()::text = user_id
  )
  WITH CHECK (
    auth.uid()::text = user_id
  );

-- Policy: Admins can manage all staff
CREATE POLICY "admin_manage_staff"
  ON public.staff
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- ============================================================================
-- 3. NOTICES TABLE - RLS Policies (Public for reading, admin for writing)
-- ============================================================================

ALTER TABLE IF EXISTS public.notices ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published notices
CREATE POLICY "public_view_notices"
  ON public.notices
  FOR SELECT
  USING (
    published = true 
    OR auth.uid()::text IN (
      SELECT user_id FROM public.admin_roles 
      WHERE role IN ('admin', 'principal')
    )
  );

-- Policy: Admins can manage notices (create, update, delete)
CREATE POLICY "admin_manage_notices"
  ON public.notices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- ============================================================================
-- 4. EVENTS TABLE - RLS Policies (Public for reading, admin for writing)
-- ============================================================================

ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published events
CREATE POLICY "public_view_events"
  ON public.events
  FOR SELECT
  USING (
    published = true 
    OR auth.uid()::text IN (
      SELECT user_id FROM public.admin_roles 
      WHERE role IN ('admin', 'principal')
    )
  );

-- Policy: Admins can manage events
CREATE POLICY "admin_manage_events"
  ON public.events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- ============================================================================
-- 5. ADMIN_ROLES TABLE - RLS Policies (Audit and admin management only)
-- ============================================================================

ALTER TABLE IF EXISTS public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own role
CREATE POLICY "users_view_own_role"
  ON public.admin_roles
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Superadmin only can manage roles
CREATE POLICY "superadmin_manage_roles"
  ON public.admin_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'superadmin'
    )
  );

-- ============================================================================
-- 6. AUDIT_LOGS TABLE - RLS Policies (Admin and monitoring only)
-- ============================================================================

ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view audit logs
CREATE POLICY "admin_view_audit_logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal', 'superadmin')
    )
  );

-- Policy: System can insert audit logs (via trigger/service role)
CREATE POLICY "system_insert_audit_logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 7. TEACHER_ACADEMICS TABLE - RLS Policies
-- ============================================================================

ALTER TABLE IF EXISTS public.teacher_academics ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers view own academics
CREATE POLICY "teachers_view_own_academics"
  ON public.teacher_academics
  FOR SELECT
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
    OR EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Teachers update own academics
CREATE POLICY "teachers_update_own_academics"
  ON public.teacher_academics
  FOR UPDATE
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  )
  WITH CHECK (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  );

-- Policy: Teachers insert own academics
CREATE POLICY "teachers_insert_own_academics"
  ON public.teacher_academics
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  );

-- Policy: Teachers delete own academics
CREATE POLICY "teachers_delete_own_academics"
  ON public.teacher_academics
  FOR DELETE
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  );

-- Policy: Admins manage all academics
CREATE POLICY "admin_manage_academics"
  ON public.teacher_academics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- ============================================================================
-- 8. TEACHER_EXPERIENCE TABLE - RLS Policies
-- ============================================================================

ALTER TABLE IF EXISTS public.teacher_experience ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers view own experience
CREATE POLICY "teachers_view_own_experience"
  ON public.teacher_experience
  FOR SELECT
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
    OR EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Teachers manage own experience
CREATE POLICY "teachers_manage_own_experience"
  ON public.teacher_experience
  FOR ALL
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  )
  WITH CHECK (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  );

-- Policy: Admins manage all experience records
CREATE POLICY "admin_manage_experience"
  ON public.teacher_experience
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- ============================================================================
-- 9. TEACHER_TRAINING TABLE - RLS Policies
-- ============================================================================

ALTER TABLE IF EXISTS public.teacher_training ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers view own training
CREATE POLICY "teachers_view_own_training"
  ON public.teacher_training
  FOR SELECT
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
    OR EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Teachers manage own training
CREATE POLICY "teachers_manage_own_training"
  ON public.teacher_training
  FOR ALL
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  )
  WITH CHECK (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  );

-- Policy: Admins manage all training records
CREATE POLICY "admin_manage_training"
  ON public.teacher_training
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- ============================================================================
-- 10. TEACHER_FAMILY TABLE - RLS Policies
-- ============================================================================

ALTER TABLE IF EXISTS public.teacher_family ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers view own family info
CREATE POLICY "teachers_view_own_family"
  ON public.teacher_family
  FOR SELECT
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
    OR EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role IN ('admin', 'principal')
    )
  );

-- Policy: Teachers manage own family info
CREATE POLICY "teachers_manage_own_family"
  ON public.teacher_family
  FOR ALL
  USING (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  )
  WITH CHECK (
    auth.uid()::text = (
      SELECT user_id FROM public.teachers WHERE id = teacher_id
    )
  );

-- Policy: Admins manage all family records
CREATE POLICY "admin_manage_family"
  ON public.teacher_family
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- ============================================================================
-- INDEXES for Performance Optimization
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_teachers_user_id 
  ON public.teachers(user_id);

CREATE INDEX IF NOT EXISTS idx_staff_user_id 
  ON public.staff(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id 
  ON public.admin_roles(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_roles_role 
  ON public.admin_roles(role);

CREATE INDEX IF NOT EXISTS idx_notices_published 
  ON public.notices(published);

CREATE INDEX IF NOT EXISTS idx_events_published 
  ON public.events(published);

CREATE INDEX IF NOT EXISTS idx_teacher_academics_teacher_id 
  ON public.teacher_academics(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_experience_teacher_id 
  ON public.teacher_experience(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_training_teacher_id 
  ON public.teacher_training(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_family_teacher_id 
  ON public.teacher_family(teacher_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
  ON public.audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
  ON public.audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp 
  ON public.audit_logs(created_at DESC);

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================

COMMENT ON POLICY "teachers_view_own_profile" ON public.teachers 
  IS 'Teachers can view their own profile. Admins and principals can view all profiles.';

COMMENT ON POLICY "admin_manage_notices" ON public.notices 
  IS 'Only admins and principals can create, update, or delete notices.';

COMMENT ON POLICY "public_view_notices" ON public.notices 
  IS 'Public can view published notices. Unpublished notices only visible to admins.';
