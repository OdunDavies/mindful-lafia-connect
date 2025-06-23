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
        .select(`
          *,
          profile_metadata (
            bio,
            specialization,
            license_number,
            experience,
            is_available,
            last_seen,
            profile_image_url
          )
        `)
        .eq('user_type', 'counsellor');

      if (profilesError) {
        console.error('Error fetching counsellor profiles:', profilesError);
        throw profilesError;
      }

      // Map the data with metadata
      const counsellorsWithMetadata = profilesData?.map(profile => {
        const metadata = profile.profile_metadata?.[0] || {};
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          user_type: profile.user_type,
          specialization: metadata.specialization || 'General Counselling',
          license_number: metadata.license_number || 'Not specified',
          experience: metadata.experience || 'Not specified',
          bio: metadata.bio || 'Professional counsellor dedicated to helping students achieve mental wellness.',
          is_available: metadata.is_available !== false, // Default to true if not set
          last_seen: metadata.last_seen || profile.updated_at,
          profile_image_url: metadata.profile_image_url,
        };
      }) || [];

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