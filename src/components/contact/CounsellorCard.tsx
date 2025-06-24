import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Video, Mail, Phone, Award, Shield, Circle, Star, Clock } from 'lucide-react';

interface CounsellorData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  specialization?: string;
  license_number?: string;
  experience?: string;
  bio?: string;
  is_available?: boolean;
  last_seen?: string;
  profile_image_url?: string;
}

interface CounsellorCardProps {
  counsellor: CounsellorData;
  onStartSession: (counsellorId: string, sessionType: 'chat' | 'video') => void;
  isCreatingSession: boolean;
}

const CounsellorCard = ({ counsellor, onStartSession, isCreatingSession }: CounsellorCardProps) => {
  // Determine online status based on last_seen (within last 5 minutes = online)
  const isOnline = counsellor.last_seen ? 
    (new Date().getTime() - new Date(counsellor.last_seen).getTime()) < 5 * 60 * 1000 : false;

  const getExperienceLevel = (experience?: string) => {
    if (!experience || experience === 'Not specified') return 0;
    if (experience.includes('0-1')) return 1;
    if (experience.includes('2-5')) return 3;
    if (experience.includes('6-10')) return 4;
    if (experience.includes('11-15')) return 5;
    if (experience.includes('15+')) return 5;
    return 3; // Default
  };

  const experienceStars = getExperienceLevel(counsellor.experience);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarImage src={counsellor.profile_image_url} alt={`${counsellor.first_name} ${counsellor.last_name}`} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
              isOnline && counsellor.is_available ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              <Circle className="w-3 h-3 fill-current text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-lg">
              Dr. {counsellor.first_name} {counsellor.last_name}
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              Licensed Counsellor
            </Badge>
            <Badge variant={isOnline && counsellor.is_available ? "default" : "outline"} className="text-xs">
              {isOnline && counsellor.is_available ? 'Available' : 'Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {counsellor.bio && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {counsellor.bio}
            </p>
          </div>
        )}

        {/* Specialization */}
        {counsellor.specialization && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Specialization</div>
            <div className="text-sm font-medium">{counsellor.specialization}</div>
          </div>
        )}

        {/* Experience with Stars */}
        {counsellor.experience && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Experience</div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-sm font-medium">{counsellor.experience}</div>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-3 w-3 ${
                      index < experienceStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* License Number */}
        {counsellor.license_number && counsellor.license_number !== 'Not specified' && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">License</div>
            <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
              {counsellor.license_number}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onStartSession(counsellor.id, 'chat')}
            disabled={isCreatingSession || (!isOnline || !counsellor.is_available)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {isCreatingSession ? 'Starting...' : 'Chat'}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onStartSession(counsellor.id, 'video')}
            disabled={isCreatingSession || (!isOnline || !counsellor.is_available)}
          >
            <Video className="h-4 w-4 mr-2" />
            {isCreatingSession ? 'Starting...' : 'Video Call'}
          </Button>
        </div>

        {/* Contact Information */}
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
          {counsellor.last_seen && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last seen: {new Date(counsellor.last_seen).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CounsellorCard;