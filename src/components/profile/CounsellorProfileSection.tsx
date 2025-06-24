
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Award, Clock } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface CounsellorProfileSectionProps {
  user: User;
}

const CounsellorProfileSection = ({ user }: CounsellorProfileSectionProps) => {
  const metadata = user.user_metadata || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Professional Information
        </CardTitle>
        <CardDescription>
          Your professional credentials and specialization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            Specialization
          </div>
          <div className="p-3 bg-muted rounded-md">
            {metadata.specialization || 'Not provided'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Award className="h-4 w-4" />
              License Number
            </div>
            <div className="p-3 bg-muted rounded-md font-mono text-sm">
              {metadata.license_number || 'Not provided'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Experience
            </div>
            <div className="p-3 bg-muted rounded-md">
              {metadata.experience || 'Not provided'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounsellorProfileSection;
