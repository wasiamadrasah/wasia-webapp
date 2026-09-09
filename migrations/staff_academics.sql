create table public.staff_academics (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  degree text null,
  institution text null,
  subject text null,
  passing_year integer null,
  duration text null,
  result text null,
  constraint staff_academics_pkey primary key (id),
  constraint staff_academics_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;