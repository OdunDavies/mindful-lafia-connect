
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, GraduationCap, Building, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';

interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  student_id?: string;
  department?: string;
  level?: string;
  bio?: string;
  last_seen?: string;
  profile_image_url?: string;
  assessment_score?: number;
  risk_level?: string;
  last_assessment_date?: string;
}

interface StudentCardProps {
  student: StudentData;
  onStartSession: (studentId: string) => void;
  isCreatingSession: boolean;
}

const StudentCard = ({ student, onStartSession, isCreatingSession }: StudentCardProps) => {
  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getRiskIcon = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'moderate': return <AlertTriangle className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarImage src={student.profile_image_url} alt={`${student.first_name} ${student.last_name}`} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
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
          {student.student_id && student.student_id !== 'Not provided' && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Student ID</div>
              <div className="font-medium text-xs">{student.student_id}</div>
            </div>
          )}
          
          {student.level && student.level !== 'Not specified' && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Level</div>
              <div className="font-medium text-xs">{student.level}</div>
            </div>
          )}
        </div>

        {student.department && student.department !== 'Not specified' && (
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
                <div className="text-sm font-medium">Score: {student.assessment_score}/18</div>
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

        {/* Action Button */}
        <Button
          onClick={() => onStartSession(student.id)}
          disabled={isCreatingSession}
          className="w-full"
        >
          {isCreatingSession ? 'Starting Session...' : 'Start Session'}
        </Button>

        {/* Contact Information */}
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
          {student.last_seen && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last seen: {new Date(student.last_seen).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
