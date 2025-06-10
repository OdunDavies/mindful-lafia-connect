
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Shield, Target, Award, CheckCircle } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We provide empathetic, non-judgmental support to every individual seeking help."
    },
    {
      icon: Shield,
      title: "Privacy & Confidentiality",
      description: "Your privacy is our priority. All sessions and communications are completely confidential."
    },
    {
      icon: Users,
      title: "Inclusive Community",
      description: "We welcome everyone regardless of background, identity, or circumstances."
    },
    {
      icon: Target,
      title: "Evidence-Based Approach",
      description: "Our methods are grounded in proven psychological research and best practices."
    }
  ];

  const services = [
    {
      title: "Individual Counselling",
      description: "One-on-one sessions with licensed mental health professionals",
      features: ["50-minute sessions", "Video & chat support", "Flexible scheduling", "Progress tracking"]
    },
    {
      title: "Crisis Support",
      description: "Immediate assistance for mental health emergencies",
      features: ["24/7 availability", "Immediate response", "Safety planning", "Emergency referrals"]
    },
    {
      title: "Group Therapy",
      description: "Connect with others facing similar challenges",
      features: ["Peer support", "Guided discussions", "Skill building", "Safe environment"]
    },
    {
      title: "Educational Resources",
      description: "Self-help tools and educational materials",
      features: ["Downloadable guides", "Interactive workshops", "Mental health education", "Coping strategies"]
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Helped" },
    { number: "500+", label: "Licensed Counsellors" },
    { number: "24/7", label: "Support Available" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're dedicated to making mental health support accessible, affordable, and effective for students everywhere. 
            Our platform connects you with licensed professionals who understand the unique challenges of student life.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mental health challenges among students have reached unprecedented levels. We believe that every student 
                deserves access to quality mental health care without barriers. Our platform combines cutting-edge 
                technology with compassionate human connection to provide immediate, effective support when and where 
                it's needed most.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {service.title}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <CardTitle>Sign Up & Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create your account and complete a brief assessment to help us match you with the right counsellor.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <CardTitle>Connect with Counsellor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse available counsellors, read their profiles, and schedule your first session at a time that works for you.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <CardTitle>Begin Your Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Start your sessions through secure video calls and chat. Track your progress and access resources anytime.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Commitment Section */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Our Commitment to You</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground max-w-3xl mx-auto">
                We're committed to providing the highest quality mental health care while maintaining the strictest 
                standards of privacy and confidentiality. Our platform is designed with your safety and wellbeing 
                as the top priority, ensuring you can focus on what matters most - your mental health journey.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Badge variant="secondary">HIPAA Compliant</Badge>
                <Badge variant="secondary">End-to-End Encrypted</Badge>
                <Badge variant="secondary">Licensed Professionals</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
