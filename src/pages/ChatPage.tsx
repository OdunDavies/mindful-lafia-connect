import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '@/components/chat/ChatInterface';
import ChatSessionsList from '@/components/chat/ChatSessionsList';
import { useChatSessions } from '@/hooks/useChatSessions';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [selectedSession, setSelectedSession] = useState<{
    id: string;
    otherParticipant: any;
  } | null>(null);

  const { startChatSession } = useChatSessions();

  const handleSelectSession = (sessionId: string, otherParticipant: any) => {
    setSelectedSession({ id: sessionId, otherParticipant });
  };

  const handleStartVideoCall = () => {
    // This would integrate with the existing video call functionality
    console.log('Starting video call...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat Sessions List */}
        <div className="lg:col-span-1">
          <ChatSessionsList
            onSelectSession={handleSelectSession}
            selectedSessionId={selectedSession?.id}
          />
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <ChatInterface
              chatSessionId={selectedSession.id}
              otherParticipant={selectedSession.otherParticipant}
              onStartVideoCall={handleStartVideoCall}
            />
          ) : (
            <div className="flex items-center justify-center h-full border rounded-lg bg-muted/10">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a chat session</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;