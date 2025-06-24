
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Building, Trophy } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StudentProfileSectionProps {
  user: User;
}

const StudentProfileSection = ({ user }: StudentProfileSectionProps) => {
  const metadata = user.user_metadata || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Student Information
        </CardTitle>
        <CardDescription>
          Your academic details and student information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Student ID
          </div>
          <div className="p-3 bg-muted rounded-md">
            {metadata.student_id || 'Not provided'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building className="h-4 w-4" />
              Department
            </div>
            <div className="p-3 bg-muted rounded-md">
              {metadata.department || 'Not provided'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Trophy className="h-4 w-4" />
              Academic Level
            </div>
            <div className="p-3 bg-muted rounded-md">
              {metadata.level ? `${metadata.level} Level` : 'Not provided'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileSection;
