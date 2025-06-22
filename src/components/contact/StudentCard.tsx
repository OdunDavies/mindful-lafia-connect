
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Video, Mail, Phone, GraduationCap, Building, Trophy, AlertTriangle, CheckCircle } from 'lucide-react';

interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  // Student-specific metadata
  student_id?: string;
  department?: string;
  level?: string;
  // Assessment data
  assessment_score?: number;
  risk_level?: string;
  last_assessment_date?: string;
}

interface StudentCardProps {
  student: StudentData;
  onStartSession: (studentId: string, sessionType: 'chat' | 'video') => void;
  isCreatingSession: boolean;
}

const StudentCard = ({ student, onStartSession, isCreatingSession }: StudentCardProps) => {
  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getRiskIcon = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <AlertTriangle className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarFallback className="text-lg">
              {student.first_name?.[0]}{student.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-lg">
            {student.first_name} {student.last_name}
          </CardTitle>
          
          <div className="flex flex-col items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              Student
            </Badge>
            
            {/* Assessment Badge */}
            {student.risk_level && (
              <Badge 
                variant="outline" 
                className={`text-xs text-white ${getRiskLevelColor(student.risk_level)}`}
              >
                {getRiskIcon(student.risk_level)}
                <span className="ml-1 capitalize">{student.risk_level} Risk</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Student Information */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {student.student_id && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Student ID</div>
              <div className="font-medium">{student.student_id}</div>
            </div>
          )}
          
          {student.level && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Level</div>
              <div className="font-medium">{student.level}</div>
            </div>
          )}
        </div>

        {student.department && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Building className="h-3 w-3" />
              Department
            </div>
            <div className="text-sm font-medium">{student.department}</div>
          </div>
        )}

        {/* Assessment Information */}
        {student.assessment_score !== undefined && (
          <div className="bg-muted p-3 rounded-md">
            <div className="text-xs text-muted-foreground mb-2">Latest Assessment</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Score: {student.assessment_score}/100</div>
                {student.last_assessment_date && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(student.last_assessment_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              {student.risk_level && (
                <Badge 
                  variant="outline" 
                  className={`text-xs text-white ${getRiskLevelColor(student.risk_level)}`}
                >
                  {student.risk_level}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onStartSession(student.id, 'chat')}
            disabled={isCreatingSession}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {isCreatingSession ? 'Starting...' : 'Chat'}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onStartSession(student.id, 'video')}
            disabled={isCreatingSession}
          >
            <Video className="h-4 w-4 mr-2" />
            {isCreatingSession ? 'Starting...' : 'Video Call'}
          </Button>
        </div>

        <div className="pt-2 border-t space-y-2">
          {student.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{student.email}</span>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{student.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
