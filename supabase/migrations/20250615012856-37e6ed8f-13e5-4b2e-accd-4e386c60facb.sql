
-- Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix student_profiles RLS policies
DROP POLICY IF EXISTS "Students can view own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Students can update own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Students can insert own profile" ON public.student_profiles;

CREATE POLICY "Students can view own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix counsellor_profiles RLS policies  
DROP POLICY IF EXISTS "Counsellors can view own profile" ON public.counsellor_profiles;
DROP POLICY IF EXISTS "Counsellors can update own profile" ON public.counsellor_profiles;
DROP POLICY IF EXISTS "Counsellors can insert own profile" ON public.counsellor_profiles;

CREATE POLICY "Counsellors can view own profile" ON public.counsellor_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Counsellors can update own profile" ON public.counsellor_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counsellors can insert own profile" ON public.counsellor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Make sure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_profiles ENABLE ROW LEVEL SECURITY;
