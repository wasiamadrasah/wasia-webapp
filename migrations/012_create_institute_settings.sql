create table if not exists public.institute_settings (
  id text primary key default 'default',
  primary_info jsonb not null default '{}'::jsonb,
  contact_info jsonb not null default '{}'::jsonb,
  social_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint institute_settings_singleton check (id = 'default')
);

create or replace function public.set_institute_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_institute_settings_updated_at on public.institute_settings;
create trigger trg_institute_settings_updated_at
before update on public.institute_settings
for each row execute function public.set_institute_settings_updated_at();

insert into public.institute_settings (id, primary_info, contact_info, social_info)
values (
  'default',
  jsonb_build_object(
    'instituteName', '',
    'instituteNameBn', '',
    'shortForm', '',
    'motto', '',
    'medium', 'Both',
    'establishYear', to_jsonb(null::integer),
    'eiin', '',
    'mpoCode', '',
    'instituteCode', '',
    'instituteType', to_jsonb(null::text),
    'board', '',
    'affiliation', '',
    'logo', '',
    'favicon', ''
  ),
  jsonb_build_object(
    'telephone', '',
    'mobile', '',
    'fax', '',
    'officeHours', '',
    'website', '',
    'email', '',
    'address', '',
    'googleMapEmbed', ''
  ),
  jsonb_build_object(
    'facebook', '',
    'twitter', '',
    'linkedin', '',
    'instagram', '',
    'youtube', '',
    'whatsapp', '',
    'tiktok', '',
    'telegram', ''
  )
)
on conflict (id) do nothing;

update public.institute_settings
set
  primary_info = jsonb_build_object(
    'instituteName', '',
    'instituteNameBn', '',
    'shortForm', '',
    'motto', '',
    'medium', 'Both',
    'establishYear', to_jsonb(null::integer),
    'eiin', '',
    'mpoCode', '',
    'instituteCode', '',
    'instituteType', to_jsonb(null::text),
    'board', '',
    'affiliation', '',
    'logo', '',
    'favicon', ''
  ) || coalesce(primary_info, '{}'::jsonb),
  contact_info = jsonb_build_object(
    'telephone', '',
    'mobile', '',
    'fax', '',
    'officeHours', '',
    'website', '',
    'email', '',
    'address', '',
    'googleMapEmbed', ''
  ) || coalesce(contact_info, '{}'::jsonb),
  social_info = jsonb_build_object(
    'facebook', '',
    'twitter', '',
    'linkedin', '',
    'instagram', '',
    'youtube', '',
    'whatsapp', '',
    'tiktok', '',
    'telegram', ''
  ) || coalesce(social_info, '{}'::jsonb)
where id = 'default';
