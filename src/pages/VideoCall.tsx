
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle, 
  Users, 
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoCall = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participantName] = useState("Dr. Sarah Johnson");
  
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    toast({
      title: "Call Started",
      description: "Connected to Dr. Sarah Johnson",
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    toast({
      title: "Call Ended",
      description: `Session duration: ${formatDuration(callDuration)}`,
    });
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Video Off" : "Video On",
      description: isVideoOn ? "Your video has been turned off" : "Your video has been turned on",
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Microphone Off" : "Microphone On",
      description: isAudioOn ? "Your microphone has been muted" : "Your microphone has been unmuted",
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker Off" : "Speaker On",
      description: isSpeakerOn ? "Speaker has been muted" : "Speaker has been unmuted",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-xl font-semibold">FULAFIA Counselling Session</h1>
          {isCallActive && (
            <div className="bg-green-600 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">{formatDuration(callDuration)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Video Area */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-slate-800 border-slate-700">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
                {/* Remote Video */}
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                
                {/* Participant Info */}
                <div className="absolute top-4 left-4 bg-black/50 px-3 py-2 rounded-lg">
                  <p className="text-white font-medium">{participantName}</p>
                  <p className="text-white/80 text-sm">Counsellor</p>
                </div>

                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-700 rounded-lg overflow-hidden border-2 border-white/20">
                  <video
                    ref={localVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-slate-600 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-white/60" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                    <p className="text-white text-xs">You</p>
                  </div>
                </div>

                {/* No video placeholder */}
                {!isCallActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">Ready to connect?</h3>
                      <p className="text-white/80">Click "Start Call" to begin your session</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Session Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 space-y-4 mb-4 max-h-96 overflow-y-auto">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <p className="text-white text-sm">
                    <span className="font-semibold text-primary">Dr. Johnson:</span> Good morning! I'm ready to start our session. How are you feeling today?
                  </p>
                  <span className="text-white/60 text-xs">10:00 AM</span>
                </div>
                
                <div className="bg-primary/20 p-3 rounded-lg ml-4">
                  <p className="text-white text-sm">
                    <span className="font-semibold">You:</span> Hi Dr. Johnson, I'm doing okay. Looking forward to our session.
                  </p>
                  <span className="text-white/60 text-xs">10:01 AM</span>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700 text-white placeholder-white/60 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-800 p-6">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleAudio}
          >
            {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            variant={isVideoOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant={isSpeakerOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleSpeaker}
          >
            {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>

          {!isCallActive ? (
            <Button
              className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16"
              onClick={startCall}
            >
              <Phone className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="rounded-full w-16 h-16"
              onClick={endCall}
            >
              <Phone className="h-6 w-6 rotate-[135deg]" />
            </Button>
          )}

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-14 h-14"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
