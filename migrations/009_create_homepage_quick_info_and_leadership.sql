create table if not exists public.homepage_quick_info_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null,
  icon_key text not null default 'sparkles',
  link_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_quick_info_items_order_idx
  on public.homepage_quick_info_items (display_order asc, created_at desc);

create or replace function public.set_homepage_quick_info_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_homepage_quick_info_items_updated_at on public.homepage_quick_info_items;
create trigger trg_homepage_quick_info_items_updated_at
before update on public.homepage_quick_info_items
for each row execute function public.set_homepage_quick_info_items_updated_at();

insert into public.homepage_quick_info_items (title, subtitle, icon_key, link_url, display_order, is_active)
values
  ('Admission Open', 'Session 2026-2027', 'book-open', '/admission', 1, true),
  ('Accredited', 'Govt. Approved', 'award', '/about', 2, true),
  ('Classes Start', 'March 1, 2026', 'calendar', '/admission', 3, true),
  ('Scholarships', 'Up to 100% Tuition', 'heart', '/admission', 4, true)
on conflict do nothing;

create table if not exists public.homepage_leadership_cards (
  id uuid primary key default gen_random_uuid(),
  role_slug text not null unique,
  role_title text not null,
  staff_id uuid references public.staffs(id) on delete set null,
  subtitle text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_leadership_cards_order_idx
  on public.homepage_leadership_cards (display_order asc, created_at desc);

create or replace function public.set_homepage_leadership_cards_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_homepage_leadership_cards_updated_at on public.homepage_leadership_cards;
create trigger trg_homepage_leadership_cards_updated_at
before update on public.homepage_leadership_cards
for each row execute function public.set_homepage_leadership_cards_updated_at();

insert into public.homepage_leadership_cards (role_slug, role_title, subtitle, display_order, is_active)
values
  ('president', 'President', 'Building character, excellence, and a future-ready school culture.', 1, true),
  ('chief-education-officer', 'Chief Education Officer', 'Academic quality, innovation, and continuous development for every learner.', 2, true),
  ('headmaster', 'Headmaster', 'Nurturing discipline, curiosity, and all-round growth in daily school life.', 3, true)
on conflict (role_slug) do update
set role_title = excluded.role_title,
    subtitle = excluded.subtitle,
    display_order = excluded.display_order,
    is_active = excluded.is_active;
