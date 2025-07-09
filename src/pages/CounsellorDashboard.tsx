
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, LogOut, Mail, Phone, GraduationCap, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Session {
  id: string;
  status: string;
  scheduled_at: string;
  created_at: string;
  student: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    student_id?: string;
    department?: string;
    level?: string;
  };
}

interface StudentContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  student_id?: string;
  department?: string;
  level?: string;
  last_contact: string;
  session_count: number;
  latest_assessment?: {
    score: number;
    risk_level: string;
    created_at: string;
  };
}

const CounsellorDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [studentContacts, setStudentContacts] = useState<StudentContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('counselling_sessions')
        .select(`
          id,
          status,
          scheduled_at,
          created_at,
          student:profiles!counselling_sessions_student_id_fkey(
            first_name, 
            last_name, 
            email, 
            phone, 
            student_id, 
            department, 
            level
          )
        `)
        .eq('counsellor_id', user?.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // Fetch students who have contacted this counsellor
      const { data: contactsData, error: contactsError } = await supabase
        .from('counselling_sessions')
        .select(`
          student_id,
          created_at,
          student:profiles!counselling_sessions_student_id_fkey(
            id,
            first_name,
            last_name,
            email,
            phone,
            student_id,
            department,
            level
          )
        `)
        .eq('counsellor_id', user?.id);

      if (contactsError) throw contactsError;

      // Group by student and get their latest assessment
      const studentMap = new Map();
      
      contactsData?.forEach((session) => {
        const studentId = session.student_id;
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            ...session.student,
            last_contact: session.created_at,
            session_count: 1
          });
        } else {
          const existing = studentMap.get(studentId);
          studentMap.set(studentId, {
            ...existing,
            session_count: existing.session_count + 1,
            last_contact: session.created_at > existing.last_contact ? session.created_at : existing.last_contact
          });
        }
      });

      // Fetch assessments for these students
      const studentIds = Array.from(studentMap.keys());
      if (studentIds.length > 0) {
        const { data: assessmentsData } = await supabase
          .from('self_assessments')
          .select('student_id, score, risk_level, created_at')
          .in('student_id', studentIds)
          .order('created_at', { ascending: false });

        // Add latest assessment to each student
        const studentsWithAssessments = Array.from(studentMap.values()).map(student => {
          const latestAssessment = assessmentsData?.find(a => a.student_id === student.id);
          return {
            ...student,
            latest_assessment: latestAssessment ? {
              score: latestAssessment.score,
              risk_level: latestAssessment.risk_level,
              created_at: latestAssessment.created_at
            } : undefined
          };
        });

        setStudentContacts(studentsWithAssessments);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const joinSession = (sessionId: string) => {
    navigate(`/video-call?session=${sessionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
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

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Counsellor Dashboard</h1>
            <p className="text-muted-foreground">Welcome, Dr. {user?.user_metadata?.first_name || 'Counsellor'}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Statistics */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Sessions</CardDescription>
                  <CardTitle className="text-2xl">{sessions.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Sessions</CardDescription>
                  <CardTitle className="text-2xl">
                    {sessions.filter(s => s.status === 'active').length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Students Helped</CardDescription>
                  <CardTitle className="text-2xl">{studentContacts.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Completed Sessions</CardDescription>
                  <CardTitle className="text-2xl">
                    {sessions.filter(s => s.status === 'completed').length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Students Who Have Contacted You */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Students Who Have Contacted You</h2>
            {studentContacts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No student contacts yet</h3>
                  <p className="text-muted-foreground">
                    Students who reach out to you will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {studentContacts.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {student.first_name} {student.last_name}
                            </h3>
                            {student.latest_assessment && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getRiskLevelColor(student.latest_assessment.risk_level)}`}>
                                {getRiskLevelIcon(student.latest_assessment.risk_level)}
                                <span className="capitalize">{student.latest_assessment.risk_level} Risk</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <span>{student.email}</span>
                              </div>
                              {student.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-green-500" />
                                  <span>{student.phone}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              {student.student_id && (
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-purple-500" />
                                  <span>ID: {student.student_id}</span>
                                </div>
                              )}
                              {student.department && (
                                <div className="text-muted-foreground">
                                  {student.department}
                                  {student.level && ` • ${student.level} Level`}
                                </div>
                              )}
                            </div>
                          </div>

                          {student.latest_assessment && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <div className="text-sm">
                                <span className="font-medium">Latest Assessment:</span>
                                <span className="ml-2">Score {student.latest_assessment.score}/18</span>
                                <span className="ml-2 text-muted-foreground">
                                  • {new Date(student.latest_assessment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-4 w-4" />
                            <span>{student.session_count} session{student.session_count !== 1 ? 's' : ''}</span>
                          </div>
                          <div>Last contact: {new Date(student.last_contact).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Sessions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
                  <p className="text-muted-foreground">
                    Students will be able to book sessions with you through the contact page
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <Card key={session.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                          <div>
                            <h3 className="font-semibold">
                              Session with {session.student.first_name} {session.student.last_name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {session.scheduled_at 
                                ? new Date(session.scheduled_at).toLocaleString()
                                : new Date(session.created_at).toLocaleString()
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                          {(session.status === 'pending' || session.status === 'active') && (
                            <Button onClick={() => joinSession(session.id)}>
                              Join Session
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;
