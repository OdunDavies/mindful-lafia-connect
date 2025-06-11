
-- Create self_assessments table
CREATE TABLE public.self_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
  responses JSONB NOT NULL,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add online status and profile completion to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_online BOOLEAN DEFAULT FALSE,
ADD COLUMN bio TEXT,
ADD COLUMN profile_image_url TEXT,
ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add session statistics columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN total_sessions INTEGER DEFAULT 0,
ADD COLUMN completed_sessions INTEGER DEFAULT 0,
ADD COLUMN cancelled_sessions INTEGER DEFAULT 0;

-- Add specializations and availability to counsellor_profiles
ALTER TABLE public.counsellor_profiles 
ADD COLUMN availability_hours JSONB DEFAULT '{}',
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN bio TEXT;

-- Add department and academic info to student_profiles  
ALTER TABLE public.student_profiles 
ADD COLUMN academic_year TEXT,
ADD COLUMN emergency_contact TEXT,
ADD COLUMN emergency_phone TEXT;

-- Enable RLS on self_assessments
ALTER TABLE public.self_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for self_assessments
CREATE POLICY "Students can view their own assessments" ON public.self_assessments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own assessments" ON public.self_assessments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Counsellors can view student assessments" ON public.self_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'counsellor'
    )
  );

-- Function to update session statistics
CREATE OR REPLACE FUNCTION update_session_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update statistics for both student and counsellor
  IF TG_OP = 'INSERT' THEN
    -- Increment total sessions
    UPDATE public.profiles 
    SET total_sessions = total_sessions + 1 
    WHERE id = NEW.student_id OR id = NEW.counsellor_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- Update completed/cancelled sessions based on status change
    IF NEW.status = 'completed' THEN
      UPDATE public.profiles 
      SET completed_sessions = completed_sessions + 1 
      WHERE id = NEW.student_id OR id = NEW.counsellor_id;
    ELSIF NEW.status = 'cancelled' THEN
      UPDATE public.profiles 
      SET cancelled_sessions = cancelled_sessions + 1 
      WHERE id = NEW.student_id OR id = NEW.counsellor_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update session statistics
CREATE TRIGGER update_session_stats_trigger
  AFTER INSERT OR UPDATE ON public.counselling_sessions
  FOR EACH ROW EXECUTE FUNCTION update_session_statistics();

-- Function to update last seen timestamp
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET last_seen = NOW() 
  WHERE id = auth.uid();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
