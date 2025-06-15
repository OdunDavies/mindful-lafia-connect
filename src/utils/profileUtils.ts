
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const createUserProfile = async (user: User, toast: any) => {
  try {
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

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          user_type: userType,
          phone: user.user_metadata?.phone || null
        });

      if (profileError) {
        console.error('Error creating main profile:', profileError);
        toast({
          title: "Profile creation failed",
          description: "There was an error creating your profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

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
          toast({
            title: "Student profile creation failed",
            description: "There was an error creating your student profile.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Your student profile has been created successfully.",
          });
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
          toast({
            title: "Counsellor profile creation failed",
            description: "There was an error creating your counsellor profile.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Your counsellor profile has been created successfully.",
          });
        }
      }
    }
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    toast({
      title: "Profile setup error",
      description: "There was an error setting up your profile. Please contact support.",
      variant: "destructive",
    });
  }
};
