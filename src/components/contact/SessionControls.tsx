
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, MessageSquare, Phone, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionControlsProps {
  sessionId: string;
  participantId: string;
  participantName: string;
  onStartVideoCall: () => void;
  onEndSession: () => void;
  isVideoCallActive: boolean;
}

const SessionControls = ({ 
  sessionId, 
  participantId, 
  participantName, 
  onStartVideoCall, 
  onEndSession,
  isVideoCallActive 
}: SessionControlsProps) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    // Navigate to chat page with session context
    navigate(`/chat?session=${sessionId}&participant=${participantId}`);
  };

  return (
    <div className="flex gap-2 p-3 bg-muted rounded-lg">
      <Button
        onClick={handleStartChat}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Chat
      </Button>
      
      <Button
        onClick={onStartVideoCall}
        variant={isVideoCallActive ? "destructive" : "default"}
        size="sm"
        className="flex items-center gap-2"
      >
        {isVideoCallActive ? (
          <>
            <PhoneOff className="h-4 w-4" />
            End Call
          </>
        ) : (
          <>
            <Video className="h-4 w-4" />
            Video Call
          </>
        )}
      </Button>
      
      <Button
        onClick={onEndSession}
        variant="outline"
        size="sm"
        className="ml-auto"
      >
        End Session
      </Button>
    </div>
  );
};

export default SessionControls;
