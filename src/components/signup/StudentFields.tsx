
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentFieldsProps {
  formData: {
    studentId: string;
    department: string;
    level: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const StudentFields = ({ formData, onInputChange }: StudentFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="studentId" className="text-white">Student ID</Label>
        <Input
          id="studentId"
          placeholder="Enter your student ID"
          value={formData.studentId}
          onChange={(e) => onInputChange('studentId', e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department" className="text-white">Department</Label>
          <Select onValueChange={(value) => onInputChange('department', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="law">Law</SelectItem>
              <SelectItem value="business">Business Administration</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="social-sciences">Social Sciences</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="level" className="text-white">Academic Level</Label>
          <Select onValueChange={(value) => onInputChange('level', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select your level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100 Level</SelectItem>
              <SelectItem value="200">200 Level</SelectItem>
              <SelectItem value="300">300 Level</SelectItem>
              <SelectItem value="400">400 Level</SelectItem>
              <SelectItem value="500">500 Level</SelectItem>
              <SelectItem value="postgraduate">Postgraduate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default StudentFields;
