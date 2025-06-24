
-- Create student_profiles table to store student-specific information
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  student_id TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counsellor_profiles table to store counsellor-specific information
CREATE TABLE IF NOT EXISTS public.counsellor_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  experience TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_profiles
CREATE POLICY "Students can view own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Counsellors can view student profiles" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'counsellor'
    )
  );

-- RLS Policies for counsellor_profiles
CREATE POLICY "Counsellors can view own profile" ON public.counsellor_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Counsellors can update own profile" ON public.counsellor_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counsellors can insert own profile" ON public.counsellor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can view counsellor profiles" ON public.counsellor_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'student'
    )
  );

-- Add unique constraint on student_id
ALTER TABLE public.student_profiles ADD CONSTRAINT unique_student_id UNIQUE (student_id);

-- Add unique constraint on license_number
ALTER TABLE public.counsellor_profiles ADD CONSTRAINT unique_license_number UNIQUE (license_number);
