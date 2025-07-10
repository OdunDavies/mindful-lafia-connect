
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Info, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: { value: number; label: string }[];
}

interface AssessmentResult {
  totalScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string;
  detailedAdvice: string[];
}

const questions: Question[] = [
  {
    id: 'sleep',
    question: 'How often have you had trouble sleeping in the past two weeks?',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'anxiety',
    question: 'How often have you felt nervous, anxious, or on edge?',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'mood',
    question: 'How often have you felt down, depressed, or hopeless?',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'concentration',
    question: 'How often have you had trouble concentrating on studies or work?',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'social',
    question: 'How often have you avoided social activities or interactions?',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  },
  {
    id: 'energy',
    question: 'How often have you felt tired or had little energy?',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ]
  }
];

const SelfAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = (): AssessmentResult => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    let riskLevel: 'low' | 'moderate' | 'high';
    let recommendations: string;
    let detailedAdvice: string[];

    if (percentage <= 30) {
      riskLevel = 'low';
      recommendations = 'Your responses indicate you are managing well. Continue with healthy habits like regular exercise, good sleep, and staying connected with friends and family.';
      detailedAdvice = [
        'Maintain a regular sleep schedule of 7-9 hours per night',
        'Continue engaging in physical activity and hobbies you enjoy',
        'Keep building and maintaining social connections',
        'Practice stress management techniques like deep breathing or meditation',
        'Consider periodic check-ins with our counselling services for preventive support'
      ];
    } else if (percentage <= 60) {
      riskLevel = 'moderate';
      recommendations = 'Your responses suggest you may be experiencing some challenges. Consider speaking with a counsellor or exploring our self-help resources. Regular counselling sessions could be beneficial.';
      detailedAdvice = [
        'Schedule a counselling session to discuss your concerns with a professional',
        'Establish a daily routine that includes self-care activities',
        'Try relaxation techniques such as mindfulness or progressive muscle relaxation',
        'Reach out to trusted friends or family members for support',
        'Consider joining support groups or peer counselling sessions',
        'Monitor your sleep patterns and aim for consistent rest'
      ];
    } else {
      riskLevel = 'high';
      recommendations = 'Your responses indicate you may be experiencing significant difficulties. We strongly recommend speaking with a professional counsellor as soon as possible. Please consider booking an immediate session.';
      detailedAdvice = [
        'Book an urgent counselling session - immediate professional support is recommended',
        'Reach out to our crisis hotline if you need immediate assistance',
        'Contact a trusted friend, family member, or emergency contact',
        'Consider visiting your campus health center or local mental health services',
        'Avoid making major life decisions while feeling overwhelmed',
        'Focus on basic self-care: eating regularly, staying hydrated, and getting rest when possible'
      ];
    }

    return { totalScore, riskLevel, recommendations, detailedAdvice };
  };

  const completeAssessment = async () => {
    setLoading(true);
    try {
      const results = calculateResults();
      
      const { error } = await supabase
        .from('self_assessments')
        .insert({
          student_id: user?.id,
          score: results.totalScore,
          risk_level: results.riskLevel,
          responses: answers,
          recommendations: results.recommendations
        });

      if (error) throw error;

      setAssessmentResults(results);
      setIsCompleted(true);
      
      toast({
        title: "Assessment completed",
        description: "Your self-assessment has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setAssessmentResults(null);
  };

  if (isCompleted && assessmentResults) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {assessmentResults.riskLevel === 'low' && <CheckCircle className="h-16 w-16 text-green-500" />}
            {assessmentResults.riskLevel === 'moderate' && <Info className="h-16 w-16 text-yellow-500" />}
            {assessmentResults.riskLevel === 'high' && <AlertTriangle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">Assessment Complete</CardTitle>
          <CardDescription>
            Risk Level: <span className={`font-semibold ${
              assessmentResults.riskLevel === 'low' ? 'text-green-600' :
              assessmentResults.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {assessmentResults.riskLevel.charAt(0).toUpperCase() + assessmentResults.riskLevel.slice(1)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{assessmentResults.totalScore}/18</p>
            <p className="text-muted-foreground">Total Score</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm">{assessmentResults.recommendations}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Personalized Recommendations
            </h3>
            <ul className="space-y-2">
              {assessmentResults.detailedAdvice.map((advice: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>

          {assessmentResults.riskLevel === 'high' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Immediate Support Available
              </h3>
              <p className="text-sm text-red-700 mb-3">
                If you're experiencing thoughts of self-harm or need immediate help, please contact:
              </p>
              <div className="text-sm text-red-700">
                <p>• Campus Crisis Line: [Your Campus Number]</p>
                <p>• National Crisis Hotline: 988</p>
                <p>• Emergency Services: 911</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={resetAssessment} variant="outline" className="flex-1">
              Take Again
            </Button>
            <Button 
              onClick={() => navigate('/contact-page')} 
              className="flex-1"
              variant={assessmentResults.riskLevel === 'high' ? 'default' : 'outline'}
            >
              {assessmentResults.riskLevel === 'high' ? 'Get Immediate Help' : 'Contact Counsellor'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Mental Health Self-Assessment</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQ.question}</h3>
          
          <RadioGroup
            value={answers[currentQ.id]?.toString() || ''}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
          >
            {currentQ.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${currentQ.id}-${option.value}`} />
                <Label htmlFor={`${currentQ.id}-${option.value}`} className="flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button 
            onClick={prevQuestion} 
            variant="outline" 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={nextQuestion}
            disabled={answers[currentQ.id] === undefined || loading}
          >
            {loading ? 'Saving...' : (currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfAssessment;
