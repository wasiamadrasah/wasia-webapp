-- Allow the shared email OTP token table to support teacher/staff email changes.
ALTER TABLE public.email_otp_tokens
  ALTER COLUMN admin_id DROP NOT NULL;

ALTER TABLE public.email_otp_tokens
  ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staffs(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_email_otp_staff_id ON public.email_otp_tokens(staff_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'email_otp_tokens_single_owner'
  ) THEN
    ALTER TABLE public.email_otp_tokens
      ADD CONSTRAINT email_otp_tokens_single_owner
      CHECK (
        (admin_id IS NOT NULL AND staff_id IS NULL)
        OR
        (admin_id IS NULL AND staff_id IS NOT NULL)
      );
  END IF;
END $$;
