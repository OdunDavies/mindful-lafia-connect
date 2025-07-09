
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AssignedCounsellor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  license_number?: string;
  experience?: string;
  is_available?: boolean;
  profile_image_url?: string;
}

export const useAssignedCounsellor = () => {
  const [counsellor, setCounsellor] = useState<AssignedCounsellor | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAssignedCounsellor = async () => {
    if (!user || user?.user_metadata?.user_type !== 'student') {
      setLoading(false);
      return;
    }

    try {
      // For now, assign the first available counsellor
      // In a real app, this would be based on actual assignment logic
      const { data: counsellors, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'counsellor')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching assigned counsellor:', error);
        throw error;
      }

      if (counsellors) {
        setCounsellor({
          id: counsellors.id,
          first_name: counsellors.first_name,
          last_name: counsellors.last_name,
          email: counsellors.email,
          phone: counsellors.phone,
          specialization: counsellors.specialization || 'General Counselling',
          license_number: counsellors.license_number,
          experience: counsellors.experience,
          is_available: true,
          profile_image_url: undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching assigned counsellor:', error);
      toast({
        title: "Error loading counsellor",
        description: "Failed to load your assigned counsellor information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedCounsellor();
  }, [user]);

  return { counsellor, loading, refetch: fetchAssignedCounsellor };
};
