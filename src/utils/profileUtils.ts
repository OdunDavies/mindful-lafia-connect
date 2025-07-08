
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const createUserProfile = async (user: User, toast: any) => {
  try {
    console.log('Creating profile for user:', user.id, user.user_metadata);
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, user_type')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing profile:', fetchError);
      return;
    }

    const userType = user.user_metadata?.user_type || 'student';
    console.log('User type:', userType);

    if (!existingProfile) {
      console.log('No existing profile found, creating new one...');
      
      // Create main profile with all fields including metadata
      const profileData: any = {
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        user_type: userType,
        phone: user.user_metadata?.phone || null,
        email_verified: user.email_confirmed_at ? true : false,
        // Initialize session statistics
        total_sessions: 0,
        completed_sessions: 0,
        cancelled_sessions: 0,
        active_sessions: 0,
      };

      // Add user-type specific metadata
      if (userType === 'student') {
        profileData.student_id = user.user_metadata?.student_id || null;
        profileData.department = user.user_metadata?.department || null;
        profileData.level = user.user_metadata?.level || null;
      } else if (userType === 'counsellor') {
        profileData.specialization = user.user_metadata?.specialization || null;
        profileData.license_number = user.user_metadata?.license_number || null;
        profileData.experience = user.user_metadata?.experience || null;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          title: "Profile creation failed",
          description: "There was an error creating your profile. Please try signing in again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Profile created successfully');

      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });
    } else {
      console.log('Profile already exists:', existingProfile);
    }
  } catch (error) {
    console.error('Error in createUserProfile:', error);
  }
};
