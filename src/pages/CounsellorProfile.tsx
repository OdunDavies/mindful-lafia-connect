
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, Award, Users, TrendingUp, Edit3, Save, X, Shield, Clock } from 'lucide-react';

interface CounsellorProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  profile_image_url: string;
  is_online: boolean;
  total_sessions: number;
  completed_sessions: number;
  cancelled_sessions: number;
  created_at: string;
  counsellor_profile: {
    specialization: string;
    license_number: string;
    experience: string;
    is_verified: boolean;
    verification_date: string;
    bio: string;
    availability_hours: any;
  };
}

const CounsellorProfile = () => {
  const [profile, setProfile] = useState<CounsellorProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          counsellor_profile:counsellor_profiles(*)
        `)
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnlineToggle = async (isOnline: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_online: isOnline,
          last_seen: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, is_online: isOnline } : null);
      
      toast({
        title: isOnline ? "You're now online" : "You're now offline",
        description: isOnline ? "Students can now see you're available for sessions" : "You're marked as offline",
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      toast({
        title: "Error",
        description: "Failed to update online status",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Update counsellor profile
      const { error: counsellorError } = await supabase
        .from('counsellor_profiles')
        .update({
          specialization: formData.counsellor_profile.specialization,
          experience: formData.counsellor_profile.experience,
          bio: formData.counsellor_profile.bio,
        })
        .eq('id', user?.id);

      if (counsellorError) throw counsellorError;

      setProfile(formData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string, isNested = false) => {
    if (isNested) {
      setFormData((prev: any) => ({
        ...prev,
        counsellor_profile: {
          ...prev.counsellor_profile,
          [field]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profile_image_url} />
                <AvatarFallback className="text-2xl">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold">Dr. {profile.first_name} {profile.last_name}</h2>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <User className="h-3 w-3 mr-1" />
                    Counsellor
                  </Badge>
                  <Badge variant="outline">
                    <Award className="h-3 w-3 mr-1" />
                    {profile.counsellor_profile?.specialization}
                  </Badge>
                  {profile.counsellor_profile?.is_verified && (
                    <Badge variant="default" className="bg-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant={profile.is_online ? "default" : "secondary"}>
                    <div className={`h-2 w-2 rounded-full mr-1 ${profile.is_online ? 'bg-green-400' : 'bg-gray-400'}`} />
                    {profile.is_online ? 'Online' : 'Offline'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <Label htmlFor="online-toggle" className="text-sm font-medium">
                    Available for sessions
                  </Label>
                  <Switch
                    id="online-toggle"
                    checked={profile.is_online}
                    onCheckedChange={handleOnlineToggle}
                  />
                </div>

                {isEditing ? (
                  <div>
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell students about your background and approach..."
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                    />
                  </div>
                ) : (
                  profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Phone</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">License Number</Label>
                <p className="mt-1">{profile.counsellor_profile?.license_number}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Member Since</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Specialization</Label>
                {isEditing ? (
                  <Input
                    value={formData.counsellor_profile?.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value, true)}
                  />
                ) : (
                  <p className="mt-1">{profile.counsellor_profile?.specialization}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Experience</Label>
                {isEditing ? (
                  <Input
                    value={formData.counsellor_profile?.experience || ''}
                    onChange={(e) => handleInputChange('experience', e.target.value, true)}
                  />
                ) : (
                  <p className="mt-1">{profile.counsellor_profile?.experience}</p>
                )}
              </div>

              {profile.counsellor_profile?.is_verified && (
                <div>
                  <Label className="text-sm font-medium">Verification Date</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>{new Date(profile.counsellor_profile.verification_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Session Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{profile.total_sessions}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{profile.completed_sessions}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{profile.cancelled_sessions}</p>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Availability Status
              </CardTitle>
              <CardDescription>
                Toggle your online status to let students know when you're available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Currently {profile.is_online ? 'Online' : 'Offline'}</p>
                  <p className="text-sm text-muted-foreground">
                    Last seen: {new Date(profile.last_seen || profile.created_at).toLocaleString()}
                  </p>
                </div>
                <Switch
                  checked={profile.is_online}
                  onCheckedChange={handleOnlineToggle}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile;
