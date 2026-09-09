-- Add profile fields to admins table
ALTER TABLE public.admins
ADD COLUMN IF NOT EXISTS full_name varchar(255),
ADD COLUMN IF NOT EXISTS profile_photo text;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Add comment to document the columns
COMMENT ON COLUMN public.admins.full_name IS 'Full name of the admin user';
COMMENT ON COLUMN public.admins.profile_photo IS 'URL to admin profile photo stored in Supabase Storage';
