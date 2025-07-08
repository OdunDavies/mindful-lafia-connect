
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, Mail, Phone, Award, Shield } from "lucide-react";

interface EnhancedCounsellorCardProps {
  counsellor: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    specialization?: string;
    license_number?: string;
    experience?: string;
    is_available?: boolean;
    last_seen?: string;
    profile_image_url?: string;
    total_sessions?: number;
    completed_sessions?: number;
    active_sessions?: number;
  };
  onStartSession: (counsellorId: string) => void;
  isCreatingSession: boolean;
}

export function EnhancedCounsellorCard({ counsellor, onStartSession, isCreatingSession }: EnhancedCounsellorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto">
          <AvatarImage src={counsellor.profile_image_url} alt={`${counsellor.first_name} ${counsellor.last_name}`} />
          <AvatarFallback>
            {counsellor.first_name?.[0]}{counsellor.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mt-2 text-lg">
          Dr. {counsellor.first_name} {counsellor.last_name}
        </CardTitle>
        <div className="flex justify-center gap-2 mt-1 flex-wrap">
          <Badge variant="secondary">{counsellor.specialization || "General Counselling"}</Badge>
          {counsellor.is_available && <Badge variant="default" className="bg-green-500">Available</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Professional Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-yellow-500" />
            <span>License: {counsellor.license_number || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Experience: {counsellor.experience || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-500" />
            <span>Sessions: {counsellor.completed_sessions || 0} completed</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-green-500" />
            <span className="truncate">{counsellor.email}</span>
          </div>
          {counsellor.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-blue-500" />
              <span>{counsellor.phone}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onStartSession(counsellor.id)}
          disabled={isCreatingSession || !counsellor.is_available}
          className="w-full"
        >
          {isCreatingSession ? 'Starting Session...' : 'Start Session'}
        </Button>
      </CardContent>
    </Card>
  );
}
