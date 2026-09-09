-- Harden shared OTP storage for teacher/admin email verification.
-- Existing admin flow can continue storing plaintext OTP values; teacher flow stores bcrypt hashes.

ALTER TABLE public.email_otp_tokens
  ALTER COLUMN otp_code TYPE varchar(255);

ALTER TABLE public.email_otp_tokens
  ADD COLUMN IF NOT EXISTS attempt_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.email_otp_tokens
  ADD COLUMN IF NOT EXISTS locked_at timestamp with time zone;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'email_otp_tokens_attempt_count_check'
  ) THEN
    ALTER TABLE public.email_otp_tokens
      ADD CONSTRAINT email_otp_tokens_attempt_count_check
      CHECK (attempt_count >= 0);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_otp_staff_active
  ON public.email_otp_tokens(staff_id, created_at DESC)
  WHERE verified = false;

CREATE INDEX IF NOT EXISTS idx_email_otp_admin_active
  ON public.email_otp_tokens(admin_id, created_at DESC)
  WHERE verified = false;
