create table public.staff_accounts (
  id uuid not null default gen_random_uuid (),
  staff_id uuid null,
  email text null,
  password_hash text null,
  role text null default 'teacher'::text,
  status text null default 'active'::text,
  created_at timestamp without time zone null default now(),
  constraint staff_accounts_pkey primary key (id),
  constraint staff_accounts_email_key unique (email),
  constraint staff_accounts_staff_id_fkey foreign KEY (staff_id) references staffs (id) on delete CASCADE
) TABLESPACE pg_default;