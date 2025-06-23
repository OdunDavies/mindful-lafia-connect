import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useChatSessions } from '@/hooks/useChatSessions';

export const useCounsellingSession = () => {
  const [creatingSession, setCreatingSession] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startChatSession } = useChatSessions();

  const handleStartSession = async (otherUserId: string, sessionType: 'chat' | 'video') => {
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
      if (sessionType === 'chat') {
        // Start a chat session
        const chatSessionId = await startChatSession(otherUserId);
        if (chatSessionId) {
          toast({
            title: "Chat session started",
            description: "Your chat session has been initiated successfully.",
          });
          navigate(`/chat?session=${chatSessionId}`);
        }
      } else {
        // Create a video counselling session
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
          title: "Video session started",
          description: "Your video session has been initiated successfully.",
        });

        navigate(`/video-call?session=${session.id}`);
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