
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Video, MessageCircle, Star, MapPin, Clock, Users } from 'lucide-react';

interface CounsellorProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  specialization: string;
  experience: string;
  license_number: string;
}

const Contact = () => {
  const [counsellors, setCounsellors] = useState<CounsellorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          counsellor_profiles!inner(
            specialization,
            experience,
            license_number
          )
        `)
        .eq('user_type', 'counsellor');

      if (error) throw error;

      const formattedCounsellors = data?.map(counsellor => ({
        id: counsellor.id,
        first_name: counsellor.first_name,
        last_name: counsellor.last_name,
        email: counsellor.email,
        specialization: counsellor.counsellor_profiles?.specialization || '',
        experience: counsellor.counsellor_profiles?.experience || '',
        license_number: counsellor.counsellor_profiles?.license_number || ''
      })) || [];

      setCounsellors(formattedCounsellors);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      toast({
        title: "Error",
        description: "Failed to load counsellors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (counsellorId: string, sessionType: 'chat' | 'video') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a session",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

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

      if (error) throw error;

      toast({
        title: "Session Created",
        description: `${sessionType === 'video' ? 'Video call' : 'Chat'} session has been initiated`,
      });

      // Navigate to the video call page (which includes both video and chat)
      navigate(`/video-call?session=${data.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      title: "Emergency Support",
      description: "24/7 crisis support available",
      contact: "Emergency Hotline: 988",
      icon: "🚨"
    },
    {
      title: "General Inquiries",
      description: "Questions about our services",
      contact: "info@mentalhealth.edu",
      icon: "📧"
    },
    {
      title: "Technical Support",
      description: "Help with platform issues",
      contact: "support@mentalhealth.edu",
      icon: "🔧"
    },
    {
      title: "Office Hours",
      description: "Monday - Friday: 8:00 AM - 8:00 PM",
      contact: "Weekend: 10:00 AM - 6:00 PM",
      icon: "🕐"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Connect with Our Counsellors</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your journey to better mental health by connecting with our licensed professional counsellors
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Get In Touch</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl mb-2">{info.icon}</div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{info.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Available Counsellors */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Available Counsellors</h2>
              <p className="text-muted-foreground">Connect instantly with our licensed mental health professionals</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {counsellors.length} counsellors available
            </div>
          </div>

          {counsellors.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No counsellors are currently available. Please check back later.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counsellors.map((counsellor) => (
                <Card key={counsellor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold">
                          {counsellor.first_name.charAt(0)}{counsellor.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          Dr. {counsellor.first_name} {counsellor.last_name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="secondary" className="mb-2">
                            {counsellor.specialization}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {counsellor.experience} of experience
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        License: {counsellor.license_number}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-muted-foreground">(4.9)</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => startSession(counsellor.id, 'chat')}
                        variant="outline" 
                        className="flex-1 gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </Button>
                      <Button 
                        onClick={() => startSession(counsellor.id, 'video')}
                        className="flex-1 gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Video Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Additional Information */}
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
                <CardDescription>What to expect from your counselling sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Session Duration</h4>
                    <p className="text-sm text-muted-foreground">Typically 45-50 minutes per session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Confidentiality</h4>
                    <p className="text-sm text-muted-foreground">All sessions are completely confidential and secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Flexible Scheduling</h4>
                    <p className="text-sm text-muted-foreground">Schedule sessions that fit your availability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Immediate Help?</CardTitle>
                <CardDescription>Crisis support and emergency resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">Crisis Hotline</h4>
                  <p className="text-sm mb-2">If you're experiencing a mental health emergency:</p>
                  <p className="font-mono text-lg">988</p>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Campus Security</h4>
                  <p className="text-sm mb-2">For on-campus emergencies:</p>
                  <p className="font-mono text-lg">(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
