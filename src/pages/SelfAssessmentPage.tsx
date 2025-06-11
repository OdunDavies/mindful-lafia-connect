
import React from 'react';
import Navigation from '@/components/Navigation';
import SelfAssessment from '@/components/SelfAssessment';

const SelfAssessmentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Mental Health Self-Assessment</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This confidential assessment will help us understand how you're feeling and recommend appropriate support. 
              It takes about 5 minutes to complete and your responses are completely private.
            </p>
          </div>
          <SelfAssessment />
        </div>
      </div>
    </div>
  );
};

export default SelfAssessmentPage;
