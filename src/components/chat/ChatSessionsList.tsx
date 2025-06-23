import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock } from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';

interface ChatSessionsListProps {
  onSelectSession: (sessionId: string, otherParticipant: any) => void;
  selectedSessionId?: string;
}

const ChatSessionsList = ({ onSelectSession, selectedSessionId }: ChatSessionsListProps) => {
  const { chatSessions, loading } = useChatSessions();

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Sessions ({chatSessions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chatSessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No chat sessions yet</p>
            <p className="text-sm text-muted-foreground">
              Start a conversation with a counsellor or student
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id, session.other_participant)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedSessionId === session.id ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {session.other_participant?.first_name?.[0]}
                    {session.other_participant?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">
                      {session.other_participant?.user_type === 'counsellor' ? 'Dr. ' : ''}
                      {session.other_participant?.first_name} {session.other_participant?.last_name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {session.other_participant?.user_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatLastMessageTime(session.last_message_at)}
                    </span>
                    <Badge 
                      variant={session.status === 'active' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {session.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatSessionsList;