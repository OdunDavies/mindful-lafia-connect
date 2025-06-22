
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'counsellor');

      console.log('Counsellors query result:', data, error);

      if (error) {
        console.error('Error fetching counsellors:', error);
        throw error;
      }

      // Map the data to include metadata fields
      const counsellorsWithMetadata = data?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        user_type: profile.user_type,
        // These would come from auth metadata during signup
        specialization: profile.specialization,
        license_number: profile.license_number,
        experience: profile.experience,
        last_seen: profile.updated_at, // Using updated_at as a proxy for last_seen
      })) || [];

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
