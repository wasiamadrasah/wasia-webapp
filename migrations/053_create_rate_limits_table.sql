-- Create rate limits table to track API usage statefully
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key VARCHAR PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_time TIMESTAMPTZ NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Grant service_role full management permissions
CREATE POLICY "Service role full access" ON public.rate_limits
  FOR ALL TO service_role USING (true) WITH CHECK (true);
