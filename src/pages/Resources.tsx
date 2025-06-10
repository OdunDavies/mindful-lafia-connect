
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, ExternalLink, Heart, Brain, Users, Phone } from 'lucide-react';

const Resources = () => {
  const mentalHealthResources = [
    {
      title: "Crisis Support",
      description: "Immediate help for mental health emergencies",
      items: [
        { name: "National Suicide Prevention Lifeline", contact: "988", type: "phone" },
        { name: "Crisis Text Line", contact: "Text HOME to 741741", type: "text" },
        { name: "International Association for Suicide Prevention", contact: "https://www.iasp.info/resources/Crisis_Centres/", type: "link" }
      ]
    },
    {
      title: "Mental Health Organizations",
      description: "Professional organizations providing support and resources",
      items: [
        { name: "National Alliance on Mental Illness (NAMI)", contact: "https://www.nami.org", type: "link" },
        { name: "Mental Health America", contact: "https://www.mhanational.org", type: "link" },
        { name: "American Psychological Association", contact: "https://www.apa.org", type: "link" }
      ]
    }
  ];

  const selfHelpTools = [
    {
      title: "Mindfulness & Meditation",
      description: "Tools to help manage stress and anxiety",
      resources: [
        "Headspace - Guided meditation app",
        "Calm - Sleep and meditation app", 
        "Insight Timer - Free meditation app",
        "10% Happier - Meditation for skeptics"
      ]
    },
    {
      title: "Mood Tracking",
      description: "Apps to monitor your mental health",
      resources: [
        "Daylio - Micro mood diary",
        "Moodpath - Depression & anxiety screening",
        "Sanvello - Anxiety and mood tracking",
        "eMoods - Bipolar mood tracker"
      ]
    },
    {
      title: "Educational Resources",
      description: "Learn more about mental health",
      resources: [
        "Mental Health First Aid courses",
        "Psychology Today articles",
        "TED Talks on mental health",
        "Coursera psychology courses"
      ]
    }
  ];

  const downloadableResources = [
    {
      title: "Coping Strategies Worksheet",
      description: "Practical techniques for managing difficult emotions",
      format: "PDF"
    },
    {
      title: "Daily Mood Journal Template",
      description: "Track your mental health progress daily",
      format: "PDF"
    },
    {
      title: "Breathing Exercises Guide",
      description: "Step-by-step breathing techniques for anxiety relief",
      format: "PDF"
    },
    {
      title: "Sleep Hygiene Checklist",
      description: "Improve your sleep quality with these tips",
      format: "PDF"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mental Health Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools, guides, and support resources to help you on your mental health journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Crisis Support Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Phone className="h-8 w-8 text-destructive" />
            <h2 className="text-3xl font-bold text-foreground">Emergency Support</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentalHealthResources.map((category, index) => (
              <Card key={index} className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.contact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Self-Help Tools */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Self-Help Tools</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selfHelpTools.map((tool, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    {tool.title}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.resources.map((resource, resourceIndex) => (
                      <li key={resourceIndex} className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Downloadable Resources */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Download className="h-8 w-8 text-secondary" />
            <h2 className="text-3xl font-bold text-foreground">Downloadable Resources</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloadableResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="text-sm">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download {resource.format}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Educational Content */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">Educational Content</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Mental Health</CardTitle>
                <CardDescription>Learn about common mental health conditions and their symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li>• Anxiety Disorders: Types, symptoms, and management</li>
                  <li>• Depression: Recognizing signs and seeking help</li>
                  <li>• Stress Management: Healthy coping mechanisms</li>
                  <li>• Building Resilience: Developing mental strength</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Support Systems</CardTitle>
                <CardDescription>Building and maintaining healthy relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li>• Family and Friends: How to communicate your needs</li>
                  <li>• Professional Help: When and how to seek therapy</li>
                  <li>• Support Groups: Finding your community</li>
                  <li>• Self-Advocacy: Speaking up for your mental health</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;
