
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MessageSquare, Video, Clock, Users, LogOut } from 'lucide-react';

interface Session {
  id: string;
  status: string;
  scheduled_at: string;
  created_at: string;
  student: {
    first_name: string;
    last_name: string;
  };
}

const CounsellorDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('counselling_sessions')
        .select(`
          id,
          status,
          scheduled_at,
          created_at,
          student:profiles!counselling_sessions_student_id_fkey(first_name, last_name)
        `)
        .eq('counsellor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load your sessions",
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
                  <CardDescription>Pending Sessions</CardDescription>
                  <CardTitle className="text-2xl">
                    {sessions.filter(s => s.status === 'pending').length}
                  </CardTitle>
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

          {/* Sessions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Sessions</h2>
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
                {sessions.map((session) => (
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
                                : 'Immediate session'
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
