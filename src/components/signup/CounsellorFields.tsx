
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CounsellorFieldsProps {
  formData: {
    specialization: string;
    licenseNumber: string;
    experience: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const CounsellorFields = ({ formData, onInputChange }: CounsellorFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="specialization" className="text-white">Specialization</Label>
        <Select onValueChange={(value) => onInputChange('specialization', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select your specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clinical-psychology">Clinical Psychology</SelectItem>
            <SelectItem value="counselling-psychology">Counselling Psychology</SelectItem>
            <SelectItem value="psychiatry">Psychiatry</SelectItem>
            <SelectItem value="social-work">Social Work</SelectItem>
            <SelectItem value="marriage-family">Marriage & Family Therapy</SelectItem>
            <SelectItem value="addiction-counselling">Addiction Counselling</SelectItem>
            <SelectItem value="trauma-therapy">Trauma Therapy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="text-white">License Number</Label>
          <Input
            id="licenseNumber"
            placeholder="Enter your license number"
            value={formData.licenseNumber}
            onChange={(e) => onInputChange('licenseNumber', e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-white">Years of Experience</Label>
          <Select onValueChange={(value) => onInputChange('experience', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="2-5">2-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="11-15">11-15 years</SelectItem>
              <SelectItem value="15+">15+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default CounsellorFields;
