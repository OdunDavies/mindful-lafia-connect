/*
  # Enhanced Profile System for Counsellors and Students

  1. New Tables
    - `profile_metadata` - Store additional profile information for both students and counsellors
    - `chat_sessions` - Dedicated table for chat-only sessions
    - `user_availability` - Track counsellor availability status

  2. Security
    - Enable RLS on all new tables
    - Add policies for appropriate access control

  3. Changes
    - Add metadata storage for profile information
    - Enhance chat functionality with dedicated sessions
    - Add availability tracking for counsellors
*/

-- Create profile_metadata table to store additional information
CREATE TABLE IF NOT EXISTS public.profile_metadata (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  profile_image_url TEXT,
  specialization TEXT, -- For counsellors
  license_number TEXT, -- For counsellors
  experience TEXT, -- For counsellors
  student_id TEXT, -- For students
  department TEXT, -- For students
  level TEXT, -- For students
  is_available BOOLEAN DEFAULT true, -- For counsellors
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table for dedicated chat functionality
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1_id UUID REFERENCES public.profiles(id) NOT NULL,
  participant_2_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'archived')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Create chat_messages table for chat functionality
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add email verification and configuration to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_configuration JSONB DEFAULT '{}';

-- Enable Row Level Security
ALTER TABLE public.profile_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_metadata
CREATE POLICY "Users can view own metadata" ON public.profile_metadata
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own metadata" ON public.profile_metadata
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own metadata" ON public.profile_metadata
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can view counsellor metadata" ON public.profile_metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p1, public.profiles p2
      WHERE p1.id = auth.uid() 
      AND p1.user_type = 'student'
      AND p2.id = profile_metadata.id
      AND p2.user_type = 'counsellor'
    )
  );

CREATE POLICY "Counsellors can view student metadata" ON public.profile_metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p1, public.profiles p2
      WHERE p1.id = auth.uid() 
      AND p1.user_type = 'counsellor'
      AND p2.id = profile_metadata.id
      AND p2.user_type = 'student'
    )
  );

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view their chat sessions" ON public.chat_sessions
  FOR SELECT USING (
    auth.uid() = participant_1_id OR auth.uid() = participant_2_id
  );

CREATE POLICY "Users can create chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (
    auth.uid() = participant_1_id OR auth.uid() = participant_2_id
  );

CREATE POLICY "Users can update their chat sessions" ON public.chat_sessions
  FOR UPDATE USING (
    auth.uid() = participant_1_id OR auth.uid() = participant_2_id
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their chat sessions" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = chat_session_id 
      AND (cs.participant_1_id = auth.uid() OR cs.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their chat sessions" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = chat_session_id 
      AND (cs.participant_1_id = auth.uid() OR cs.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Function to update last_seen timestamp
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profile_metadata 
  SET last_seen = NOW() 
  WHERE id = auth.uid();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update chat session last_message_at
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions 
  SET last_message_at = NOW() 
  WHERE id = NEW.chat_session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update chat session timestamp when new message is sent
CREATE TRIGGER update_chat_session_timestamp_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_session_timestamp();