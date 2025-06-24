
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, UserCheck } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface BasicProfileSectionProps {
  user: SupabaseUser;
}

const BasicProfileSection = ({ user }: BasicProfileSectionProps) => {
  const metadata = user.user_metadata || {};
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Your personal and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              First Name
            </div>
            <div className="p-3 bg-muted rounded-md">
              {metadata.first_name || 'Not provided'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Last Name
            </div>
            <div className="p-3 bg-muted rounded-md">
              {metadata.last_name || 'Not provided'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Mail className="h-4 w-4" />
            Email Address
          </div>
          <div className="p-3 bg-muted rounded-md">
            {user.email}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Phone className="h-4 w-4" />
            Phone Number
          </div>
          <div className="p-3 bg-muted rounded-md">
            {metadata.phone || 'Not provided'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UserCheck className="h-4 w-4" />
            User Type
          </div>
          <div className="p-3 bg-muted rounded-md capitalize">
            {metadata.user_type || 'Not specified'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicProfileSection;
