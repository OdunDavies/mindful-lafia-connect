
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCounsellors } from '@/hooks/useCounsellors';
import { useCounsellingSession } from '@/hooks/useCounsellingSession';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Phone, Clock, Award, Shield, Search, Filter, Users, Heart } from 'lucide-react';

const ContactPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { counsellors, loading } = useCounsellors();
  const { handleStartSession, creatingSession } = useCounsellingSession();
  const { user } = useAuth();

  const filteredCounsellors = counsellors.filter(counsellor =>
    `${counsellor.first_name} ${counsellor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counsellor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counsellor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Professional Counsellors</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with our professional counsellors who are here to provide the support and guidance you need.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, specialty, or email..."
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
                  ? "No counsellors are currently available on the platform."
                  : "Try adjusting your search criteria to find counsellors."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounsellors.map((counsellor) => (
              <Card key={counsellor.id} className="w-full">
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage 
                      src={counsellor.profile_image_url} 
                      alt={`${counsellor.first_name} ${counsellor.last_name}`} 
                    />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <CardTitle className="text-xl">
                        Dr. {counsellor.first_name} {counsellor.last_name}
                      </CardTitle>
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        <Award className="h-3 w-3 mr-1" />
                        Licensed Counsellor
                      </Badge>
                      {counsellor.is_available && (
                        <Badge variant="default" className="bg-green-500 text-sm">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specialization */}
                  {counsellor.specialization && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Area of Expertise</div>
                      <div className="font-medium">{counsellor.specialization}</div>
                    </div>
                  )}

                  {/* Experience */}
                  {counsellor.experience && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Experience</div>
                      <div className="font-medium">{counsellor.experience}</div>
                    </div>
                  )}

                  {/* License */}
                  {counsellor.license_number && counsellor.license_number !== 'Not specified' && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">License Number</div>
                      <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {counsellor.license_number}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-green-500" />
                      <span className="text-sm truncate">{counsellor.email}</span>
                    </div>
                    {counsellor.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{counsellor.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Available during business hours</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleStartSession(counsellor.id)}
                    disabled={creatingSession === counsellor.id || !counsellor.is_available}
                    className="w-full mt-4"
                  >
                    {creatingSession === counsellor.id ? 'Starting Session...' : 'Contact Counsellor'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
