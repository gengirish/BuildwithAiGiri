-- Run in Supabase SQL Editor if submissions fail with "phone" column errors.
-- Safe to run multiple times.
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS phone TEXT;
