-- Create login activities table to track admin login events
CREATE TABLE IF NOT EXISTS public.login_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  username TEXT,
  email TEXT NOT NULL,
  login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  logout_time TIMESTAMPTZ,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  device_name TEXT,
  browser TEXT,
  os TEXT,
  user_agent TEXT,
  login_status TEXT NOT NULL DEFAULT 'success', -- 'success', 'failed'
  failure_reason TEXT,
  duration_seconds INTEGER, -- session duration in seconds
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_login_activities_admin_id ON public.login_activities(admin_id);
CREATE INDEX IF NOT EXISTS idx_login_activities_login_time ON public.login_activities(login_time DESC);
CREATE INDEX IF NOT EXISTS idx_login_activities_email ON public.login_activities(email);
CREATE INDEX IF NOT EXISTS idx_login_activities_ip_address ON public.login_activities(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_activities_device_type ON public.login_activities(device_type);

-- Set up RLS policies
ALTER TABLE public.login_activities ENABLE ROW LEVEL SECURITY;

-- Allow admins to view their own login activities
CREATE POLICY "Admins can view their own login activities"
  ON public.login_activities
  FOR SELECT
  USING (
    auth.uid()::text = admin_id::text OR 
    (SELECT role FROM public.admins WHERE id = auth.uid())::text = 'admin'
  );

-- Allow system to insert login activities
CREATE POLICY "System can insert login activities"
  ON public.login_activities
  FOR INSERT
  WITH CHECK (true);

-- Allow system to update login activities
CREATE POLICY "System can update login activities"
  ON public.login_activities
  FOR UPDATE
  WITH CHECK (true);
