
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

      // Get auth users to access metadata
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Error fetching auth users:', usersError);
        // Continue without metadata if we can't fetch users
      }

      // Map the data to include metadata fields
      const counsellorsWithMetadata = profilesData?.map(profile => {
        // Find corresponding auth user for metadata
        const authUser = users?.find(user => user.id === profile.id);
        const metadata = authUser?.user_metadata || {};

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          user_type: profile.user_type,
          // Extract metadata from auth user
          specialization: metadata.specialization,
          license_number: metadata.license_number,
          experience: metadata.experience,
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
