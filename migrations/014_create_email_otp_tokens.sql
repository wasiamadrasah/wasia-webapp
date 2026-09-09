-- Create email OTP tokens table for 2-step email verification
CREATE TABLE IF NOT EXISTS public.email_otp_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.admins(id) ON DELETE CASCADE,
  new_email varchar(255) NOT NULL,
  otp_code varchar(6) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT now() + interval '15 minutes',
  verified boolean DEFAULT false,
  CONSTRAINT valid_email CHECK (new_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_otp_admin_id ON public.email_otp_tokens(admin_id);
CREATE INDEX IF NOT EXISTS idx_email_otp_expires_at ON public.email_otp_tokens(expires_at);
