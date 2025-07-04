
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCounsellors } from '@/hooks/useCounsellors';
import { useCounsellingSession } from '@/hooks/useCounsellingSession';
import CounsellorCard from '@/components/contact/CounsellorCard';
import EmergencySupport from '@/components/contact/EmergencySupport';
import CounsellorView from '@/components/contact/CounsellorView';
import { Search, Filter, Heart, Users } from 'lucide-react';

const Contact = () => {
  const [filteredCounsellors, setFilteredCounsellors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { counsellors, loading } = useCounsellors();
  const { handleStartSession, creatingSession } = useCounsellingSession();

  const userType = user?.user_metadata?.user_type || 'student';

  useEffect(() => {
    filterCounsellors();
  }, [counsellors, searchTerm]);

  const filterCounsellors = () => {
    let filtered = counsellors;

    if (searchTerm) {
      filtered = filtered.filter(counsellor =>
        `${counsellor.first_name} ${counsellor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCounsellors(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">
            {userType === 'student' ? 'Find a Counsellor' : 'Student Connections'}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {userType === 'student' 
            ? "Connect with professional counsellors who understand your needs and can provide the support you deserve."
            : "View students who may need your professional guidance and support."
          }
        </p>
      </div>

      {userType === 'student' && (
        <>
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Counsellors Grid */}
          {filteredCounsellors.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No counsellors found</h3>
                <p className="text-muted-foreground mb-4">
                  {counsellors.length === 0 
                    ? "No counsellors are currently registered on the platform."
                    : "Try adjusting your search criteria to find counsellors."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCounsellors.map((counsellor) => (
                <CounsellorCard
                  key={counsellor.id}
                  counsellor={counsellor}
                  onStartSession={handleStartSession}
                  isCreatingSession={creatingSession === counsellor.id}
                />
              ))}
            </div>
          )}

          <EmergencySupport />
        </>
      )}

      {userType === 'counsellor' && <CounsellorView />}
    </div>
  );
};

export default Contact;
