
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="text-center py-12">
        <CardHeader>
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle>Chat Feature Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The chat feature has been temporarily disabled. Please use the video call feature for counselling sessions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
