
-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'counsellor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student-specific information
CREATE TABLE public.student_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  level TEXT NOT NULL
);

-- Counsellor-specific information  
CREATE TABLE public.counsellor_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  experience TEXT NOT NULL
);

-- Sessions table for counselling sessions
CREATE TABLE public.counselling_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  counsellor_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for chat functionality
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.counselling_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counsellors can view student profiles" ON public.profiles
  FOR SELECT USING (
    user_type = 'student' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'counsellor'
    )
  );

-- RLS Policies for student profiles
CREATE POLICY "Students can view own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counsellors can view student profiles" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'counsellor'
    )
  );

-- RLS Policies for counsellor profiles
CREATE POLICY "Counsellors can view own profile" ON public.counsellor_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Counsellors can update own profile" ON public.counsellor_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can view counsellor profiles" ON public.counsellor_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'student'
    )
  );

-- RLS Policies for counselling sessions
CREATE POLICY "Users can view their own sessions" ON public.counselling_sessions
  FOR SELECT USING (
    auth.uid() = student_id OR auth.uid() = counsellor_id
  );

CREATE POLICY "Students can create sessions" ON public.counselling_sessions
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'student'
    )
  );

CREATE POLICY "Counsellors can update sessions" ON public.counselling_sessions
  FOR UPDATE USING (
    auth.uid() = counsellor_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'counsellor'
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their sessions" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.counselling_sessions cs
      WHERE cs.id = session_id 
      AND (cs.student_id = auth.uid() OR cs.counsellor_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their sessions" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.counselling_sessions cs
      WHERE cs.id = session_id 
      AND (cs.student_id = auth.uid() OR cs.counsellor_id = auth.uid())
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
