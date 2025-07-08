
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building, AlertTriangle, Clock, Users, Mail, Phone } from 'lucide-react';

interface EnhancedStudentCardProps {
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    student_id?: string;
    department?: string;
    level?: string;
    assessment_score?: number;
    risk_level?: string;
    last_assessment_date?: string;
    last_seen?: string;
    profile_image_url?: string;
    total_sessions?: number;
    completed_sessions?: number;
    active_sessions?: number;
  };
  onStartSession: (studentId: string) => void;
  isCreatingSession: boolean;
}

const EnhancedStudentCard = ({ student, onStartSession, isCreatingSession }: EnhancedStudentCardProps) => {
  const getRiskBadgeColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'moderate': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center">
        <Avatar className="h-16 w-16 mx-auto">
          <AvatarImage src={student.profile_image_url} alt={`${student.first_name} ${student.last_name}`} />
          <AvatarFallback>
            {student.first_name?.[0]}{student.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg">
          {student.first_name} {student.last_name}
        </CardTitle>
        <div className="flex justify-center gap-2 mt-1 flex-wrap">
          <Badge variant="outline">{student.student_id}</Badge>
          {student.risk_level && (
            <Badge variant={getRiskBadgeColor(student.risk_level)}>
              {student.risk_level} Risk
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Academic Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-blue-500" />
            <span>{student.department || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-green-500" />
            <span>Level {student.level || 'Not specified'}</span>
          </div>
          {student.assessment_score && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span>Assessment Score: {student.assessment_score}/100</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-500" />
            <span>Sessions: {student.completed_sessions || 0} completed</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-green-500" />
            <span className="truncate">{student.email}</span>
          </div>
          {student.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-blue-500" />
              <span>{student.phone}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onStartSession(student.id)}
          disabled={isCreatingSession}
          className="w-full"
          variant={student.risk_level === 'high' ? 'destructive' : 'default'}
        >
          {isCreatingSession ? 'Starting Session...' : 'Start Session'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedStudentCard;
