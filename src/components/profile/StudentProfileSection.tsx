
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building, Trophy, Brain, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useLatestAssessment } from '@/hooks/useLatestAssessment';
import { useNavigate } from 'react-router-dom';

interface StudentProfileSectionProps {
  user: User;
}

const StudentProfileSection = ({ user }: StudentProfileSectionProps) => {
  const metadata = user.user_metadata || {};
  const { assessment, loading } = useLatestAssessment();
  const navigate = useNavigate();

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'moderate': return <Info className="h-4 w-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

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

      {/* Self Assessment Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Latest Self-Assessment Results
          </CardTitle>
          <CardDescription>
            Your most recent mental health assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : assessment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRiskLevelIcon(assessment.risk_level)}
                  <div>
                    <div className="font-semibold">Risk Level: {assessment.risk_level.charAt(0).toUpperCase() + assessment.risk_level.slice(1)}</div>
                    <div className="text-sm text-muted-foreground">
                      Score: {assessment.score}/18
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getRiskLevelColor(assessment.risk_level)} text-white`}
                >
                  {assessment.risk_level.toUpperCase()}
                </Badge>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  {assessment.recommendations}
                </p>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Assessment taken on: {new Date(assessment.created_at).toLocaleDateString()}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/assessment')}
                className="w-full"
              >
                Take New Assessment
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No assessment taken yet</h3>
              <p className="text-muted-foreground mb-4">
                Take a self-assessment to track your mental health and get personalized recommendations.
              </p>
              <Button onClick={() => navigate('/assessment')}>
                Take Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileSection;
