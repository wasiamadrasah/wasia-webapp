-- Drop the NOT NULL constraints on religion and date_of_birth columns in public.students table
ALTER TABLE public.students ALTER COLUMN religion DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN date_of_birth DROP NOT NULL;
