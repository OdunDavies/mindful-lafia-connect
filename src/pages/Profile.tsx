
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import EditableProfileSection from '@/components/profile/EditableProfileSection';
import StudentProfileSection from '@/components/profile/StudentProfileSection';
import CounsellorProfileSection from '@/components/profile/CounsellorProfileSection';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userType = user.user_metadata?.user_type || 'student';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Your account information and {userType === 'student' ? 'academic' : 'professional'} details
          </p>
        </div>

        <EditableProfileSection user={user} />
        
        {userType === 'student' && <StudentProfileSection user={user} />}
        {userType === 'counsellor' && <CounsellorProfileSection user={user} />}
      </div>
    </div>
  );
};

export default Profile;
