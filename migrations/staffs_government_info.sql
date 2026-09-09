create table public.staff_government_info (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  ntrca_registration text null,
  mpo_date date null,
  pds_id text null,
  index_number text null,
  first_joining_date date null,
  appointment_letter_no text null,
  constraint staff_government_info_pkey primary key (id),
  constraint staff_government_info_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;