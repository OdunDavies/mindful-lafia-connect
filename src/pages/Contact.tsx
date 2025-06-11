
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  Video,
  Users,
  Heart,
  Filter,
  CheckCircle
} from 'lucide-react';

interface CounsellorData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  is_online: boolean;
  total_sessions: number;
  completed_sessions: number;
  counsellor_profiles: {
    specialization: string;
    experience: string;
    is_verified: boolean;
    bio: string | null;
  } | null;
}

const Contact = () => {
  const [counsellors, setCounsellors] = useState<CounsellorData[]>([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState<CounsellorData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userType = user?.user_metadata?.user_type || 'student';

  useEffect(() => {
    fetchCounsellors();
  }, []);

  useEffect(() => {
    filterCounsellors();
  }, [counsellors, searchTerm, selectedSpecialization]);

  const fetchCounsellors = async () => {
    try {
      console.log('Fetching counsellors...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          bio,
          is_online,
          total_sessions,
          completed_sessions,
          counsellor_profiles (
            specialization,
            experience,
            is_verified,
            bio
          )
        `)
        .eq('user_type', 'counsellor');

      if (error) {
        console.error('Error fetching counsellors:', error);
        toast({
          title: "Error loading counsellors",
          description: "Failed to load counsellor profiles. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched counsellors data:', data);
      
      // Filter out counsellors without counsellor_profiles
      const validCounsellors = (data || []).filter(counsellor => counsellor.counsellor_profiles);
      
      console.log('Valid counsellors:', validCounsellors);
      setCounsellors(validCounsellors);
      
      if (validCounsellors.length === 0) {
        toast({
          title: "No counsellors available",
          description: "No counsellor profiles are currently available. Please check back later.",
        });
      }
    } catch (error) {
      console.error('Error in fetchCounsellors:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading counsellors.",
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
        `${counsellor.first_name} ${counsellor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counsellor.counsellor_profiles?.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(counsellor =>
        counsellor.counsellor_profiles?.specialization === selectedSpecialization
      );
    }

    setFilteredCounsellors(filtered);
  };

  const getSpecializations = () => {
    const specializations = counsellors
      .map(c => c.counsellor_profiles?.specialization)
      .filter((spec, index, array) => spec && array.indexOf(spec) === index);
    return specializations as string[];
  };

  const startSession = async (counsellorId: string, type: 'chat' | 'video') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a session.",
        variant: "destructive",
      });
      return;
    }

    if (userType !== 'student') {
      toast({
        title: "Access denied",
        description: "Only students can start counselling sessions.",
        variant: "destructive",
      });
      return;
    }

    setCreatingSession(counsellorId);

    try {
      const { data, error } = await supabase
        .from('counselling_sessions')
        .insert({
          student_id: user.id,
          counsellor_id: counsellorId,
          status: 'pending',
          scheduled_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        toast({
          title: "Session creation failed",
          description: "Failed to create counselling session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Session created!",
        description: `Your ${type} session has been scheduled successfully.`,
      });

      if (type === 'video') {
        navigate('/video-call');
      } else {
        // Navigate to chat interface when it's available
        toast({
          title: "Session pending",
          description: "Your counsellor will be notified. Please wait for them to join.",
        });
      }
    } catch (error) {
      console.error('Error in startSession:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">
              {userType === 'student' ? 'Find Your Counsellor' : 'Connect with Students'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {userType === 'student' 
              ? 'Connect with experienced mental health professionals who understand your journey'
              : 'Help students on their mental health journey by providing professional support'
            }
          </p>
        </div>

        {userType === 'student' && (
          <>
            {/* Search and Filter */}
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background"
                >
                  <option value="">All Specializations</option>
                  {getSpecializations().map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Counsellors Grid */}
            {filteredCounsellors.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No counsellors found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedSpecialization 
                      ? 'Try adjusting your search criteria'
                      : 'No counsellors are currently available. Please check back later.'
                    }
                  </p>
                  {(searchTerm || selectedSpecialization) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedSpecialization('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCounsellors.map((counsellor) => (
                  <Card key={counsellor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-lg">
                              {counsellor.first_name[0]}{counsellor.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {counsellor.is_online && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              Dr. {counsellor.first_name} {counsellor.last_name}
                            </h3>
                            {counsellor.counsellor_profiles?.is_verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {counsellor.counsellor_profiles?.specialization}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{counsellor.counsellor_profiles?.experience} experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4" />
                          <span>{counsellor.completed_sessions} sessions completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`h-2 w-2 rounded-full ${counsellor.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={counsellor.is_online ? 'text-green-600' : 'text-muted-foreground'}>
                            {counsellor.is_online ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>

                      {counsellor.counsellor_profiles?.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {counsellor.counsellor_profiles.bio}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => startSession(counsellor.id, 'chat')}
                          disabled={creatingSession === counsellor.id}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => startSession(counsellor.id, 'video')}
                          disabled={creatingSession === counsellor.id}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Emergency Contact */}
        <Card className="mt-12 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Phone className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-900">Emergency Support</h3>
              </div>
              <p className="text-red-700 mb-4">
                If you're experiencing a mental health crisis or having thoughts of self-harm, 
                please reach out for immediate help.
              </p>
              <div className="space-y-2">
                <Button variant="destructive" size="lg" className="w-full md:w-auto">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 199 - Nigeria Crisis Helpline
                </Button>
                <p className="text-sm text-red-600">
                  Available 24/7 for immediate mental health crisis support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
