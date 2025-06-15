
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
      // Don't show error toast for profile check, just log it
      return;
    }

    const userType = user.user_metadata?.user_type || 'student';
    console.log('User type:', userType);

    if (!existingProfile) {
      console.log('No existing profile found, creating new one...');
      
      // Create main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          user_type: userType,
          phone: user.user_metadata?.phone || null,
          email_verified: user.email_confirmed_at ? true : false
        });

      if (profileError) {
        console.error('Error creating main profile:', profileError);
        toast({
          title: "Profile creation failed",
          description: "There was an error creating your profile. Please try signing in again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Main profile created successfully');

      // Create type-specific profile
      if (userType === 'student') {
        const { error: studentProfileError } = await supabase
          .from('student_profiles')
          .insert({
            id: user.id,
            student_id: user.user_metadata?.student_id || '',
            department: user.user_metadata?.department || '',
            level: user.user_metadata?.level || '',
          });

        if (studentProfileError) {
          console.error('Error creating student profile:', studentProfileError);
          // Don't block for student profile errors
        } else {
          console.log('Student profile created successfully');
        }
      } else if (userType === 'counsellor') {
        const { error: counsellorProfileError } = await supabase
          .from('counsellor_profiles')
          .insert({
            id: user.id,
            specialization: user.user_metadata?.specialization || '',
            license_number: user.user_metadata?.license_number || '',
            experience: user.user_metadata?.experience || '',
          });

        if (counsellorProfileError) {
          console.error('Error creating counsellor profile:', counsellorProfileError);
          // Don't block for counsellor profile errors
        } else {
          console.log('Counsellor profile created successfully');
        }
      }

      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });
    } else {
      console.log('Profile already exists:', existingProfile);
    }
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    // Don't show error toast to avoid blocking the user experience
  }
};
