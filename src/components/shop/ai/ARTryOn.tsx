"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ARTryOn() {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check your permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStream(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary/10">
          <Camera className="h-4 w-4" />
          Virtual Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AR Try-On
          </DialogTitle>
          <DialogDescription>
            See how this looks on you in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-[3/4] bg-muted w-full overflow-hidden mt-4">
          {error ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <Camera className="mb-4 h-12 w-12 opacity-50" />
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={startCamera}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />

              {/* AR Overlay Placeholder */}
              {stream && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-primary/50 border-dashed rounded-[40%] w-[60%] h-[50%] animate-pulse" />
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 bg-background border-t flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Make sure you are in a well-lit area.</p>
            <Button variant="ghost" size="icon" onClick={() => handleOpenChange(false)}>
                <X className="h-4 w-4" />
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
