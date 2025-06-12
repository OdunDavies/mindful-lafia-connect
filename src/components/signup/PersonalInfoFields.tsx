
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonalInfoFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoFields = ({ formData, onInputChange }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
