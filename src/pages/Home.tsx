
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, Phone, BookOpen, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const mentalHealthVideos = [
    {
      id: "3QIfkeA6HBY",
      title: "What is Mental Health?",
      description: "Understanding the basics of mental health and why it matters for everyone."
    },
    {
      id: "DxIDKZHW3-E",
      title: "Managing Anxiety and Depression",
      description: "Practical strategies for dealing with anxiety and depression in daily life."
    },
    {
      id: "igtpkhpCrFc",
      title: "Breaking Mental Health Stigma",
      description: "How we can work together to reduce stigma around mental health issues."
    },
    {
      id: "oeooMyJ-pC4",
      title: "Self-Care and Mental Wellness",
      description: "Simple self-care practices to maintain good mental health."
    }
  ];

  const services = [
    {
      icon: Users,
      title: "Individual Counselling",
      description: "One-on-one sessions with qualified counsellors to address personal challenges."
    },
    {
      icon: Heart,
      title: "Crisis Support",
      description: "24/7 emergency support for students experiencing mental health crises."
    },
    {
      icon: Video,
      title: "Online Sessions",
      description: "Convenient video calling and chat features for remote counselling sessions."
    },
    {
      icon: BookOpen,
      title: "Mental Health Resources",
      description: "Educational materials and tools to help you understand and manage mental health."
    },
    {
      icon: Shield,
      title: "Confidential Support",
      description: "All sessions are completely confidential and conducted in a safe environment."
    },
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "Immediate access to crisis intervention and emergency mental health support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Mental Health
            <span className="text-primary block">Matters</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Welcome to the Federal University of Lafia Student Affairs Division Counselling Unit. 
            We're here to support your mental health journey with professional counselling services, 
            resources, and a caring community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8 py-4">
              Get Support Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/resources')} className="text-lg px-8 py-4">
              Explore Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Mental Health Videos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Mental Health Education Videos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about mental health through these informative videos that cover various aspects 
              of mental wellness, coping strategies, and breaking stigma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mentalHealthVideos.map((video, index) => (
              <VideoPlayer 
                key={index}
                videoId={video.id}
                title={video.title}
                description={video.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive mental health support tailored for university students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="py-16 bg-red-50 border-l-4 border-red-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-red-700 mb-4">Need Immediate Help?</h2>
          <p className="text-lg text-red-600 mb-8">
            If you're experiencing a mental health crisis, don't wait. Get help immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Phone className="mr-2 h-5 w-5" />
              Call Crisis Hotline: 988
            </Button>
            <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Emergency Chat Support
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards better mental health. Join our supportive community today.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/signup')} className="text-lg px-8 py-4">
            Sign Up Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
