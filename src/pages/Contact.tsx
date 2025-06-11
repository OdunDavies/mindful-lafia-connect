
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Award,
  MessageSquare,
  Video,
  Star,
  CheckCircle,
  Search
} from 'lucide-react';

interface Counsellor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image_url: string;
  is_online: boolean;
  last_seen: string;
  counsellor_profile: {
    specialization: string;
    license_number: string;
    experience: string;
    is_verified: boolean;
    bio: string;
  };
}

const Contact = () => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCounsellors();
  }, []);

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
          profile_image_url,
          is_online,
          last_seen,
          counsellor_profile:counsellor_profiles(
            specialization,
            license_number,
            experience,
            is_verified,
            bio
          )
        `)
        .eq('user_type', 'counsellor')
        .not('counsellor_profile', 'is', null);

      if (error) {
        console.error('Error fetching counsellors:', error);
        throw error;
      }

      console.log('Counsellors fetched:', data);
      setCounsellors(data || []);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      toast({
        title: "Error",
        description: "Failed to load counsellors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (counsellorId: string) => {
    try {
      const { data, error } = await supabase
        .from('counselling_sessions')
        .insert({
          student_id: user?.id,
          counsellor_id: counsellorId,
          status: 'pending',
          scheduled_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session request sent",
        description: "The counsellor will be notified of your session request.",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCounsellors = counsellors.filter(counsellor => {
    const matchesSearch = 
      counsellor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counsellor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counsellor.counsellor_profile?.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = 
      !selectedSpecialization || 
      counsellor.counsellor_profile?.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  const specializations = Array.from(
    new Set(counsellors.map(c => c.counsellor_profile?.specialization).filter(Boolean))
  );

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find a Counsellor</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with professional counsellors who are ready to support your mental health journey. 
            All our counsellors are licensed professionals dedicated to student wellbeing.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search counsellors by name or specialization..."
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
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Counsellors Grid */}
        {filteredCounsellors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No counsellors found</h3>
              <p className="text-muted-foreground mb-4">
                {counsellors.length === 0 
                  ? "No counsellors are currently registered on the platform."
                  : "Try adjusting your search criteria."
                }
              </p>
              {counsellors.length === 0 && (
                <Button onClick={fetchCounsellors}>
                  Refresh
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounsellors.map((counsellor) => (
              <Card key={counsellor.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={counsellor.profile_image_url} />
                      <AvatarFallback className="text-lg">
                        {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        Dr. {counsellor.first_name} {counsellor.last_name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {counsellor.counsellor_profile?.specialization}
                        </Badge>
                        {counsellor.counsellor_profile?.is_verified && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge 
                          variant={counsellor.is_online ? "default" : "secondary"}
                          className="text-xs"
                        >
                          <div className={`h-2 w-2 rounded-full mr-1 ${
                            counsellor.is_online ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          {counsellor.is_online ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Experience:</strong> {counsellor.counsellor_profile?.experience}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>License:</strong> {counsellor.counsellor_profile?.license_number}
                    </p>
                  </div>

                  {counsellor.counsellor_profile?.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {counsellor.counsellor_profile.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Last seen: {new Date(counsellor.last_seen).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => startSession(counsellor.id)}
                      disabled={user?.user_metadata?.user_type !== 'student'}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Start Chat
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startSession(counsellor.id)}
                      disabled={user?.user_metadata?.user_type !== 'student'}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Video Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contact Information
            </CardTitle>
            <CardDescription>
              If you're experiencing a mental health emergency, please contact these resources immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">FULAFIA Counselling Center</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+234 803 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>counselling@fulafia.edu.ng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Student Affairs Building, FULAFIA Campus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>24/7 Online Support Available</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Emergency Helplines</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Mental Health Helpline: 199</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Crisis Support: +234 806 210 6493</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>University Security: +234 803 999 8888</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
