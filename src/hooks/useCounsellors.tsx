
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CounsellorData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  specialization?: string;
  license_number?: string;
  experience?: string;
  bio?: string;
  is_available?: boolean;
  last_seen?: string;
  profile_image_url?: string;
  total_sessions?: number;
  completed_sessions?: number;
  active_sessions?: number;
}

export const useCounsellors = () => {
  const [counsellors, setCounsellors] = useState<CounsellorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCounsellors = async () => {
    try {
      console.log('Fetching counsellors...');
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'counsellor');

      if (profilesError) {
        console.error('Error fetching counsellor profiles:', profilesError);
        throw profilesError;
      }

      // Map the data with proper metadata access
      const counsellorsWithMetadata = profilesData?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        user_type: profile.user_type,
        specialization: profile.specialization || 'General Counselling',
        license_number: profile.license_number || 'Not specified',
        experience: profile.experience || 'Not specified',
        bio: 'Professional counsellor dedicated to helping students achieve mental wellness.',
        is_available: true, // Can be enhanced with real-time presence
        last_seen: profile.last_seen || profile.updated_at,
        profile_image_url: undefined, // Can be added later with file upload
        total_sessions: profile.total_sessions || 0,
        completed_sessions: profile.completed_sessions || 0,
        active_sessions: profile.active_sessions || 0,
      })) || [];

      console.log('Counsellors with metadata:', counsellorsWithMetadata);
      setCounsellors(counsellorsWithMetadata);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      toast({
        title: "Error loading counsellors",
        description: "Failed to load counsellor profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  return { counsellors, loading, refetch: fetchCounsellors };
};
