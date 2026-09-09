-- Academic Programs Table
create table if not exists public.homepage_academic_programs (
  id uuid primary key default gen_random_uuid(),
  program_name text not null,
  program_slug text not null unique,
  description text,
  icon_key text not null default 'book-open',
  link_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_academic_programs_order_idx
  on public.homepage_academic_programs (display_order asc, created_at desc);

-- Stats Table
create table if not exists public.homepage_stats (
  id uuid primary key default gen_random_uuid(),
  stat_label text not null,
  stat_slug text not null unique,
  stat_value integer not null default 0,
  stat_suffix text not null default '',
  description text,
  icon_key text not null default 'users',
  color_scheme text not null default 'emerald',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_stats_order_idx
  on public.homepage_stats (display_order asc, created_at desc);

-- Footer Links Table
create table if not exists public.footer_link_sections (
  id uuid primary key default gen_random_uuid(),
  section_name text not null,
  section_slug text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists footer_link_sections_order_idx
  on public.footer_link_sections (display_order asc, created_at desc);

-- Footer Links Items Table
create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.footer_link_sections(id) on delete cascade,
  link_label text not null,
  link_url text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists footer_links_section_idx
  on public.footer_links (section_id);

create index if not exists footer_links_order_idx
  on public.footer_links (section_id, display_order asc);

-- Triggers for updated_at
create or replace function public.set_homepage_academic_programs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_homepage_academic_programs_updated_at on public.homepage_academic_programs;
create trigger trg_homepage_academic_programs_updated_at
before update on public.homepage_academic_programs
for each row execute function public.set_homepage_academic_programs_updated_at();

create or replace function public.set_homepage_stats_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_homepage_stats_updated_at on public.homepage_stats;
create trigger trg_homepage_stats_updated_at
before update on public.homepage_stats
for each row execute function public.set_homepage_stats_updated_at();

create or replace function public.set_footer_link_sections_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_footer_link_sections_updated_at on public.footer_link_sections;
create trigger trg_footer_link_sections_updated_at
before update on public.footer_link_sections
for each row execute function public.set_footer_link_sections_updated_at();

-- Seed initial data
insert into public.homepage_academic_programs (program_name, program_slug, description, icon_key, link_url, display_order, is_active)
values
  ('Science', 'science', 'Physics, Chemistry, Biology, Mathematics', 'book-open', '#', 1, true),
  ('Arts', 'arts', 'Literature, History, Philosophy, Languages', 'graduation-cap', '#', 2, true),
  ('Commerce', 'commerce', 'Accounting, Economics, Business Studies', 'bar-chart-3', '#', 3, true),
  ('Computer Science', 'computer-science', 'Programming, Web Development, AI', 'zap', '#', 4, true),
  ('Sports', 'sports', 'Cricket, Football, Athletics, Indoor Games', 'award', '#', 5, true),
  ('Extracurriculars', 'extracurriculars', 'Music, Arts, Tech Club, Debate', 'sparkles', '#', 6, true)
on conflict (program_slug) do nothing;

insert into public.homepage_stats (stat_label, stat_slug, stat_value, stat_suffix, description, icon_key, color_scheme, display_order, is_active)
values
  ('Students Enrolled', 'students-enrolled', 5000, '+', 'A vibrant student community growing across every grade.', 'users', 'emerald', 1, true),
  ('Qualified Teachers', 'qualified-teachers', 200, '+', 'Experienced educators mentoring with care and rigor.', 'graduation-cap', 'cyan', 2, true),
  ('Success Rate', 'success-rate', 95, '%', 'Consistent academic outcomes backed by focused support.', 'award', 'amber', 3, true),
  ('Years Legacy', 'years-legacy', 50, '+', 'A long-standing culture of excellence and trust.', 'sparkles', 'rose', 4, true)
on conflict (stat_slug) do nothing;

insert into public.footer_link_sections (section_name, section_slug, display_order, is_active)
values
  ('Quick Links', 'quick-links', 1, true),
  ('Academics', 'academics', 2, true)
on conflict (section_slug) do nothing;

-- Insert footer links for "Quick Links" section
with qls as (select id from public.footer_link_sections where section_slug = 'quick-links' limit 1)
insert into public.footer_links (section_id, link_label, link_url, display_order, is_active)
select
  qls.id,
  link_label,
  link_url,
  display_order,
  true
from (
  values
    ('About Us', '/about', 1),
    ('Teachers', '/teachers', 2),
    ('Notices', '/notices', 3),
    ('Events', '/events', 4),
    ('Gallery', '/gallery', 5)
) as v(link_label, link_url, display_order), qls
where not exists (
  select 1 from public.footer_links where section_id = qls.id
);

-- Insert footer links for "Academics" section  
with acs as (select id from public.footer_link_sections where section_slug = 'academics' limit 1)
insert into public.footer_links (section_id, link_label, link_url, display_order, is_active)
select
  acs.id,
  link_label,
  link_url,
  display_order,
  true
from (
  values
    ('Admission', '/admission', 1),
    ('Results', '/results', 2),
    ('News', '/news', 3),
    ('FAQ', '/faq', 4),
    ('Policies', '/policies', 5)
) as v(link_label, link_url, display_order), acs
where not exists (
  select 1 from public.footer_links where section_id = acs.id
);
