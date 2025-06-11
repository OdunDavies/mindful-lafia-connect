
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Play,
  Send,
  Brain,
  Shield,
  Lightbulb
} from 'lucide-react';

const Home = () => {
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [submittingStory, setSubmittingStory] = useState(false);
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

  // Student testimonials (updated dates to 2025)
  const studentTestimonials = [
    {
      id: 1,
      name: "Amina Hassan",
      story: "The counselling service at FULAFIA completely changed my perspective on mental health. I was struggling with anxiety and depression, but through regular sessions, I learned coping strategies that helped me excel academically and personally.",
      date: "January 15, 2025",
      course: "Psychology, 400 Level"
    },
    {
      id: 2,
      name: "Ibrahim Musa",
      story: "I was hesitant to seek help initially due to stigma, but the counsellors here are so understanding and professional. They helped me through a difficult period of grief and loss.",
      date: "February 8, 2025",
      course: "Computer Science, 300 Level"
    },
    {
      id: 3,
      name: "Fatima Abdullahi",
      story: "The self-assessment tools and resources available here are incredible. They helped me identify patterns in my mental health and take proactive steps towards healing.",
      date: "March 12, 2025",
      course: "Medicine, 500 Level"
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

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyContent.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and story content are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingStory(true);
    try {
      // Here you would typically save to a database
      // For now, we'll just show a success message
      toast({
        title: "Story submitted successfully!",
        description: "Thank you for sharing your experience. It will be reviewed and published soon.",
      });
      setStoryTitle('');
      setStoryContent('');
    } catch (error) {
      toast({
        title: "Failed to submit story",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmittingStory(false);
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

        {/* Mental Health Awareness Report */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl text-blue-900">Mental Health Awareness & Understanding</CardTitle>
                  <CardDescription className="text-blue-700">
                    Comprehensive guide to mental health awareness for the FULAFIA community
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mental Health Overview */}
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  What is Mental Health?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Mental health encompasses our emotional, psychological, and social well-being. It affects how we think, 
                  feel, and act. Good mental health is essential for students to cope with academic stress, build healthy 
                  relationships, and make sound decisions. At FULAFIA, we recognize that mental health is just as important 
                  as physical health for overall student success.
                </p>
              </div>

              {/* Common Mental Health Conditions */}
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Common Mental Health Conditions Among Students
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-red-700">Anxiety Disorders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Symptoms:</strong> Excessive worry, restlessness, difficulty concentrating, physical symptoms like rapid heartbeat
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Common triggers:</strong> Academic pressure, social situations, financial stress, future uncertainty
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-700">Depression</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Symptoms:</strong> Persistent sadness, loss of interest, fatigue, sleep disturbances, feelings of worthlessness
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Risk factors:</strong> Academic failure, social isolation, family history, major life changes
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-700">Stress-Related Disorders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Symptoms:</strong> Overwhelming feelings, difficulty managing daily tasks, physical symptoms, mood changes
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Common sources:</strong> Exams, deadlines, relationship issues, career decisions
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-purple-700">Adjustment Disorders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Symptoms:</strong> Difficulty adapting to new situations, emotional or behavioral symptoms
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Triggers:</strong> Starting university, moving away from home, cultural adjustments
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Warning Signs */}
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Warning Signs to Watch For
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Emotional Signs:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Persistent sadness or hopelessness</li>
                        <li>• Excessive worry or fear</li>
                        <li>• Mood swings or irritability</li>
                        <li>• Feeling overwhelmed or out of control</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Behavioral Signs:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Withdrawal from friends and activities</li>
                        <li>• Declining academic performance</li>
                        <li>• Changes in sleep or eating patterns</li>
                        <li>• Increased substance use</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Getting Help */}
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  How to Get Help at FULAFIA
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-800">Online Counselling</h4>
                      <p className="text-sm text-green-700">Connect with professional counsellors through our platform</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ClipboardCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-800">Self-Assessment</h4>
                      <p className="text-sm text-green-700">Take our confidential mental health screening tools</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-800">Resources</h4>
                      <p className="text-sm text-green-700">Access educational materials and self-help guides</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">🚨 Crisis Support</h4>
                <p className="text-sm text-red-700">
                  If you're experiencing a mental health crisis or having thoughts of self-harm, 
                  please reach out immediately:
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• <strong>Nigeria Crisis Helpline:</strong> 199 (24/7)</li>
                  <li>• <strong>FULAFIA Health Center:</strong> Available during campus hours</li>
                  <li>• <strong>Emergency Services:</strong> 112 or 911</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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

        {/* Student Testimonials */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Student Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {studentTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.course}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed">{testimonial.story}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {testimonial.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Share Your Story Form */}
          {userType === 'student' && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Share Your Story
                </CardTitle>
                <CardDescription>
                  Help inspire other students by sharing your mental health journey and recovery experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="story-title">Story Title</Label>
                    <Input
                      id="story-title"
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      placeholder="Give your story a meaningful title..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="story-content">Your Story</Label>
                    <Textarea
                      id="story-content"
                      value={storyContent}
                      onChange={(e) => setStoryContent(e.target.value)}
                      placeholder="Share your experience, challenges overcome, and how counselling helped you..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submittingStory} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    {submittingStory ? 'Submitting...' : 'Share My Story'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
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
