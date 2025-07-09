
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building, Trophy, Brain } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface StudentProfileSectionProps {
  user: User;
}

const StudentProfileSection = ({ user }: StudentProfileSectionProps) => {
  const metadata = user.user_metadata || {};
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Student Information Card */}
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

      {/* Mental Health Assessment Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mental Health Assessment
          </CardTitle>
          <CardDescription>
            Take a self-assessment to track your mental health
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Track Your Mental Health</h3>
          <p className="text-muted-foreground mb-4">
            Take a confidential self-assessment to get personalized recommendations and support.
          </p>
          <Button onClick={() => navigate('/assessment')}>
            Take Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileSection;
