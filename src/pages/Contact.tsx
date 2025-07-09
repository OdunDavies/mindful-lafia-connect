
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAssignedCounsellor } from '@/hooks/useAssignedCounsellor';
import { useCounsellingSession } from '@/hooks/useCounsellingSession';
import { CounsellorInfoCard } from '@/components/counsellor/CounsellorInfoCard';
import EmergencySupport from '@/components/contact/EmergencySupport';
import CounsellorView from '@/components/contact/CounsellorView';
import { Heart } from 'lucide-react';

const Contact = () => {
  const { user } = useAuth();
  const { counsellor: assignedCounsellor, loading: assignedLoading } = useAssignedCounsellor();
  const { handleStartSession, creatingSession } = useCounsellingSession();

  const userType = user?.user_metadata?.user_type || 'student';

  if (assignedLoading) {
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
            {userType === 'student' ? 'Your Counsellor' : 'Student Connections'}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {userType === 'student' 
            ? "Connect with your assigned professional counsellor who understands your needs and can provide the support you deserve."
            : "View students who may need your professional guidance and support."
          }
        </p>
      </div>

      {userType === 'student' && (
        <>
          {/* Assigned Counsellor Section */}
          {assignedCounsellor ? (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-center mb-6">Your Assigned Counsellor</h2>
              <div className="flex justify-center">
                <CounsellorInfoCard
                  counsellor={assignedCounsellor}
                  onStartSession={handleStartSession}
                  isCreatingSession={creatingSession === assignedCounsellor.id}
                />
              </div>
            </section>
          ) : (
            <Card className="text-center py-12 mb-12">
              <CardContent>
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No counsellor assigned yet</h3>
                <p className="text-muted-foreground mb-4">
                  You will be assigned a counsellor soon. Please check back later.
                </p>
              </CardContent>
            </Card>
          )}

          <EmergencySupport />
        </>
      )}

      {userType === 'counsellor' && <CounsellorView />}
    </div>
  );
};

export default Contact;
