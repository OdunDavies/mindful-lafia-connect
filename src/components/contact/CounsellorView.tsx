
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CounsellorView = () => {
  const navigate = useNavigate();

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Student Connection Hub</h3>
        <p className="text-muted-foreground mb-4">
          Students will be able to find and connect with you through this platform.
          Your profile is now active and visible to students.
        </p>
        <Button onClick={() => navigate('/')}>
          <ChevronRight className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default CounsellorView;
