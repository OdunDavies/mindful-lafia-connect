
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  Monitor
} from 'lucide-react';

interface VideoCallInterfaceProps {
  isCallActive: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  otherParticipantName: string;
}

const VideoCallInterface = ({ 
  isCallActive, 
  onStartCall, 
  onEndCall, 
  otherParticipantName 
}: VideoCallInterfaceProps) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isCallActive) {
      startLocalVideo();
    } else {
      stopLocalVideo();
    }

    return () => {
      stopLocalVideo();
    };
  }, [isCallActive]);

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopLocalVideo = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          startLocalVideo();
        };
      } else {
        setIsScreenSharing(false);
        startLocalVideo();
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  if (!isCallActive) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Video className="w-12 h-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ready to start video call</h3>
            <p className="text-muted-foreground">
              Click the button below to start a video call with {otherParticipantName}
            </p>
          </div>
          <Button onClick={onStartCall} className="gap-2">
            <Phone className="w-4 h-4" />
            Start Call
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      {/* Remote Video (Main) */}
      <video
        ref={remoteVideoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={false}
      />
      
      {/* Remote participant placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
        <div className="text-center text-white">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">
              {otherParticipantName.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-lg">{otherParticipantName}</p>
          <p className="text-sm text-gray-300">Waiting to connect...</p>
        </div>
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
        <video
          ref={localVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3">
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="icon"
            className="rounded-full"
            onClick={toggleScreenShare}
          >
            <Monitor className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={onEndCall}
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Call Duration */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
        <p className="text-white text-sm font-mono">00:00:00</p>
      </div>
    </div>
  );
};

export default VideoCallInterface;
