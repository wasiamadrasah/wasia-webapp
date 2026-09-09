-- Reconcile RLS policies with current schema used by application code.
-- Safe to run multiple times and safe when some tables are missing.

BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_roles (
  user_id TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'principal')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS where tables exist
ALTER TABLE IF EXISTS public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_academics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff_family ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop stale legacy-table policies only when those tables exist
  IF to_regclass('public.teachers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "teachers_view_own_profile" ON public.teachers;
    DROP POLICY IF EXISTS "teachers_update_own_profile" ON public.teachers;
    DROP POLICY IF EXISTS "admin_view_all_teachers" ON public.teachers;
    DROP POLICY IF EXISTS "admin_update_teachers" ON public.teachers;
    DROP POLICY IF EXISTS "admin_delete_teachers" ON public.teachers;
    DROP POLICY IF EXISTS "admin_insert_teachers" ON public.teachers;
  END IF;

  IF to_regclass('public.staff') IS NOT NULL THEN
    DROP POLICY IF EXISTS "staff_view_own_profile" ON public.staff;
    DROP POLICY IF EXISTS "staff_update_own_profile" ON public.staff;
    DROP POLICY IF EXISTS "admin_manage_staff" ON public.staff;
  END IF;

  IF to_regclass('public.teacher_academics') IS NOT NULL THEN
    DROP POLICY IF EXISTS "teachers_view_own_academics" ON public.teacher_academics;
    DROP POLICY IF EXISTS "teachers_update_own_academics" ON public.teacher_academics;
    DROP POLICY IF EXISTS "teachers_insert_own_academics" ON public.teacher_academics;
    DROP POLICY IF EXISTS "teachers_delete_own_academics" ON public.teacher_academics;
  END IF;

  -- admin_roles policies
  IF to_regclass('public.admin_roles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "users_view_own_role" ON public.admin_roles;
    CREATE POLICY "users_view_own_role"
      ON public.admin_roles
      FOR SELECT
      USING (auth.uid()::text = user_id);

    DROP POLICY IF EXISTS "superadmin_manage_roles" ON public.admin_roles;
    CREATE POLICY "superadmin_manage_roles"
      ON public.admin_roles
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_roles ar
          WHERE ar.user_id = auth.uid()::text
            AND ar.role = 'superadmin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.admin_roles ar
          WHERE ar.user_id = auth.uid()::text
            AND ar.role = 'superadmin'
        )
      );
  END IF;

  -- staffs policies
  IF to_regclass('public.staffs') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public_view_staff_profiles" ON public.staffs;
    CREATE POLICY "public_view_staff_profiles"
      ON public.staffs
      FOR SELECT
      USING (true);

    DROP POLICY IF EXISTS "admin_manage_staffs" ON public.staffs;
    CREATE POLICY "admin_manage_staffs"
      ON public.staffs
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

    IF to_regclass('public.staff_accounts') IS NOT NULL THEN
      DROP POLICY IF EXISTS "teacher_manage_own_profile" ON public.staffs;
      CREATE POLICY "teacher_manage_own_profile"
        ON public.staffs
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.staff_accounts sa
            WHERE sa.staff_id = staffs.id
              AND sa.role = 'teacher'
              AND sa.email = auth.jwt() ->> 'email'
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.staff_accounts sa
            WHERE sa.staff_id = staffs.id
              AND sa.role = 'teacher'
              AND sa.email = auth.jwt() ->> 'email'
          )
        );
    END IF;
  END IF;

  -- staff_accounts policies
  IF to_regclass('public.staff_accounts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "admin_manage_staff_accounts" ON public.staff_accounts;
    CREATE POLICY "admin_manage_staff_accounts"
      ON public.staff_accounts
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
  END IF;

  -- teacher-owned detail tables
  IF to_regclass('public.staff_academics') IS NOT NULL AND to_regclass('public.staff_accounts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "teacher_manage_own_academics" ON public.staff_academics;
    CREATE POLICY "teacher_manage_own_academics"
      ON public.staff_academics
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_academics.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_academics.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      );
  END IF;

  IF to_regclass('public.staff_experience') IS NOT NULL AND to_regclass('public.staff_accounts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "teacher_manage_own_experience" ON public.staff_experience;
    CREATE POLICY "teacher_manage_own_experience"
      ON public.staff_experience
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_experience.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_experience.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      );
  END IF;

  IF to_regclass('public.staff_training') IS NOT NULL AND to_regclass('public.staff_accounts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "teacher_manage_own_training" ON public.staff_training;
    CREATE POLICY "teacher_manage_own_training"
      ON public.staff_training
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_training.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_training.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      );
  END IF;

  IF to_regclass('public.staff_family') IS NOT NULL AND to_regclass('public.staff_accounts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "teacher_manage_own_family" ON public.staff_family;
    CREATE POLICY "teacher_manage_own_family"
      ON public.staff_family
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_family.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.staff_accounts sa
          WHERE sa.staff_id = staff_family.staff_id
            AND sa.role = 'teacher'
            AND sa.email = auth.jwt() ->> 'email'
        )
      );
  END IF;

  -- publishing tables
  IF to_regclass('public.notices') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public_view_notices" ON public.notices;
    CREATE POLICY "public_view_notices"
      ON public.notices
      FOR SELECT
      USING (published = true);

    DROP POLICY IF EXISTS "admin_manage_notices" ON public.notices;
    CREATE POLICY "admin_manage_notices"
      ON public.notices
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
  END IF;

  IF to_regclass('public.news_posts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public_view_news_posts" ON public.news_posts;
    CREATE POLICY "public_view_news_posts"
      ON public.news_posts
      FOR SELECT
      USING (published = true);

    DROP POLICY IF EXISTS "admin_manage_news_posts" ON public.news_posts;
    CREATE POLICY "admin_manage_news_posts"
      ON public.news_posts
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
  END IF;

  IF to_regclass('public.blog_posts') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public_view_blog_posts" ON public.blog_posts;
    CREATE POLICY "public_view_blog_posts"
      ON public.blog_posts
      FOR SELECT
      USING (published = true);

    DROP POLICY IF EXISTS "admin_manage_blog_posts" ON public.blog_posts;
    CREATE POLICY "admin_manage_blog_posts"
      ON public.blog_posts
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
  END IF;

  IF to_regclass('public.events') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public_view_events" ON public.events;
    CREATE POLICY "public_view_events"
      ON public.events
      FOR SELECT
      USING (COALESCE(published, true) = true);

    DROP POLICY IF EXISTS "admin_manage_events" ON public.events;
    CREATE POLICY "admin_manage_events"
      ON public.events
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
  END IF;

  -- audit logs
  IF to_regclass('public.audit_logs') IS NOT NULL THEN
    DROP POLICY IF EXISTS "admin_view_audit_logs" ON public.audit_logs;
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

    DROP POLICY IF EXISTS "system_insert_audit_logs" ON public.audit_logs;
    CREATE POLICY "system_insert_audit_logs"
      ON public.audit_logs
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

COMMIT;
