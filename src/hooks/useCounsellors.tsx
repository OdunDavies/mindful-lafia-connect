
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CounsellorData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
        .select('id, first_name, last_name, email, phone')
        .eq('user_type', 'counsellor');

      console.log('Counsellors query result:', data, error);

      if (error) {
        console.error('Error fetching counsellors:', error);
        throw error;
      }

      setCounsellors(data || []);
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
