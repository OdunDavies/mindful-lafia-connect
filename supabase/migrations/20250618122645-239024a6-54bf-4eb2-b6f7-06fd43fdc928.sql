
-- Drop all existing problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Enable read access for users on own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update access for users on own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert access for users on own profile" ON public.profiles;

-- Create simple, non-recursive RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Also fix the student and counsellor profile policies to avoid recursion
DROP POLICY IF EXISTS "Enable read access for students on own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Enable update access for students on own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Enable insert access for students on own profile" ON public.student_profiles;

DROP POLICY IF EXISTS "Enable read access for counsellors on own profile" ON public.counsellor_profiles;
DROP POLICY IF EXISTS "Enable update access for counsellors on own profile" ON public.counsellor_profiles;
DROP POLICY IF EXISTS "Enable insert access for counsellors on own profile" ON public.counsellor_profiles;

-- Create simple RLS policies for student_profiles
CREATE POLICY "Students can view own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create simple RLS policies for counsellor_profiles
CREATE POLICY "Counsellors can view own profile" ON public.counsellor_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Counsellors can update own profile" ON public.counsellor_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counsellors can insert own profile" ON public.counsellor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_profiles ENABLE ROW LEVEL SECURITY;
