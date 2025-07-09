
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X } from 'lucide-react';

interface EditableProfileSectionProps {
  user: User;
  onProfileUpdate?: () => void;
}

const EditableProfileSection = ({ user, onProfileUpdate }: EditableProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || '',
    phone: user.user_metadata?.phone || '',
    // Student fields
    student_id: user.user_metadata?.student_id || '',
    department: user.user_metadata?.department || '',
    level: user.user_metadata?.level || '',
    // Counsellor fields
    specialization: user.user_metadata?.specialization || '',
    license_number: user.user_metadata?.license_number || '',
    experience: user.user_metadata?.experience || '',
  });
  const { toast } = useToast();

  const userType = user.user_metadata?.user_type || 'student';

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: formData
      });

      if (authError) throw authError;

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          student_id: formData.student_id,
          department: formData.department,
          level: formData.level,
          specialization: formData.specialization,
          license_number: formData.license_number,
          experience: formData.experience,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setIsEditing(false);
      onProfileUpdate?.();
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      phone: user.user_metadata?.phone || '',
      student_id: user.user_metadata?.student_id || '',
      department: user.user_metadata?.department || '',
      level: user.user_metadata?.level || '',
      specialization: user.user_metadata?.specialization || '',
      license_number: user.user_metadata?.license_number || '',
      experience: user.user_metadata?.experience || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal and professional details</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            {isEditing ? (
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            ) : (
              <div className="p-3 bg-muted rounded-md">{formData.first_name || 'Not provided'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            {isEditing ? (
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            ) : (
              <div className="p-3 bg-muted rounded-md">{formData.last_name || 'Not provided'}</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          {isEditing ? (
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">{formData.phone || 'Not provided'}</div>
          )}
        </div>

        {userType === 'student' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              {isEditing ? (
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">{formData.student_id || 'Not provided'}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">{formData.department || 'Not provided'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Academic Level</Label>
                {isEditing ? (
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 Level</SelectItem>
                      <SelectItem value="200">200 Level</SelectItem>
                      <SelectItem value="300">300 Level</SelectItem>
                      <SelectItem value="400">400 Level</SelectItem>
                      <SelectItem value="500">500 Level</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-muted rounded-md">{formData.level ? `${formData.level} Level` : 'Not provided'}</div>
                )}
              </div>
            </div>
          </>
        )}

        {userType === 'counsellor' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              {isEditing ? (
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">{formData.specialization || 'Not provided'}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                {isEditing ? (
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">{formData.license_number || 'Not provided'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                {isEditing ? (
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1 years">0-1 years</SelectItem>
                      <SelectItem value="2-5 years">2-5 years</SelectItem>
                      <SelectItem value="6-10 years">6-10 years</SelectItem>
                      <SelectItem value="11-15 years">11-15 years</SelectItem>
                      <SelectItem value="15+ years">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-muted rounded-md">{formData.experience || 'Not provided'}</div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableProfileSection;
