
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Clock, Award, Shield } from 'lucide-react';

interface CounsellorInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  license_number?: string;
  experience?: string;
  is_available?: boolean;
  profile_image_url?: string;
}

interface CounsellorInfoCardProps {
  counsellor: CounsellorInfo;
  onStartSession?: (counsellorId: string) => void;
  isCreatingSession?: boolean;
  showContactButton?: boolean;
}

export function CounsellorInfoCard({ 
  counsellor, 
  onStartSession, 
  isCreatingSession = false,
  showContactButton = true 
}: CounsellorInfoCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src={counsellor.profile_image_url} alt={`${counsellor.first_name} ${counsellor.last_name}`} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-xl">
              Dr. {counsellor.first_name} {counsellor.last_name}
            </CardTitle>
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <Award className="h-3 w-3 mr-1" />
              Licensed Counsellor
            </Badge>
            {counsellor.is_available && (
              <Badge variant="default" className="bg-green-500 text-sm">
                Available
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specialization */}
        {counsellor.specialization && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Area of Expertise</div>
            <div className="font-medium">{counsellor.specialization}</div>
          </div>
        )}

        {/* Experience */}
        {counsellor.experience && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Experience</div>
            <div className="font-medium">{counsellor.experience}</div>
          </div>
        )}

        {/* License */}
        {counsellor.license_number && counsellor.license_number !== 'Not specified' && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">License Number</div>
            <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
              {counsellor.license_number}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-green-500" />
            <span className="text-sm truncate">{counsellor.email}</span>
          </div>
          {counsellor.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{counsellor.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Available during business hours</span>
          </div>
        </div>

        {/* Action Button */}
        {showContactButton && onStartSession && (
          <Button
            onClick={() => onStartSession(counsellor.id)}
            disabled={isCreatingSession || !counsellor.is_available}
            className="w-full mt-4"
          >
            {isCreatingSession ? 'Starting Session...' : 'Contact Counsellor'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
