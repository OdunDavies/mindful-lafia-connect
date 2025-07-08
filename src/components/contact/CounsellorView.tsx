
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStudents } from '@/hooks/useStudents';
import { useCounsellingSession } from '@/hooks/useCounsellingSession';
import EnhancedStudentCard from '@/components/contact/EnhancedStudentCard';
import { Search, Filter, Users, GraduationCap } from 'lucide-react';

const CounsellorView = () => {
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { students, loading } = useStudents();
  const { handleStartSession, creatingSession } = useCounsellingSession();

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">Student Connections</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with students who may need your professional guidance and support.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, student ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Enhanced Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground mb-4">
              {students.length === 0 
                ? "No students are currently registered on the platform."
                : "Try adjusting your search criteria to find students."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <EnhancedStudentCard
              key={student.id}
              student={student}
              onStartSession={handleStartSession}
              isCreatingSession={creatingSession === student.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CounsellorView;
