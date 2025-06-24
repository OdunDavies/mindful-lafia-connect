
-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Students can view own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Students can update own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Students can insert own profile" ON public.student_profiles;

DROP POLICY IF EXISTS "Counsellors can view own profile" ON public.counsellor_profiles;
DROP POLICY IF EXISTS "Counsellors can update own profile" ON public.counsellor_profiles;
DROP POLICY IF EXISTS "Counsellors can insert own profile" ON public.counsellor_profiles;

-- Create security definer function to safely get current user ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new, safe RLS policies for profiles
CREATE POLICY "Enable read access for users on own profile" ON public.profiles
  FOR SELECT USING (id = public.get_current_user_id());

CREATE POLICY "Enable update access for users on own profile" ON public.profiles
  FOR UPDATE USING (id = public.get_current_user_id());

CREATE POLICY "Enable insert access for users on own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = public.get_current_user_id());

-- Create new, safe RLS policies for student_profiles
CREATE POLICY "Enable read access for students on own profile" ON public.student_profiles
  FOR SELECT USING (id = public.get_current_user_id());

CREATE POLICY "Enable update access for students on own profile" ON public.student_profiles
  FOR UPDATE USING (id = public.get_current_user_id());

CREATE POLICY "Enable insert access for students on own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (id = public.get_current_user_id());

-- Create new, safe RLS policies for counsellor_profiles
CREATE POLICY "Enable read access for counsellors on own profile" ON public.counsellor_profiles
  FOR SELECT USING (id = public.get_current_user_id());

CREATE POLICY "Enable update access for counsellors on own profile" ON public.counsellor_profiles
  FOR UPDATE USING (id = public.get_current_user_id());

CREATE POLICY "Enable insert access for counsellors on own profile" ON public.counsellor_profiles
  FOR INSERT WITH CHECK (id = public.get_current_user_id());

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_profiles ENABLE ROW LEVEL SECURITY;
