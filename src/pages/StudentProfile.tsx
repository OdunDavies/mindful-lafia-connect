
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, BookOpen, Users, TrendingUp, Edit3, Save, X } from 'lucide-react';

interface StudentProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  profile_image_url: string;
  total_sessions: number;
  completed_sessions: number;
  cancelled_sessions: number;
  created_at: string;
  student_profile: {
    student_id: string;
    department: string;
    level: string;
    academic_year: string;
    emergency_contact: string;
    emergency_phone: string;
  };
}

const StudentProfile = () => {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
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
          student_profile:student_profiles(*)
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

      // Update student profile
      const { error: studentError } = await supabase
        .from('student_profiles')
        .update({
          department: formData.student_profile.department,
          level: formData.student_profile.level,
          academic_year: formData.student_profile.academic_year,
          emergency_contact: formData.student_profile.emergency_contact,
          emergency_phone: formData.student_profile.emergency_phone,
        })
        .eq('id', user?.id);

      if (studentError) throw studentError;

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
        student_profile: {
          ...prev.student_profile,
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
                    <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <User className="h-3 w-3 mr-1" />
                    Student
                  </Badge>
                  <Badge variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {profile.student_profile?.department}
                  </Badge>
                  <Badge variant="outline">
                    Level {profile.student_profile?.level}
                  </Badge>
                </div>

                {isEditing ? (
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
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
                <Label className="text-sm font-medium">Student ID</Label>
                <p className="mt-1">{profile.student_profile?.student_id}</p>
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

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Department</Label>
                {isEditing ? (
                  <Input
                    value={formData.student_profile?.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value, true)}
                  />
                ) : (
                  <p className="mt-1">{profile.student_profile?.department}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Level</Label>
                {isEditing ? (
                  <Input
                    value={formData.student_profile?.level || ''}
                    onChange={(e) => handleInputChange('level', e.target.value, true)}
                  />
                ) : (
                  <p className="mt-1">{profile.student_profile?.level}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Academic Year</Label>
                {isEditing ? (
                  <Input
                    value={formData.student_profile?.academic_year || ''}
                    onChange={(e) => handleInputChange('academic_year', e.target.value, true)}
                    placeholder="e.g., 2023/2024"
                  />
                ) : (
                  <p className="mt-1">{profile.student_profile?.academic_year || 'Not specified'}</p>
                )}
              </div>
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

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Contact Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.student_profile?.emergency_contact || ''}
                    onChange={(e) => handleInputChange('emergency_contact', e.target.value, true)}
                    placeholder="Emergency contact name"
                  />
                ) : (
                  <p className="mt-1">{profile.student_profile?.emergency_contact || 'Not provided'}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Contact Phone</Label>
                {isEditing ? (
                  <Input
                    value={formData.student_profile?.emergency_phone || ''}
                    onChange={(e) => handleInputChange('emergency_phone', e.target.value, true)}
                    placeholder="Emergency contact phone"
                  />
                ) : (
                  <p className="mt-1">{profile.student_profile?.emergency_phone || 'Not provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
