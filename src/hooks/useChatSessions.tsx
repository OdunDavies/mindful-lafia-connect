import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  status: string;
  last_message_at: string;
  created_at: string;
  other_participant?: {
    first_name: string;
    last_name: string;
    user_type: string;
  };
}

export const useChatSessions = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchChatSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          participant_1:profiles!chat_sessions_participant_1_id_fkey(first_name, last_name, user_type),
          participant_2:profiles!chat_sessions_participant_2_id_fkey(first_name, last_name, user_type)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Map sessions with other participant info
      const sessionsWithParticipants = data?.map(session => {
        const otherParticipant = session.participant_1_id === user.id 
          ? session.participant_2 
          : session.participant_1;

        return {
          ...session,
          other_participant: otherParticipant
        };
      }) || [];

      setChatSessions(sessionsWithParticipants);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startChatSession = async (otherUserId: string) => {
    if (!user) return null;

    try {
      // Check if session already exists
      const { data: existingSession, error: checkError } = await supabase
        .from('chat_sessions')
        .select('id')
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user.id})`)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingSession) {
        return existingSession.id;
      }

      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('chat_sessions')
        .insert({
          participant_1_id: user.id,
          participant_2_id: otherUserId,
          status: 'active'
        })
        .select('id')
        .single();

      if (createError) throw createError;

      await fetchChatSessions(); // Refresh sessions
      return newSession.id;
    } catch (error) {
      console.error('Error starting chat session:', error);
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, [user]);

  return {
    chatSessions,
    loading,
    startChatSession,
    refetch: fetchChatSessions
  };
};