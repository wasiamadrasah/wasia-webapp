create table if not exists public.homepage_leadership_cards (
  id uuid primary key default gen_random_uuid(),
  role_slug text not null unique,
  role_title text not null,
  staff_id uuid references public.staffs(id) on delete set null,
  leader_name text,
  leader_photo_url text,
  leader_message text,
  subtitle text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.homepage_leadership_cards
  add column if not exists leader_name text;

alter table if exists public.homepage_leadership_cards
  add column if not exists leader_photo_url text;

alter table if exists public.homepage_leadership_cards
  add column if not exists leader_message text;

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

insert into public.homepage_leadership_cards (role_slug, role_title, leader_name, leader_photo_url, leader_message, subtitle, display_order, is_active)
values
  (
    'president',
    'President',
    'President',
    null,
    'Education is not only about academic results; it is about shaping people with values, confidence, and responsibility.',
    'Building character, excellence, and a future-ready school culture.',
    1,
    true
  ),
  (
    'chief-education-officer',
    'Chief Education Officer',
    'Chief Education Officer',
    null,
    'Our academic vision focuses on high standards, critical thinking, and practical learning experiences.',
    'Academic quality, innovation, and continuous development for every learner.',
    2,
    true
  ),
  (
    'headmaster',
    'Headmaster',
    'Headmaster',
    null,
    'Our classrooms are designed to encourage curiosity, consistency, and respect for learning.',
    'Nurturing discipline, curiosity, and all-round growth in daily school life.',
    3,
    true
  )
on conflict (role_slug) do update
set role_title = excluded.role_title,
    leader_name = excluded.leader_name,
    leader_photo_url = excluded.leader_photo_url,
    leader_message = excluded.leader_message,
    subtitle = excluded.subtitle,
    display_order = excluded.display_order,
    is_active = excluded.is_active;