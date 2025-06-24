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
      
      // Create main profile with only essential fields
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

      // Create profile metadata with additional information
      const metadataToInsert: any = {
        id: user.id,
        bio: userType === 'student' 
          ? 'Student seeking mental health support and guidance.'
          : 'Professional counsellor dedicated to helping students achieve mental wellness.',
        is_available: userType === 'counsellor' ? true : undefined,
      };

      // Add user-type specific metadata
      if (userType === 'student') {
        metadataToInsert.student_id = user.user_metadata?.student_id || null;
        metadataToInsert.department = user.user_metadata?.department || null;
        metadataToInsert.level = user.user_metadata?.level || null;
      } else if (userType === 'counsellor') {
        metadataToInsert.specialization = user.user_metadata?.specialization || 'General Counselling';
        metadataToInsert.license_number = user.user_metadata?.license_number || null;
        metadataToInsert.experience = user.user_metadata?.experience || null;
      }

      const { error: metadataError } = await supabase
        .from('profile_metadata')
        .insert(metadataToInsert);

      if (metadataError) {
        console.error('Error creating profile metadata:', metadataError);
        // Don't fail the whole process for metadata errors
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