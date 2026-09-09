-- Harden notice/category consistency and publishing timestamps.
-- Safe to run multiple times.

-- 1) Backfill published_at for already-published notices.
UPDATE public.notices
SET published_at = COALESCE(publish_date, created_at, NOW())
WHERE published = true
  AND published_at IS NULL;

-- 2) Normalize existing notice_type values.
UPDATE public.notices
SET notice_type = LOWER(TRIM(COALESCE(notice_type, 'general')))
WHERE notice_type IS NULL
   OR notice_type <> LOWER(TRIM(COALESCE(notice_type, 'general')));

-- 3) Trigger: normalize notice_type on insert/update.
CREATE OR REPLACE FUNCTION public.normalize_notice_type()
RETURNS TRIGGER AS $$
BEGIN
  NEW.notice_type := LOWER(TRIM(COALESCE(NEW.notice_type, 'general')));

  IF NEW.notice_type = '' THEN
    NEW.notice_type := 'general';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notices_normalize_notice_type ON public.notices;
CREATE TRIGGER trg_notices_normalize_notice_type
BEFORE INSERT OR UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.normalize_notice_type();

-- 4) Trigger: keep published_at in sync with published + publish_date.
CREATE OR REPLACE FUNCTION public.sync_notices_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true THEN
    IF NEW.published_at IS NULL THEN
      NEW.published_at := COALESCE(NEW.publish_date, NOW());
    END IF;
  ELSE
    NEW.published_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notices_sync_published_at ON public.notices;
CREATE TRIGGER trg_notices_sync_published_at
BEFORE INSERT OR UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.sync_notices_published_at();

-- 5) Optional index for frequent category filtering.
CREATE INDEX IF NOT EXISTS idx_notices_notice_type_lower
ON public.notices ((LOWER(notice_type)));
