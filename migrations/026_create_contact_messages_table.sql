-- Create contact_messages table (professional-grade with future scalability)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sender Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Message Content
  category TEXT NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Admin Tracking
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'normal',
  assigned_to UUID,
  
  -- Response Tracking
  first_response_at TIMESTAMPTZ,
  last_response_at TIMESTAMPTZ,
  total_responses INTEGER DEFAULT 0,
  is_responded BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION update_contact_messages_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_contact_messages_category ON public.contact_messages(category) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON public.contact_messages(priority) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned_to ON public.contact_messages(assigned_to) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_priority ON public.contact_messages(status, priority DESC) WHERE NOT is_deleted;

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public contact form)
CREATE POLICY "allow_public_insert_contact_messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admin and super_admin can read
CREATE POLICY "allow_admin_read_contact_messages" ON public.contact_messages
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id::text = auth.uid()::text
      AND role IN ('super_admin', 'admin')
    )
  );

-- Only admin and super_admin can update
CREATE POLICY "allow_admin_update_contact_messages" ON public.contact_messages
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id::text = auth.uid()::text
      AND role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id::text = auth.uid()::text
      AND role IN ('super_admin', 'admin')
    )
  );

-- Create separate table for message responses (email system integration)
CREATE TABLE IF NOT EXISTS public.contact_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL,
  response_text TEXT NOT NULL,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update for responses table
CREATE TRIGGER contact_responses_updated_at
BEFORE UPDATE ON public.contact_responses
FOR EACH ROW
EXECUTE FUNCTION update_contact_messages_updated_at();

-- Indexes for responses
CREATE INDEX IF NOT EXISTS idx_contact_responses_message_id ON public.contact_responses(message_id);
CREATE INDEX IF NOT EXISTS idx_contact_responses_admin_id ON public.contact_responses(admin_id);
CREATE INDEX IF NOT EXISTS idx_contact_responses_created_at ON public.contact_responses(created_at DESC);

-- Enable RLS for responses
ALTER TABLE public.contact_responses ENABLE ROW LEVEL SECURITY;

-- Only admin and super_admin can manage responses
CREATE POLICY "allow_admin_manage_responses" ON public.contact_responses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id::text = auth.uid()::text
      AND role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id::text = auth.uid()::text
      AND role IN ('super_admin', 'admin')
    )
  );
