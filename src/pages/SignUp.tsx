
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserTypeSelector from '@/components/signup/UserTypeSelector';
import PersonalInfoFields from '@/components/signup/PersonalInfoFields';
import StudentFields from '@/components/signup/StudentFields';
import CounsellorFields from '@/components/signup/CounsellorFields';

const SignUp = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    studentId: '',
    department: '',
    level: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    agreeToTerms: false
  });
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.agreeToTerms) {
      return;
    }

    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_type: userType,
      phone: formData.phone,
      ...(userType === 'student' && {
        student_id: formData.studentId,
        department: formData.department,
        level: formData.level,
      }),
      ...(userType === 'counsellor' && {
        specialization: formData.specialization,
        license_number: formData.licenseNumber,
        experience: formData.experience,
      }),
    };

    const { error } = await signUp(formData.email, formData.password, userData);

    if (!error) {
      // Redirect to sign-in page after successful signup
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-white/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">FULAFIA Counselling</h1>
          </div>
          <p className="text-white/90">Create your account to access mental health support</p>
        </div>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Create Account</CardTitle>
            <CardDescription className="text-white/80">
              Join our community and get access to professional mental health support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <UserTypeSelector userType={userType} onUserTypeChange={setUserType} />

              <PersonalInfoFields formData={formData} onInputChange={handleInputChange} />

              {userType === 'student' && (
                <StudentFields formData={formData} onInputChange={handleInputChange} />
              )}

              {userType === 'counsellor' && (
                <CounsellorFields formData={formData} onInputChange={handleInputChange} />
              )}

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-white">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-200 hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-200 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90" size="lg">
                Create Account
              </Button>

              <div className="text-center">
                <p className="text-sm text-white/80">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-200 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
