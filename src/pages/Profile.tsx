
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, School, Award, Calendar, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [counsellorProfile, setCounsellorProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    console.log('Fetching profile for user:', user.id);
    setProfileLoading(true);
    setError(null);
    
    try {
      // Fetch main profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setError('Failed to load profile data');
        // Still show the UI with default values
        setProfile({
          id: user.id,
          email: user.email || '',
          first_name: '',
          last_name: '',
          phone: '',
          user_type: 'student'
        });
        setProfileLoading(false);
        return;
      }
      
      console.log('Profile fetch result:', profileData);
      
      if (profileData) {
        setProfile(profileData);
        const actualUserType = profileData.user_type;
        
        if (actualUserType === 'student') {
          console.log('Fetching student profile...');
          const { data: studentData, error: studentError } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (!studentError && studentData) {
            setStudentProfile(studentData);
          } else if (studentError) {
            console.error('Student profile fetch error:', studentError);
          }
        } else if (actualUserType === 'counsellor') {
          console.log('Fetching counsellor profile...');
          const { data: counsellorData, error: counsellorError } = await supabase
            .from('counsellor_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (!counsellorError && counsellorData) {
            setCounsellorProfile(counsellorData);
          } else if (counsellorError) {
            console.error('Counsellor profile fetch error:', counsellorError);
          }
        }
      } else {
        // Profile doesn't exist, create default and try to create in backend
        console.log('No profile found, creating default profile...');
        const defaultProfile = {
          id: user.id,
          email: user.email || '',
          first_name: '',
          last_name: '',
          phone: '',
          user_type: 'student'
        };
        setProfile(defaultProfile);
        
        // Try to create profile in background
        try {
          const { createUserProfile } = await import('@/utils/profileUtils');
          await createUserProfile(user, toast);
          // Retry fetching after creation
          setTimeout(() => fetchProfile(), 1500);
        } catch (createError) {
          console.error('Error creating profile:', createError);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Using offline mode.');
      // Show default profile even if backend fails
      setProfile({
        id: user.id,
        email: user.email || '',
        first_name: '',
        last_name: '',
        phone: '',
        user_type: 'student'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (field: string, value: string) => {
    if (!user || !profile) return;

    // Update local state immediately for better UX
    setProfile((prev: any) => ({ ...prev, [field]: value }));

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert local state on error
      setProfile((prev: any) => ({ ...prev, [field]: prev[field] }));
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Changes saved locally.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStudentProfile = async (field: string, value: string) => {
    if (!user) return;

    // Update local state immediately
    setStudentProfile((prev: any) => ({ ...prev, [field]: value }));

    setLoading(true);
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Student profile updated",
        description: "Your student information has been updated.",
      });
    } catch (error) {
      console.error('Error updating student profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your student profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCounsellorProfile = async (field: string, value: string) => {
    if (!user) return;

    // Update local state immediately
    setCounsellorProfile((prev: any) => ({ ...prev, [field]: value }));

    setLoading(true);
    try {
      const { error } = await supabase
        .from('counsellor_profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Counsellor profile updated",
        description: "Your counsellor information has been updated.",
      });
    } catch (error) {
      console.error('Error updating counsellor profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your counsellor profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userType = profile?.user_type || 'student';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
              <Button onClick={fetchProfile} variant="outline" size="sm" className="ml-auto">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile?.first_name || ''}
                  onChange={(e) => updateProfile('first_name', e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile?.last_name || ''}
                  onChange={(e) => updateProfile('last_name', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                value={profile?.email || user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={profile?.phone || ''}
                onChange={(e) => updateProfile('phone', e.target.value)}
                disabled={loading}
                placeholder="Enter your phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Student-specific Information */}
        {userType === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Student Information
              </CardTitle>
              <CardDescription>
                Your academic details and student ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={studentProfile?.student_id || ''}
                  onChange={(e) => updateStudentProfile('student_id', e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Department
                </Label>
                <Input
                  id="department"
                  value={studentProfile?.department || ''}
                  onChange={(e) => updateStudentProfile('department', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Level
                </Label>
                <Input
                  id="level"
                  value={studentProfile?.level || ''}
                  onChange={(e) => updateStudentProfile('level', e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Counsellor-specific Information */}
        {userType === 'counsellor' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Counsellor Information
              </CardTitle>
              <CardDescription>
                Your professional credentials and specialization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={counsellorProfile?.specialization || ''}
                  onChange={(e) => updateCounsellorProfile('specialization', e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={counsellorProfile?.license_number || ''}
                  onChange={(e) => updateCounsellorProfile('license_number', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={counsellorProfile?.experience || ''}
                  onChange={(e) => updateCounsellorProfile('experience', e.target.value)}
                  disabled={loading}
                  placeholder="e.g., 5 years"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
