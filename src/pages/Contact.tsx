
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MessageSquare, 
  Video, 
  Star, 
  Clock,
  Phone,
  Mail,
  Award,
  Filter,
  Users,
  Heart,
  Shield,
  ChevronRight
} from 'lucide-react';

interface CounsellorData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const Contact = () => {
  const [counsellors, setCounsellors] = useState<CounsellorData[]>([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState<CounsellorData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userType = user?.user_metadata?.user_type || 'student';

  useEffect(() => {
    fetchCounsellors();
  }, []);

  useEffect(() => {
    filterCounsellors();
  }, [counsellors, searchTerm]);

  const fetchCounsellors = async () => {
    try {
      console.log('Fetching counsellors...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .eq('user_type', 'counsellor');

      console.log('Counsellors query result:', data, error);

      if (error) {
        console.error('Error fetching counsellors:', error);
        throw error;
      }

      setCounsellors(data || []);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      toast({
        title: "Error loading counsellors",
        description: "Failed to load counsellor profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCounsellors = () => {
    let filtered = counsellors;

    if (searchTerm) {
      filtered = filtered.filter(counsellor =>
        `${counsellor.first_name} ${counsellor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCounsellors(filtered);
  };

  const handleStartSession = async (counsellorId: string, sessionType: 'chat' | 'video') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a session.",
        variant: "destructive",
      });
      return;
    }

    setCreatingSession(counsellorId);
    
    try {
      // Create a new counselling session
      const { data: session, error } = await supabase
        .from('counselling_sessions')
        .insert({
          student_id: user.id,
          counsellor_id: counsellorId,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session started",
        description: `Your ${sessionType} session has been initiated successfully.`,
      });

      // Navigate to the appropriate session page
      if (sessionType === 'video') {
        navigate(`/video-call?session=${session.id}`);
      } else {
        // For chat, you might want to navigate to a chat interface
        navigate(`/contact?session=${session.id}&type=chat`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Session creation failed",
        description: "Failed to start the session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingSession(null);
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {userType === 'student' ? 'Find a Counsellor' : 'Student Connections'}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {userType === 'student' 
            ? "Connect with professional counsellors who understand your needs and can provide the support you deserve."
            : "View students who may need your professional guidance and support."
          }
        </p>
      </div>

      {userType === 'student' && (
        <>
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Counsellors Grid */}
          {filteredCounsellors.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No counsellors found</h3>
                <p className="text-muted-foreground mb-4">
                  {counsellors.length === 0 
                    ? "No counsellors are currently registered on the platform."
                    : "Try adjusting your search criteria to find counsellors."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCounsellors.map((counsellor) => (
                <Card key={counsellor.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="h-20 w-20 mx-auto">
                        <AvatarFallback className="text-lg">
                          {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-lg">
                          Dr. {counsellor.first_name} {counsellor.last_name}
                        </CardTitle>
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      
                      <Badge variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Counsellor
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStartSession(counsellor.id, 'chat')}
                        disabled={creatingSession === counsellor.id}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {creatingSession === counsellor.id ? 'Starting...' : 'Chat'}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStartSession(counsellor.id, 'video')}
                        disabled={creatingSession === counsellor.id}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {creatingSession === counsellor.id ? 'Starting...' : 'Video Call'}
                      </Button>
                    </div>

                    <div className="pt-2 border-t space-y-2">
                      {counsellor.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{counsellor.email}</span>
                        </div>
                      )}
                      {counsellor.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{counsellor.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Emergency Support */}
          <Card className="mt-8 bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Need Immediate Help?
              </CardTitle>
              <CardDescription className="text-red-700">
                If you're experiencing a mental health crisis, don't wait for an appointment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="destructive" size="sm" className="w-full md:w-auto">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency: Call 199 (Nigeria Crisis Helpline)
                </Button>
                <p className="text-sm text-red-600">
                  Available 24/7 for immediate mental health crisis support
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {userType === 'counsellor' && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student Connection Hub</h3>
            <p className="text-muted-foreground mb-4">
              Students will be able to find and connect with you through this platform.
              Your profile is now active and visible to students.
            </p>
            <Button onClick={() => navigate('/')}>
              <ChevronRight className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contact;
