-- Store a display-name snapshot for post creators and add an atomic view increment helper.
-- Safe to run multiple times.

ALTER TABLE public.notices
ADD COLUMN IF NOT EXISTS author_name TEXT;

ALTER TABLE public.news_posts
ADD COLUMN IF NOT EXISTS author_name TEXT;

ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS author_name TEXT;

UPDATE public.notices AS post
SET author_name = COALESCE(NULLIF(BTRIM(staff.full_name_en), ''), account.email)
FROM public.staff_accounts AS account
LEFT JOIN public.staffs AS staff ON staff.id = account.staff_id
WHERE post.author_id = account.id
  AND post.author_name IS NULL;

UPDATE public.news_posts AS post
SET author_name = COALESCE(NULLIF(BTRIM(staff.full_name_en), ''), account.email)
FROM public.staff_accounts AS account
LEFT JOIN public.staffs AS staff ON staff.id = account.staff_id
WHERE post.author_id = account.id
  AND post.author_name IS NULL;

UPDATE public.blog_posts AS post
SET author_name = COALESCE(NULLIF(BTRIM(staff.full_name_en), ''), account.email)
FROM public.staff_accounts AS account
LEFT JOIN public.staffs AS staff ON staff.id = account.staff_id
WHERE post.author_id = account.id
  AND post.author_name IS NULL;

CREATE OR REPLACE FUNCTION public.increment_content_view_count(
  target_table TEXT,
  target_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_views INTEGER;
BEGIN
  IF target_table = 'notices' THEN
    UPDATE public.notices
    SET views = COALESCE(views, 0) + 1
    WHERE id = target_id
      AND (published = true OR published_at IS NOT NULL)
    RETURNING views INTO next_views;
  ELSIF target_table = 'news_posts' THEN
    UPDATE public.news_posts
    SET views = COALESCE(views, 0) + 1
    WHERE id = target_id
      AND (published = true OR published_at IS NOT NULL)
    RETURNING views INTO next_views;
  ELSIF target_table = 'blog_posts' THEN
    UPDATE public.blog_posts
    SET views = COALESCE(views, 0) + 1
    WHERE id = target_id
      AND (published = true OR published_at IS NOT NULL)
    RETURNING views INTO next_views;
  ELSE
    RAISE EXCEPTION 'Unsupported content table: %', target_table;
  END IF;

  RETURN next_views;
END;
$$;
