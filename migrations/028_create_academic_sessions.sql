-- Migration: 028_create_academic_sessions
-- Academic year/session management. Only one session can be active at a time.
-- Enforcement of the single-active-session rule is done in the server action.

CREATE TABLE IF NOT EXISTS academic_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,         -- e.g. "2026", "2025-2026"
  start_date date,
  end_date   date,
  is_active  boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for quickly finding the active session
CREATE INDEX IF NOT EXISTS idx_academic_sessions_is_active
  ON academic_sessions (is_active)
  WHERE is_active = true;

-- Enable RLS (access controlled entirely from server via service role key)
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by server actions)
CREATE POLICY "service_role_full_access_academic_sessions"
  ON academic_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
