
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Video, MessageCircle, Book, Phone, Heart, Clock, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const StudentDashboard = () => {
  const [upcomingAppointments] = useState([
    {
      id: 1,
      counsellor: "Dr. Sarah Johnson",
      date: "2024-06-12",
      time: "2:00 PM",
      type: "Video Call",
      status: "confirmed"
    },
    {
      id: 2,
      counsellor: "Prof. Michael Chen",
      date: "2024-06-15",
      time: "10:00 AM", 
      type: "In-Person",
      status: "pending"
    }
  ]);

  const [recentSessions] = useState([
    {
      id: 1,
      counsellor: "Dr. Sarah Johnson",
      date: "2024-06-08",
      duration: "50 minutes",
      notes: "Discussed anxiety management techniques"
    },
    {
      id: 2,
      counsellor: "Dr. Emily Davis",
      date: "2024-06-01",
      duration: "45 minutes",
      notes: "Focused on stress reduction strategies"
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's an overview of your mental health journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button className="h-20 flex-col space-y-2">
            <Video className="h-6 w-6" />
            <span>Start Video Call</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <MessageCircle className="h-6 w-6" />
            <span>Send Message</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Calendar className="h-6 w-6" />
            <span>Book Session</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Phone className="h-6 w-6 text-red-500" />
            <span>Emergency Help</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
                <CardDescription>Your scheduled counselling sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.counsellor}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={appointment.type === 'Video Call' ? 'default' : 'secondary'}>
                              {appointment.type}
                            </Badge>
                            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {appointment.type === 'Video Call' && (
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Schedule New Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Sessions</span>
                </CardTitle>
                <CardDescription>Your past counselling sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{session.counsellor}</h3>
                        <span className="text-sm text-muted-foreground">{session.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Duration: {session.duration}</p>
                      <p className="text-sm">{session.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mental Health Tip */}
            <Card className="bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Daily Wellness Tip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  "Take 5 minutes today to practice deep breathing. Inhale for 4 counts, 
                  hold for 4, exhale for 6. This simple technique can help reduce stress 
                  and improve your mood."
                </p>
              </CardContent>
            </Card>

            {/* Quick Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5" />
                  <span>Quick Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Self-Care Checklist
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mood Tracker
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Coping Strategies
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Guided Meditation
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 mb-4">
                  If you're experiencing a mental health crisis, don't hesitate to reach out.
                </p>
                <Button variant="destructive" className="w-full mb-2">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Crisis Hotline
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-600">
                  Emergency Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
