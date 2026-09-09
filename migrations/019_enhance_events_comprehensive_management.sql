-- Enhance events table with comprehensive event management fields
-- Safe to run multiple times - all columns use IF NOT EXISTS

-- Create base events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  image_url TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add new columns for comprehensive event management
ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'seminar',
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'offline',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS end_time TIME,
ADD COLUMN IF NOT EXISTS all_day BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS venue_name TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS district_state TEXT,
ADD COLUMN IF NOT EXISTS google_map_link TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT,
ADD COLUMN IF NOT EXISTS meeting_platform TEXT,
ADD COLUMN IF NOT EXISTS meeting_url TEXT,
ADD COLUMN IF NOT EXISTS meeting_id TEXT,
ADD COLUMN IF NOT EXISTS meeting_passcode TEXT,
ADD COLUMN IF NOT EXISTS organizer_name TEXT,
ADD COLUMN IF NOT EXISTS organizer_email TEXT,
ADD COLUMN IF NOT EXISTS organizer_phone TEXT,
ADD COLUMN IF NOT EXISTS co_organizer TEXT,
ADD COLUMN IF NOT EXISTS hosted_by TEXT,
ADD COLUMN IF NOT EXISTS registration_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_participants INTEGER,
ADD COLUMN IF NOT EXISTS registration_fee DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS ticket_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS approval_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_form_fields JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS thumbnail_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS brochure_url TEXT,
ADD COLUMN IF NOT EXISTS promo_video_url TEXT,
ADD COLUMN IF NOT EXISTS event_logo_url TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT,
ADD COLUMN IF NOT EXISTS social_share_image_url TEXT,
ADD COLUMN IF NOT EXISTS share_buttons_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS audience_type TEXT DEFAULT 'everyone',
ADD COLUMN IF NOT EXISTS applicable_class TEXT,
ADD COLUMN IF NOT EXISTS session_batch TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS homepage_highlight BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS password_protected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS event_password TEXT,
ADD COLUMN IF NOT EXISTS email_reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_schedule TEXT,
ADD COLUMN IF NOT EXISTS guest_speakers JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS sponsors JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS dress_code TEXT,
ADD COLUMN IF NOT EXISTS required_materials TEXT,
ADD COLUMN IF NOT EXISTS certificate_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS attendance_tracking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS feedback_form_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS qr_checkin_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ticket_download_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS updated_by UUID,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_audience_type ON public.events(audience_type);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.touch_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS touch_events_updated_at ON public.events;
CREATE TRIGGER touch_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_events_updated_at();

-- Create event categories reference table
CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default event categories
INSERT INTO public.event_categories (name, slug, description)
VALUES
  ('Seminar', 'seminar', 'Educational seminars and talks'),
  ('Workshop', 'workshop', 'Hands-on workshops and training'),
  ('Cultural Program', 'cultural-program', 'Cultural events and performances'),
  ('Sports', 'sports', 'Sports events and competitions'),
  ('Examination', 'examination', 'Exams and assessments'),
  ('Holiday', 'holiday', 'Holiday celebrations'),
  ('Meeting', 'meeting', 'Meetings and assemblies'),
  ('Webinar', 'webinar', 'Online webinars'),
  ('Training', 'training', 'Training sessions')
ON CONFLICT DO NOTHING;

-- Create event registrations table for tracking registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT,
  participant_department TEXT,
  participant_student_id TEXT,
  custom_fields JSONB DEFAULT '{}',
  status TEXT DEFAULT 'registered',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations(participant_email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON public.event_registrations(status);

-- Create event attendance table for tracking attendance
CREATE TABLE IF NOT EXISTS public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON public.event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_attended ON public.event_attendance(attended);

-- Create event certificates table
CREATE TABLE IF NOT EXISTS public.event_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  certificate_url TEXT,
  certificate_issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_certificates_event_id ON public.event_certificates(event_id);

-- RLS Policies for new tables (already enabled on events table)
ALTER TABLE IF EXISTS public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.event_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.event_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view registrations for published events
DROP POLICY IF EXISTS "public_view_event_registrations" ON public.event_registrations;
CREATE POLICY "public_view_event_registrations"
  ON public.event_registrations
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events WHERE id = event_id AND published = true
  ));

-- Policy: Admins can manage registrations
DROP POLICY IF EXISTS "admin_manage_event_registrations" ON public.event_registrations;
CREATE POLICY "admin_manage_event_registrations"
  ON public.event_registrations
  FOR ALL
  USING (
    auth.jwt() ->> 'user_id' = (
      SELECT user_id FROM public.admin_roles LIMIT 1
    )
  );

-- Policy: Anyone can view categories
DROP POLICY IF EXISTS "public_view_event_categories" ON public.event_categories;
CREATE POLICY "public_view_event_categories"
  ON public.event_categories
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can manage categories
DROP POLICY IF EXISTS "admin_manage_event_categories" ON public.event_categories;
CREATE POLICY "admin_manage_event_categories"
  ON public.event_categories
  FOR ALL
  USING (
    auth.jwt() ->> 'user_id' = (
      SELECT user_id FROM public.admin_roles LIMIT 1
    )
  );

COMMIT;
