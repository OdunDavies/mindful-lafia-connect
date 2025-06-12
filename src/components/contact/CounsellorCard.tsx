
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Video, Mail, Phone, Award, Shield } from 'lucide-react';

interface CounsellorData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface CounsellorCardProps {
  counsellor: CounsellorData;
  onStartSession: (counsellorId: string, sessionType: 'chat' | 'video') => void;
  isCreatingSession: boolean;
}

const CounsellorCard = ({ counsellor, onStartSession, isCreatingSession }: CounsellorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarFallback className="text-lg">
              {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-lg">
              Dr. {counsellor.first_name} {counsellor.last_name}
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </div>
          
          <Badge variant="secondary" className="text-xs">
            <Award className="h-3 w-3 mr-1" />
            Counsellor
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onStartSession(counsellor.id, 'chat')}
            disabled={isCreatingSession}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {isCreatingSession ? 'Starting...' : 'Chat'}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onStartSession(counsellor.id, 'video')}
            disabled={isCreatingSession}
          >
            <Video className="h-4 w-4 mr-2" />
            {isCreatingSession ? 'Starting...' : 'Video Call'}
          </Button>
        </div>

        <div className="pt-2 border-t space-y-2">
          {counsellor.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{counsellor.email}</span>
            </div>
          )}
          {counsellor.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{counsellor.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CounsellorCard;
