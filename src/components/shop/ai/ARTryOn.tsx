"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ARTryOnProps {
  productImageUrl?: string;
  className?: string;
}

export function ARTryOn({ productImageUrl, className }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError(err.message || 'Could not access the camera. Please check permissions.');
      toast.error('Camera access denied');
    } finally {
      setIsLoading(false);
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

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isActive && !isLoading) {
    return (
      <div className={cn("relative flex flex-col items-center justify-center bg-black/5 rounded-lg border border-dashed border-gray-300 p-6 aspect-[3/4] overflow-hidden", className)}>
         <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-0" />
         <div className="relative z-10 flex flex-col items-center text-center space-y-4">
             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Camera className="h-6 w-6" />
             </div>
             <div>
                <h3 className="font-semibold text-lg">AR Try-On</h3>
                <p className="text-sm text-muted-foreground mb-4">See how this looks on you</p>
             </div>
             <Button onClick={startCamera} className="w-full">
                <Play className="h-4 w-4 mr-2" /> Start Camera
             </Button>
         </div>
      </div>
    );
  }

  return (
    <div className={cn("relative bg-black rounded-lg overflow-hidden aspect-[3/4] flex items-center justify-center", className)}>
      {error ? (
        <div className="p-4 w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={() => {setError(null); setIsActive(false);}} variant="outline" className="w-full mt-4 text-white border-white/20 hover:bg-white/10">
            Close
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              "w-full h-full object-cover",
              facingMode === 'user' && "scale-x-[-1]"
            )}
          />

          {/* Overlay Image (AR product mockup) */}
          {productImageUrl && (
             <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-70">
                 {/* This would be a more complex ML-driven positioning in reality */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={productImageUrl} alt="Product Overlay" className="w-2/3 object-contain drop-shadow-xl" />
             </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4 z-20">
             <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
                onClick={toggleCamera}
             >
                <RefreshCw className="h-5 w-5" />
             </Button>

             <Button
                variant="destructive"
                size="icon"
                className="rounded-full shadow-lg"
                onClick={stopCamera}
             >
                <X className="h-5 w-5" />
             </Button>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
               <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
