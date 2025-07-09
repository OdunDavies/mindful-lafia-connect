
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AssessmentResult {
  id: string;
  score: number;
  risk_level: string;
  recommendations: string;
  created_at: string;
  responses: Record<string, number>;
}

export const useLatestAssessment = () => {
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLatestAssessment = async () => {
    if (!user || user?.user_metadata?.user_type !== 'student') {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('self_assessments')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching latest assessment:', error);
        throw error;
      }

      setAssessment(data);
    } catch (error) {
      console.error('Error fetching latest assessment:', error);
      toast({
        title: "Error loading assessment",
        description: "Failed to load your latest assessment results.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestAssessment();
  }, [user]);

  return { assessment, loading, refetch: fetchLatestAssessment };
};
