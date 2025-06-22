
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
  last_seen?: string;
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

      // Map the data - metadata will need to be stored in the profiles table or accessed differently
      const counsellorsWithMetadata = profilesData?.map(profile => {
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          user_type: profile.user_type,
          // For now, these will be undefined until we have a way to store/access them
          // In a real implementation, these would be stored in the profiles table or accessed via server-side functions
          specialization: undefined,
          license_number: undefined,
          experience: undefined,
          last_seen: profile.updated_at, // Using updated_at as a proxy for last_seen
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
