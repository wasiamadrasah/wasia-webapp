create table public.staff_experience (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  institute_name text null,
  location text null,
  designation text null,
  subject text null,
  employment_type text null,
  start_date date null,
  end_date date null,
  currently_working boolean null,
  constraint staff_experience_pkey primary key (id),
  constraint staff_experience_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;