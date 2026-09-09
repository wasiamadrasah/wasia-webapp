-- Add author_id and views columns to notices, news_posts, and blog_posts
-- author_id references the staff_accounts user who created the post
-- views tracks the public view count

-- Add columns to notices table
ALTER TABLE public.notices
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.staff_accounts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Add columns to news_posts table
ALTER TABLE public.news_posts
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.staff_accounts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Add columns to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.staff_accounts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notices_author_id ON public.notices(author_id);
CREATE INDEX IF NOT EXISTS idx_notices_views ON public.notices(views);
CREATE INDEX IF NOT EXISTS idx_news_posts_author_id ON public.news_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_news_posts_views ON public.news_posts(views);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON public.blog_posts(views);
