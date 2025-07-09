
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

  const handleStartSession = async (otherUserId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a session.",
        variant: "destructive",
      });
      return;
    }

    setCreatingSession(otherUserId);
    
    try {
      // Create a counselling session
      const { data: session, error } = await supabase
        .from('counselling_sessions')
        .insert({
          student_id: user?.user_metadata?.user_type === 'student' ? user.id : otherUserId,
          counsellor_id: user?.user_metadata?.user_type === 'counsellor' ? user.id : otherUserId,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session started",
        description: "Your counselling session has been initiated successfully.",
      });

      navigate(`/video-call?session=${session.id}`);
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
