
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { value: number; label: string }[];
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
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    let riskLevel: 'low' | 'moderate' | 'high';
    let recommendations: string;

    if (percentage <= 30) {
      riskLevel = 'low';
      recommendations = 'Your responses indicate you are managing well. Continue with healthy habits like regular exercise, good sleep, and staying connected with friends and family.';
    } else if (percentage <= 60) {
      riskLevel = 'moderate';
      recommendations = 'Your responses suggest you may be experiencing some challenges. Consider speaking with a counsellor or exploring our self-help resources. Regular counselling sessions could be beneficial.';
    } else {
      riskLevel = 'high';
      recommendations = 'Your responses indicate you may be experiencing significant difficulties. We strongly recommend speaking with a professional counsellor as soon as possible. Please consider booking an immediate session.';
    }

    return { totalScore, riskLevel, recommendations };
  };

  const completeAssessment = async () => {
    setLoading(true);
    try {
      const assessment = calculateResult();
      
      const { error } = await supabase
        .from('self_assessments')
        .insert({
          student_id: user?.id,
          score: assessment.totalScore,
          risk_level: assessment.riskLevel,
          responses: answers,
          recommendations: assessment.recommendations
        });

      if (error) throw error;

      setResult(assessment);
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
    setResult(null);
  };

  if (isCompleted && result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {result.riskLevel === 'low' && <CheckCircle className="h-16 w-16 text-green-500" />}
            {result.riskLevel === 'moderate' && <Info className="h-16 w-16 text-yellow-500" />}
            {result.riskLevel === 'high' && <AlertTriangle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">Assessment Complete</CardTitle>
          <CardDescription>
            Risk Level: <span className={`font-semibold ${
              result.riskLevel === 'low' ? 'text-green-600' :
              result.riskLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{result.totalScore}/18</p>
            <p className="text-muted-foreground">Total Score</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <p className="text-sm">{result.recommendations}</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetAssessment} variant="outline" className="flex-1">
              Take Again
            </Button>
            {result.riskLevel !== 'low' && (
              <Button className="flex-1">
                Book Counselling Session
              </Button>
            )}
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
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfAssessment;
