-- ============================================================================
-- Enable RLS on all public schema tables
-- ============================================================================
-- Why: Supabase Security Advisor reports critical issues when RLS is disabled
-- on any table in the exposed `public` schema.
--
-- This migration is idempotent and resilient:
-- - Enables RLS for every regular table in `public`
-- - Skips tables it cannot alter (logs a NOTICE)
-- ============================================================================

BEGIN;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema_name, c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
  LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY',
        r.schema_name,
        r.table_name
      );
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Skipping %.%: %', r.schema_name, r.table_name, SQLERRM;
    END;
  END LOOP;
END $$;

COMMIT;
