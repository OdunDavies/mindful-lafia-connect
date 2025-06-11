import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Create profile if user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            await ensureUserProfile(session.user);
          }, 100);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      console.log('Ensuring profile for user:', user.id);
      
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError);
        return;
      }

      if (existingProfile) {
        console.log('Profile already exists');
        return;
      }

      // Create main profile
      const userType = user.user_metadata?.user_type || 'student';
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          user_type: userType,
          phone: user.user_metadata?.phone || null,
          bio: null,
          profile_image_url: null,
          is_online: false,
          last_seen: new Date().toISOString(),
          total_sessions: 0,
          completed_sessions: 0,
          cancelled_sessions: 0
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return;
      }

      // Create specific profile based on user type
      if (userType === 'student') {
        const { error: studentError } = await supabase
          .from('student_profiles')
          .insert({
            id: user.id,
            student_id: user.user_metadata?.student_id || '',
            department: user.user_metadata?.department || '',
            level: user.user_metadata?.level || '',
            academic_year: user.user_metadata?.academic_year || null,
            emergency_contact: user.user_metadata?.emergency_contact || null,
            emergency_phone: user.user_metadata?.emergency_phone || null
          });

        if (studentError) {
          console.error('Error creating student profile:', studentError);
        }
      } else if (userType === 'counsellor') {
        const { error: counsellorError } = await supabase
          .from('counsellor_profiles')
          .insert({
            id: user.id,
            specialization: user.user_metadata?.specialization || '',
            license_number: user.user_metadata?.license_number || '',
            experience: user.user_metadata?.experience || '',
            is_verified: false,
            verification_date: null,
            bio: null,
            availability_hours: {}
          });

        if (counsellorError) {
          console.error('Error creating counsellor profile:', counsellorError);
        }
      }

      console.log('Profile created successfully');
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('Signing up user with data:', userData);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sign up successful!",
        description: "Please check your email to verify your account.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
