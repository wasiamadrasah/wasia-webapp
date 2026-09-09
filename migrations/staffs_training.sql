create table public.staff_training (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  training_name text null,
  training_institute text null,
  year integer null,
  duration text null,
  subject text null,
  constraint staff_training_pkey primary key (id),
  constraint staff_training_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;