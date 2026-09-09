create table public.staff_addresses (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  address_type text null,
  house text null,
  road text null,
  area text null,
  post_office text null,
  post_code text null,
  thana text null,
  district text null,
  constraint staff_addresses_pkey primary key (id),
  constraint staff_addresses_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;