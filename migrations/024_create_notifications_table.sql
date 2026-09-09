-- Create notification tables with role-based targeting
-- For internal notifications visible to registered users based on their role

CREATE TABLE IF NOT EXISTS public.notification_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure a default category always exists
INSERT INTO public.notification_categories (name, is_active)
VALUES ('general', true)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  target_role TEXT NOT NULL DEFAULT 'all', -- 'all', 'teacher', 'student', 'parent', etc.
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id TEXT,
  author_name TEXT
);

CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_target_role ON public.notifications(target_role);
CREATE INDEX IF NOT EXISTS idx_notifications_published ON public.notifications(published);
CREATE INDEX IF NOT EXISTS idx_notifications_published_at ON public.notifications(published_at);
CREATE INDEX IF NOT EXISTS idx_notification_categories_name ON public.notification_categories(name);
CREATE INDEX IF NOT EXISTS idx_notification_categories_active ON public.notification_categories(is_active);

-- Keep updated_at fresh on updates
CREATE OR REPLACE FUNCTION public.touch_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.touch_notifications_updated_at();

DROP TRIGGER IF EXISTS trg_notification_categories_updated_at ON public.notification_categories;
CREATE TRIGGER trg_notification_categories_updated_at
BEFORE UPDATE ON public.notification_categories
FOR EACH ROW
EXECUTE FUNCTION public.touch_notifications_updated_at();
