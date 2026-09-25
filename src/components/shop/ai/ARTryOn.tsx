"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ARTryOn() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      streamRef.current = mediaStream;
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Dialog open={isCameraOpen} onOpenChange={(open) => {
      if (!open) stopCamera();
      setIsCameraOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10"
          onClick={startCamera}
        >
          <Camera className="h-4 w-4" />
          AR Try-On Mode
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-md p-0 overflow-hidden bg-black border-none">
        <DialogTitle className="sr-only">AR Try-On Camera</DialogTitle>
        <div className="relative w-full aspect-[3/4] bg-zinc-900 flex items-center justify-center">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white text-sm flex flex-col items-center gap-4">
               <Camera className="h-8 w-8 text-zinc-500 animate-pulse" />
               <p>Starting AR Camera...</p>
            </div>
          )}

          {/* AR Overlay Mock */}
          {stream && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-4 border-dashed border-white/20 m-4 rounded-3xl">
                <div className="absolute top-8 text-white bg-black/50 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                    Align your face / body
                </div>
                {/* Visual guidelines */}
                <div className="h-1/3 w-1/3 border-2 border-white/30 rounded-full blur-[1px]"></div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 z-10">
              <Button
                variant="destructive"
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg"
                onClick={stopCamera}
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                className="h-14 w-14 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg"
                onClick={() => toast.success("Snapshot saved!")}
              >
                <div className="h-10 w-10 rounded-full border-2 border-black" />
              </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
