
-- Add metadata columns to the profiles table for counsellors
ALTER TABLE public.profiles 
ADD COLUMN specialization TEXT,
ADD COLUMN license_number TEXT,
ADD COLUMN experience TEXT,
ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE;

-- Add metadata columns to the profiles table for students  
ALTER TABLE public.profiles
ADD COLUMN student_id TEXT,
ADD COLUMN department TEXT,
ADD COLUMN level TEXT;

-- Add session statistics columns for both user types
ALTER TABLE public.profiles
ADD COLUMN total_sessions INTEGER DEFAULT 0,
ADD COLUMN completed_sessions INTEGER DEFAULT 0,
ADD COLUMN cancelled_sessions INTEGER DEFAULT 0,
ADD COLUMN active_sessions INTEGER DEFAULT 0;

-- Update the handle_new_user function to include the new metadata fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    user_type,
    phone,
    email_verified,
    -- Counsellor metadata
    specialization,
    license_number,
    experience,
    -- Student metadata  
    student_id,
    department,
    level,
    -- Session statistics
    total_sessions,
    completed_sessions,
    cancelled_sessions,
    active_sessions
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    NEW.raw_user_meta_data->>'phone',
    NEW.email_confirmed_at IS NOT NULL,
    -- Counsellor metadata from signup
    NEW.raw_user_meta_data->>'specialization',
    NEW.raw_user_meta_data->>'license_number', 
    NEW.raw_user_meta_data->>'experience',
    -- Student metadata from signup
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'level',
    -- Initialize session statistics
    0,
    0,
    0,
    0
  );
  RETURN NEW;
END;
$function$;

-- Create trigger to update last_seen when user performs actions
CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.profiles 
  SET last_seen = NOW() 
  WHERE id = auth.uid();
  RETURN NULL;
END;
$function$;

-- Create trigger for updating session statistics
CREATE OR REPLACE FUNCTION public.update_session_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- Create triggers
CREATE TRIGGER on_counselling_session_change
  AFTER INSERT OR UPDATE ON public.counselling_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_session_statistics();

CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_last_seen();
