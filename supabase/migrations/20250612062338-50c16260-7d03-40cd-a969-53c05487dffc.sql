
-- Remove profile-related tables and data
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.counsellor_profiles CASCADE;

-- Remove profile-related columns from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_image_url;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_online;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_seen;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS total_sessions;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS completed_sessions;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS cancelled_sessions;

-- Update profiles table to keep only essential fields
-- Keep: id, email, first_name, last_name, phone, user_type, created_at, updated_at
