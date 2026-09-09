-- Create news and blogs modules based on notice publishing model.
-- Safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  featured_image_url TEXT,
  publish_date TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  featured_image_url TEXT,
  publish_date TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.news_posts
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';

ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';

CREATE TABLE IF NOT EXISTS public.news_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

UPDATE public.news_posts
SET category = LOWER(TRIM(COALESCE(category, 'general')))
WHERE category IS NULL
   OR category <> LOWER(TRIM(COALESCE(category, 'general')));

UPDATE public.blog_posts
SET category = LOWER(TRIM(COALESCE(category, 'general')))
WHERE category IS NULL
   OR category <> LOWER(TRIM(COALESCE(category, 'general')));

UPDATE public.news_posts
SET category = 'general'
WHERE category = '';

UPDATE public.blog_posts
SET category = 'general'
WHERE category = '';

INSERT INTO public.news_categories (name, is_active)
VALUES ('general', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.blog_categories (name, is_active)
VALUES ('general', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.news_categories (name, is_active)
SELECT DISTINCT category, true
FROM public.news_posts
WHERE category IS NOT NULL AND category <> ''
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.blog_categories (name, is_active)
SELECT DISTINCT category, true
FROM public.blog_posts
WHERE category IS NOT NULL AND category <> ''
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_news_posts_published ON public.news_posts(published);
CREATE INDEX IF NOT EXISTS idx_news_posts_publish_date ON public.news_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_news_posts_category ON public.news_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON public.blog_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_news_categories_name ON public.news_categories(name);
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON public.blog_categories(name);

CREATE OR REPLACE FUNCTION public.touch_news_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_news_posts_updated_at ON public.news_posts;
CREATE TRIGGER trg_news_posts_updated_at
BEFORE UPDATE ON public.news_posts
FOR EACH ROW
EXECUTE FUNCTION public.touch_news_posts_updated_at();

CREATE OR REPLACE FUNCTION public.touch_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.touch_blog_posts_updated_at();

CREATE OR REPLACE FUNCTION public.touch_news_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_news_categories_updated_at ON public.news_categories;
CREATE TRIGGER trg_news_categories_updated_at
BEFORE UPDATE ON public.news_categories
FOR EACH ROW
EXECUTE FUNCTION public.touch_news_categories_updated_at();

CREATE OR REPLACE FUNCTION public.touch_blog_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_categories_updated_at ON public.blog_categories;
CREATE TRIGGER trg_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION public.touch_blog_categories_updated_at();

CREATE OR REPLACE FUNCTION public.normalize_news_post_category()
RETURNS TRIGGER AS $$
BEGIN
  NEW.category := LOWER(TRIM(COALESCE(NEW.category, 'general')));
  IF NEW.category = '' THEN
    NEW.category := 'general';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_news_posts_normalize_category ON public.news_posts;
CREATE TRIGGER trg_news_posts_normalize_category
BEFORE INSERT OR UPDATE ON public.news_posts
FOR EACH ROW
EXECUTE FUNCTION public.normalize_news_post_category();

CREATE OR REPLACE FUNCTION public.normalize_blog_post_category()
RETURNS TRIGGER AS $$
BEGIN
  NEW.category := LOWER(TRIM(COALESCE(NEW.category, 'general')));
  IF NEW.category = '' THEN
    NEW.category := 'general';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_posts_normalize_category ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_normalize_category
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.normalize_blog_post_category();

CREATE OR REPLACE FUNCTION public.sync_news_posts_published_at()
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

DROP TRIGGER IF EXISTS trg_news_posts_sync_published_at ON public.news_posts;
CREATE TRIGGER trg_news_posts_sync_published_at
BEFORE INSERT OR UPDATE ON public.news_posts
FOR EACH ROW
EXECUTE FUNCTION public.sync_news_posts_published_at();

CREATE OR REPLACE FUNCTION public.sync_blog_posts_published_at()
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

DROP TRIGGER IF EXISTS trg_blog_posts_sync_published_at ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_sync_published_at
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.sync_blog_posts_published_at();
