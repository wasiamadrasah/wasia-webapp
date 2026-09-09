-- Migration: Remove start_date and end_date from exams table
-- Description: The dates are managed via the dedicated scheduling system instead.

ALTER TABLE exams 
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date;
