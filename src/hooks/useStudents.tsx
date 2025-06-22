
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  student_id?: string;
  department?: string;
  level?: string;
  assessment_score?: number;
  risk_level?: string;
  last_assessment_date?: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      console.log('Fetching students...');
      
      // First, get all student profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'student');

      if (profilesError) {
        console.error('Error fetching student profiles:', profilesError);
        throw profilesError;
      }

      // Then, get the latest assessment for each student
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('self_assessments')
        .select('student_id, score, risk_level, created_at')
        .order('created_at', { ascending: false });

      if (assessmentsError) {
        console.error('Error fetching assessments:', assessmentsError);
        // Don't throw here, just log - assessments are optional
      }

      // Combine profile data with assessment data
      const studentsWithAssessments = profilesData?.map(profile => {
        const latestAssessment = assessmentsData?.find(
          assessment => assessment.student_id === profile.id
        );

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          user_type: profile.user_type,
          // Extract metadata from user if available (these would come from auth metadata)
          student_id: profile.student_id,
          department: profile.department,
          level: profile.level,
          // Assessment data
          assessment_score: latestAssessment?.score,
          risk_level: latestAssessment?.risk_level,
          last_assessment_date: latestAssessment?.created_at,
        };
      }) || [];

      console.log('Students with assessments:', studentsWithAssessments);
      setStudents(studentsWithAssessments);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error loading students",
        description: "Failed to load student profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, refetch: fetchStudents };
};
