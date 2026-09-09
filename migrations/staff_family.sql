create table public.staff_family (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  name text null,
  relationship text null,
  date_of_birth date null,
  age integer null,
  blood_group text null,
  remark text null,
  constraint staff_family_pkey primary key (id),
  constraint staff_family_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;