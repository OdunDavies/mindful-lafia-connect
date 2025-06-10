
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Video } from 'lucide-react';
import VideoCallInterface from '@/components/VideoCallInterface';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [isCallActive, setIsCallActive] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [otherParticipant, setOtherParticipant] = useState<string>('Unknown User');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!sessionId) {
      navigate('/student-dashboard');
      return;
    }

    fetchSessionData();
  }, [sessionId, user, navigate]);

  const fetchSessionData = async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from('counselling_sessions')
        .select(`
          *,
          student:profiles!counselling_sessions_student_id_fkey(first_name, last_name),
          counsellor:profiles!counselling_sessions_counsellor_id_fkey(first_name, last_name)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      setSessionData(data);

      // Determine the other participant
      if (user?.id === data.student_id) {
        setOtherParticipant(`${data.counsellor.first_name} ${data.counsellor.last_name}`);
      } else {
        setOtherParticipant(`${data.student.first_name} ${data.student.last_name}`);
      }

      // Update session status to active if it's pending
      if (data.status === 'pending') {
        await supabase
          .from('counselling_sessions')
          .update({ 
            status: 'active', 
            started_at: new Date().toISOString() 
          })
          .eq('id', sessionId);
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      navigate('/student-dashboard');
    }
  };

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = async () => {
    setIsCallActive(false);
    
    // Update session status to completed
    if (sessionId) {
      await supabase
        .from('counselling_sessions')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    }

    // Navigate back to dashboard
    navigate(user?.id === sessionData?.student_id ? '/student-dashboard' : '/counsellor-dashboard');
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No session ID provided</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(user?.id === sessionData?.student_id ? '/student-dashboard' : '/counsellor-dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Counselling Session</h1>
              <p className="text-sm text-muted-foreground">
                {sessionData?.status === 'active' ? 'Session in progress' : 'Preparing session...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={showChat ? "default" : "outline"}
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant={isCallActive ? "destructive" : "default"}
              size="sm"
              onClick={isCallActive ? handleEndCall : handleStartCall}
            >
              <Video className="h-4 w-4 mr-2" />
              {isCallActive ? 'End Call' : 'Start Call'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Video Call Area */}
          <div className={`${showChat ? 'lg:col-span-2' : 'lg:col-span-3'} h-full`}>
            <VideoCallInterface
              isCallActive={isCallActive}
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
              otherParticipantName={otherParticipant}
            />
          </div>

          {/* Chat Area */}
          {showChat && (
            <div className="lg:col-span-1 h-full">
              <ChatInterface
                sessionId={sessionId}
                otherParticipantName={otherParticipant}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
