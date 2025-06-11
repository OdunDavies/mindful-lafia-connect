
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import { 
  Calendar, 
  MessageSquare, 
  Video, 
  Clock, 
  User, 
  TrendingUp, 
  Heart,
  Users,
  BookOpen,
  ClipboardCheck,
  Star,
  Activity,
  Play
} from 'lucide-react';

const Home = () => {
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userType = user?.user_metadata?.user_type || 'student';
  const firstName = user?.user_metadata?.first_name || 'User';

  // Mental health education videos
  const mentalHealthVideos = [
    {
      videoId: "DQyZ1cuvOPg",
      title: "Understanding Depression",
      description: "Learn about depression symptoms, causes, and treatment options available in Nigeria."
    },
    {
      videoId: "rkZl2gsLUp4", 
      title: "Anxiety Management Techniques",
      description: "Practical strategies for managing anxiety and stress in daily life."
    },
    {
      videoId: "WPPPFqsECz0",
      title: "Mental Health Awareness",
      description: "Breaking the stigma around mental health in African communities."
    },
    {
      videoId: "OIDEGN4rDSo",
      title: "Coping with Academic Stress",
      description: "How students can manage academic pressure and maintain mental wellbeing."
    },
    {
      videoId: "8su8hb8U9Ps",
      title: "Building Resilience",
      description: "Developing emotional resilience and positive coping mechanisms."
    }
  ];

  // Student testimonials
  const studentTestimonials = [
    {
      videoId: "yQq1-_ujXnM",
      title: "Sarah's Recovery Journey",
      description: "A student shares her experience overcoming depression through counselling."
    },
    {
      videoId: "lvv3D_2kIQo",
      title: "Finding Hope Again", 
      description: "How professional support helped a student through difficult times."
    },
    {
      videoId: "f56ZQkyOu6A",
      title: "Breaking the Silence",
      description: "Students discuss the importance of seeking mental health support."
    }
  ];

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's recent sessions
      const sessionQuery = userType === 'student' 
        ? supabase.from('counselling_sessions').select(`
            id,
            status,
            scheduled_at,
            created_at,
            counsellor:profiles!counselling_sessions_counsellor_id_fkey(first_name, last_name)
          `).eq('student_id', user?.id)
        : supabase.from('counselling_sessions').select(`
            id,
            status,
            scheduled_at,
            created_at,
            student:profiles!counselling_sessions_student_id_fkey(first_name, last_name)
          `).eq('counsellor_id', user?.id);

      const { data: sessions, error: sessionsError } = await sessionQuery
        .order('created_at', { ascending: false })
        .limit(5);

      if (sessionsError) throw sessionsError;

      // Fetch user profile for stats
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_sessions, completed_sessions')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      setRecentSessions(sessions || []);
      setStats({
        totalSessions: profile?.total_sessions || 0,
        completedSessions: profile?.completed_sessions || 0,
        upcomingSessions: sessions?.filter(s => s.status === 'pending' || s.status === 'active').length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = userType === 'student' ? [
    {
      title: 'Find Counsellor',
      description: 'Connect with a mental health professional',
      icon: Users,
      path: '/contact',
      color: 'bg-blue-500'
    },
    {
      title: 'Self Assessment',
      description: 'Check your mental health status',
      icon: ClipboardCheck,
      path: '/assessment',
      color: 'bg-green-500'
    },
    {
      title: 'Resources',
      description: 'Access self-help tools and guides',
      icon: BookOpen,
      path: '/resources',
      color: 'bg-purple-500'
    },
    {
      title: 'My Profile',
      description: 'View and edit your profile',
      icon: User,
      path: '/student-profile',
      color: 'bg-orange-500'
    }
  ] : [
    {
      title: 'Find Students',
      description: 'Connect with students seeking help',
      icon: Users,
      path: '/contact',
      color: 'bg-blue-500'
    },
    {
      title: 'My Profile',
      description: 'Manage your professional profile',
      icon: User,
      path: '/counsellor-profile',
      color: 'bg-green-500'
    },
    {
      title: 'Resources',
      description: 'Professional resources and tools',
      icon: BookOpen,
      path: '/resources',
      color: 'bg-purple-500'
    },
    {
      title: 'About Platform',
      description: 'Learn about our counselling platform',
      icon: Heart,
      path: '/about',
      color: 'bg-orange-500'
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
              <p className="text-muted-foreground">
                {userType === 'student' 
                  ? "Let's continue your mental health journey" 
                  : "Ready to help students today?"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Mental Health Education Videos */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Play className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Mental Health Education</h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {mentalHealthVideos.map((video, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <VideoPlayer
                    videoId={video.videoId}
                    title={video.title}
                    description={video.description}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Student Stories */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Student Stories</h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {studentTestimonials.map((video, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <VideoPlayer
                    videoId={video.videoId}
                    title={video.title}
                    description={video.description}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Total Sessions</CardDescription>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-2xl">{stats.totalSessions}</CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Completed Sessions</CardDescription>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-green-500" />
                <CardTitle className="text-2xl">{stats.completedSessions}</CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>
                {userType === 'student' ? 'Upcoming Sessions' : 'Active Sessions'}
              </CardDescription>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-2xl">{stats.upcomingSessions}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={action.path}
                    className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${action.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            <Card>
              <CardContent className="pt-6">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No sessions yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {userType === 'student' 
                        ? "Start by finding a counsellor"
                        : "Sessions will appear here when students book"
                      }
                    </p>
                    {userType === 'student' && (
                      <Button onClick={() => navigate('/contact')} size="sm">
                        Find Counsellor
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {userType === 'student' 
                              ? `Dr. ${session.counsellor?.first_name} ${session.counsellor?.last_name}`
                              : `${session.student?.first_name} ${session.student?.last_name}`
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.scheduled_at 
                              ? new Date(session.scheduled_at).toLocaleDateString()
                              : 'Immediate session'
                            }
                          </p>
                        </div>
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {session.status}
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/contact')}
                    >
                      View All Sessions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Motivational Message */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {userType === 'student' 
                    ? "Your mental health matters" 
                    : "Making a difference, one session at a time"
                  }
                </h3>
                <p className="text-muted-foreground">
                  {userType === 'student' 
                    ? "Remember, seeking help is a sign of strength. We're here to support you every step of the way."
                    : "Thank you for your dedication to supporting students' mental health and wellbeing."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
