import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function CounsellorCard({ counsellor }) {
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
        <div className="flex justify-center gap-2 mt-1">
          <Badge>{counsellor.specialization || "General Counselling"}</Badge>
          {counsellor.is_available && <Badge variant="success">Available</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2">{counsellor.bio}</div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
            License: {counsellor.license_number}
          </span>
          <span className="text-xs">Experience: {counsellor.experience}</span>
        </div>
        <div className="text-xs mt-2">Contact: {counsellor.email}</div>
      </CardContent>
    </Card>
  );
}
