
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface UserTypeSelectorProps {
  userType: string;
  onUserTypeChange: (value: string) => void;
}

const UserTypeSelector = ({ userType, onUserTypeChange }: UserTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium text-white">I am a:</Label>
      <RadioGroup value={userType} onValueChange={onUserTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="text-white">Student seeking mental health support</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="counsellor" id="counsellor" />
          <Label htmlFor="counsellor" className="text-white">Licensed Counsellor/Mental Health Professional</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelector;
