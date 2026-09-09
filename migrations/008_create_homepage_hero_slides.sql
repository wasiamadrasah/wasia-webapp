create table if not exists public.homepage_hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_hero_slides_order_idx
  on public.homepage_hero_slides (display_order asc, created_at desc);

create or replace function public.set_homepage_hero_slides_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_homepage_hero_slides_updated_at on public.homepage_hero_slides;
create trigger trg_homepage_hero_slides_updated_at
before update on public.homepage_hero_slides
for each row execute function public.set_homepage_hero_slides_updated_at();
