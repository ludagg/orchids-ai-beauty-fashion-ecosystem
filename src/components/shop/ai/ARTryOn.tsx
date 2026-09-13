"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ARTryOn() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsActive(true);
    } catch (err: any) {
      console.error("Error accessing camera: ", err);
      setHasPermission(false);
      setErrorMsg(err.message || "Failed to access camera.");
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[400px] bg-muted rounded-xl overflow-hidden border border-border">
      {isActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Simulated AR Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="border-2 border-yellow-500 border-dashed rounded-[40%] w-[60%] h-[70%] opacity-50 relative">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Align Face Here
               </div>
            </div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
            <Button variant="destructive" size="icon" className="rounded-full shadow-lg" onClick={stopCamera}>
               <CameraOff className="w-5 h-5" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
            <Camera className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="font-semibold text-lg">Virtual Try-On</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            See how this looks on you in real-time using our AI-powered AR Try-On experience.
          </p>

          {errorMsg && (
             <Alert variant="destructive" className="max-w-sm text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
             </Alert>
          )}

          <Button
            className="bg-yellow-500 text-black hover:bg-yellow-600 font-semibold"
            onClick={startCamera}
          >
            <Camera className="w-4 h-4 mr-2" />
            Enable Camera
          </Button>
        </div>
      )}
    </div>
  );
}
