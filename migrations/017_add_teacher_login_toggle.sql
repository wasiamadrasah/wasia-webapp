-- Add teacher account access controls:
-- 1) staffs.status for public/profile visibility + account disable semantics
-- 2) staff_accounts.can_login for login-only toggle

BEGIN;

ALTER TABLE IF EXISTS public.staffs
  ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE public.staffs
SET status = 'active'
WHERE status IS NULL;

ALTER TABLE IF EXISTS public.staffs
  ALTER COLUMN status SET DEFAULT 'active';

ALTER TABLE IF EXISTS public.staffs
  ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'staffs_status_check'
  ) THEN
    ALTER TABLE public.staffs
      ADD CONSTRAINT staffs_status_check
      CHECK (status IN ('active', 'inactive'));
  END IF;
END $$;

ALTER TABLE IF EXISTS public.staff_accounts
  ADD COLUMN IF NOT EXISTS can_login BOOLEAN;

UPDATE public.staff_accounts
SET can_login = true
WHERE can_login IS NULL;

ALTER TABLE IF EXISTS public.staff_accounts
  ALTER COLUMN can_login SET DEFAULT true;

ALTER TABLE IF EXISTS public.staff_accounts
  ALTER COLUMN can_login SET NOT NULL;

COMMIT;
