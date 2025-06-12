
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useCounsellingSession = () => {
  const [creatingSession, setCreatingSession] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartSession = async (counsellorId: string, sessionType: 'chat' | 'video') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a session.",
        variant: "destructive",
      });
      return;
    }

    setCreatingSession(counsellorId);
    
    try {
      // Create a new counselling session
      const { data: session, error } = await supabase
        .from('counselling_sessions')
        .insert({
          student_id: user.id,
          counsellor_id: counsellorId,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session started",
        description: `Your ${sessionType} session has been initiated successfully.`,
      });

      // Navigate to the appropriate session page
      if (sessionType === 'video') {
        navigate(`/video-call?session=${session.id}`);
      } else {
        // For chat, you might want to navigate to a chat interface
        navigate(`/contact?session=${session.id}&type=chat`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Session creation failed",
        description: "Failed to start the session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingSession(null);
    }
  };

  return { handleStartSession, creatingSession };
};
