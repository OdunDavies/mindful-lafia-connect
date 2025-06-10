
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Video, MessageCircle, Users, FileText, Clock, User, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CounsellorDashboard = () => {
  const [todaysAppointments] = useState([
    {
      id: 1,
      student: "John Smith",
      studentId: "2020/1/12345",
      time: "9:00 AM",
      type: "Video Call",
      status: "confirmed",
      priority: "normal"
    },
    {
      id: 2,
      student: "Sarah Johnson",
      studentId: "2021/2/23456",
      time: "11:00 AM",
      type: "In-Person",
      status: "confirmed",
      priority: "high"
    },
    {
      id: 3,
      student: "Michael Chen",
      studentId: "2019/3/34567",
      time: "2:00 PM",
      type: "Video Call",
      status: "pending",
      priority: "normal"
    }
  ]);

  const [pendingMessages] = useState([
    {
      id: 1,
      student: "Emily Davis",
      message: "Hi Dr. Johnson, I've been feeling anxious about my upcoming exams...",
      time: "10 minutes ago",
      unread: true
    },
    {
      id: 2,
      student: "David Wilson",
      message: "Thank you for yesterday's session. I feel much better...",
      time: "2 hours ago",
      unread: true
    }
  ]);

  const [recentSessions] = useState([
    {
      id: 1,
      student: "Jane Doe",
      date: "2024-06-10",
      duration: "50 minutes",
      notes: "Progress with anxiety management techniques",
      followUp: true
    },
    {
      id: 2,
      student: "Robert Brown",
      date: "2024-06-10",
      duration: "45 minutes",
      notes: "First session - intake assessment completed",
      followUp: false
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, Dr. Johnson!</h1>
          <p className="text-muted-foreground">Your counselling dashboard for today</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Today's Sessions</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                </div>
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Priority Cases</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today's Appointments</span>
                </CardTitle>
                <CardDescription>Your scheduled sessions for June 11, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.student}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {appointment.studentId} • {appointment.time}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={appointment.type === 'Video Call' ? 'default' : 'secondary'}>
                              {appointment.type}
                            </Badge>
                            <Badge 
                              variant={appointment.priority === 'high' ? 'destructive' : 'outline'}
                            >
                              {appointment.priority} priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {appointment.type === 'Video Call' && (
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Start Call
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Notes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Sessions</span>
                </CardTitle>
                <CardDescription>Your completed sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{session.student}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{session.date}</span>
                          {session.followUp && (
                            <Badge variant="secondary">Follow-up needed</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Duration: {session.duration}</p>
                      <p className="text-sm">{session.notes}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Notes
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Student
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Pending Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingMessages.map((message) => (
                    <div key={message.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{message.student}</h4>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {message.message}
                      </p>
                      <Button size="sm" className="w-full">
                        Reply
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Messages
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Students
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Session Reports
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Start Group Session
                </Button>
              </CardContent>
            </Card>

            {/* Professional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Assessment Tools
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Referral Network
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  CPD Training
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

export default CounsellorDashboard;
