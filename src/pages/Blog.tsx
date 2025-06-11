
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Calendar, User } from 'lucide-react';

interface Testimony {
  id: string;
  student_name: string;
  content: string;
  rating: number;
  date: string;
  avatar_url?: string;
}

const testimonies: Testimony[] = [
  {
    id: '1',
    student_name: 'Sarah Johnson',
    content: 'The counselling services at FULAFIA have been life-changing. I was struggling with anxiety and depression, but the professional support I received helped me develop coping strategies and regain my confidence. The counsellors are understanding, non-judgmental, and truly care about student wellbeing.',
    rating: 5,
    date: '2024-01-15',
  },
  {
    id: '2',
    student_name: 'Michael Adebayo',
    content: 'As an international student, adapting to university life was challenging. The counselling team provided excellent support in helping me navigate cultural adjustments and academic pressure. Their guidance was instrumental in my success.',
    rating: 5,
    date: '2024-02-03',
  },
  {
    id: '3',
    student_name: 'Grace Okonkwo',
    content: 'I was hesitant to seek help initially, but the welcoming environment and professional approach of the counsellors made me feel comfortable. The self-assessment tools helped me understand my mental health better, and the ongoing support has been invaluable.',
    rating: 4,
    date: '2024-02-20',
  },
  {
    id: '4',
    student_name: 'David Emmanuel',
    content: 'The 24/7 availability and quick response times of the counselling service have been amazing. During my final year stress, I could always find someone to talk to. The video sessions were particularly helpful when I couldn\'t visit the campus.',
    rating: 5,
    date: '2024-03-10',
  },
  {
    id: '5',
    student_name: 'Fatima Ibrahim',
    content: 'The counsellors helped me work through relationship issues and family pressure. Their professional guidance gave me the tools to communicate better and set healthy boundaries. I\'m grateful for their support during a difficult time.',
    rating: 4,
    date: '2024-03-25',
  },
];

const Blog = () => {
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Student Testimonies</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from FULAFIA students who have benefited from our mental health and counselling services. 
            Their experiences highlight the positive impact of seeking support.
          </p>
        </div>

        {/* Testimonies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonies.map((testimony) => (
            <Card 
              key={testimony.id} 
              className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              onClick={() => setSelectedTestimony(testimony)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimony.avatar_url} />
                    <AvatarFallback>
                      {testimony.student_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimony.student_name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(testimony.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        {testimony.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4 mb-3">
                  {testimony.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(testimony.date).toLocaleDateString()}
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    Read More
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why Choose FULAFIA Counselling?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Professional Counsellors</h3>
                <p className="text-sm text-muted-foreground">
                  Licensed and experienced mental health professionals dedicated to student wellbeing.
                </p>
              </div>
              <div>
                <div className="p-4 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Round-the-clock support through our online platform for urgent situations.
                </p>
              </div>
              <div>
                <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Proven Results</h3>
                <p className="text-sm text-muted-foreground">
                  High satisfaction rates and positive outcomes for students who engage with our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-muted-foreground mb-6">
                Join hundreds of FULAFIA students who have found support and guidance through our counselling services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/assessment" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Take Self Assessment
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Find a Counsellor
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expanded Testimony Modal */}
        {selectedTestimony && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTestimony(null)}
          >
            <Card 
              className="max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedTestimony.avatar_url} />
                      <AvatarFallback>
                        {selectedTestimony.student_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedTestimony.student_name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(selectedTestimony.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {selectedTestimony.rating}/5 stars
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTestimony(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {selectedTestimony.content}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedTestimony.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
