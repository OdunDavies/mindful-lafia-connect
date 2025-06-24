
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Phone } from 'lucide-react';

const EmergencySupport = () => {
  return (
    <Card className="mt-8 bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Need Immediate Help?
        </CardTitle>
        <CardDescription className="text-red-700">
          If you're experiencing a mental health crisis, don't wait for an appointment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button variant="destructive" size="sm" className="w-full md:w-auto">
            <Phone className="h-4 w-4 mr-2" />
            Emergency: Call 199 (Nigeria Crisis Helpline)
          </Button>
          <p className="text-sm text-red-600">
            Available 24/7 for immediate mental health crisis support
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencySupport;
