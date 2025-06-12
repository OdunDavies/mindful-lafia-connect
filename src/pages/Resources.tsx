
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, Heart, Brain, Users, Phone } from 'lucide-react';

const Resources = () => {
  const mentalHealthResources = [
    {
      title: "Crisis Support",
      description: "Immediate help for mental health emergencies in Nigeria",
      items: [
        { name: "Nigeria Mental Health Crisis Line", contact: "199", type: "phone" },
        { name: "Lagos State Domestic Violence Helpline", contact: "08000333333", type: "phone" },
        { name: "Mentally Aware Nigeria Initiative", contact: "08093448989", type: "phone" }
      ]
    },
    {
      title: "Mental Health Organizations",
      description: "Professional organizations providing support and resources in Nigeria",
      items: [
        { name: "Association of Psychiatrists in Nigeria", contact: "Professional mental health support", type: "info" },
        { name: "Mentally Aware Nigeria Initiative (MANI)", contact: "Mental health advocacy and support", type: "info" },
        { name: "She Writes Woman", contact: "Mental health support for women", type: "info" }
      ]
    }
  ];

  const selfHelpTools = [
    {
      title: "Mindfulness & Meditation",
      description: "Tools to help manage stress and anxiety",
      resources: [
        "Daily meditation practice - 10 minutes morning routine",
        "Breathing exercises - 4-7-8 technique for anxiety", 
        "Progressive muscle relaxation - Full body tension release",
        "Mindful walking - Connect with nature and reduce stress"
      ]
    },
    {
      title: "Mood Tracking",
      description: "Methods to monitor your mental health",
      resources: [
        "Daily mood journal - Track emotions and triggers",
        "Sleep pattern monitoring - Record sleep quality and duration",
        "Anxiety level tracking - Rate anxiety 1-10 daily",
        "Gratitude practice - Write 3 things you're grateful for daily"
      ]
    },
    {
      title: "Educational Resources",
      description: "Learn more about mental health",
      resources: [
        "Understanding depression - Symptoms, causes, and treatment options",
        "Anxiety management techniques - Practical coping strategies",
        "Stress reduction methods - Healthy lifestyle changes",
        "Building resilience - Developing mental strength and adaptability"
      ]
    }
  ];

  const downloadableResources = [
    {
      title: "Coping Strategies Worksheet",
      description: "Practical techniques for managing difficult emotions in Nigerian context",
      content: "A comprehensive guide including breathing exercises, grounding techniques, and culturally relevant coping mechanisms."
    },
    {
      title: "Daily Mood Journal Template",
      description: "Track your mental health progress daily",
      content: "Simple template to record mood, sleep, activities, and thoughts with space for reflection."
    },
    {
      title: "Breathing Exercises Guide",
      description: "Step-by-step breathing techniques for anxiety relief",
      content: "Detailed instructions for various breathing techniques including box breathing and 4-7-8 method."
    },
    {
      title: "Sleep Hygiene Checklist",
      description: "Improve your sleep quality with these tips",
      content: "Practical tips for better sleep including bedtime routines and environmental factors."
    }
  ];

  const handleDownload = (resource: any) => {
    const content = `${resource.title}\n\n${resource.description}\n\n${resource.content}\n\nProvided by FULAFIA Mental Health Services\n2025`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mental Health Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools, guides, and support resources tailored for Nigerian students
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
                      <li key={resourceIndex} className="flex items-start gap-2 text-sm">
                        <span className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
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
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => handleDownload(resource)}
                  >
                    <Download className="h-4 w-4" />
                    Download Guide
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
                <CardTitle>Understanding Mental Health in Nigeria</CardTitle>
                <CardDescription>Learn about common mental health conditions and cultural considerations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Depression and Anxiety</h4>
                    <p>Recognizing symptoms, understanding cultural stigma, and finding appropriate help within Nigerian healthcare system.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Academic Stress Management</h4>
                    <p>Coping with university pressure, exam anxiety, and balancing academic and social life in Nigerian universities.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Building Mental Resilience</h4>
                    <p>Developing emotional strength using both modern techniques and traditional Nigerian support systems.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Support Systems</CardTitle>
                <CardDescription>Building and maintaining healthy relationships in Nigerian context</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Family Communication</h4>
                    <p>How to discuss mental health with family members while respecting cultural values and traditions.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Professional Help</h4>
                    <p>Finding qualified mental health professionals in Nigeria and understanding when to seek help.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Peer Support</h4>
                    <p>Creating supportive friendships and study groups that promote mental wellbeing.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;
