"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ARTryOn({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      setStream(mediaStream);
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("Could not access camera. Please check permissions.");
      toast.error("Camera access denied");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  // Ensure video element gets stream if it loads after stream is ready
  useEffect(() => {
    if (videoRef.current && stream && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef.current, stream]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 border-primary/20 hover:bg-primary/5">
          <Camera className="w-4 h-4" />
          AR Try-On
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-black/95 border-none h-[80vh] sm:h-[600px] flex flex-col">
        {/* Hidden Title for Accessibility */}
        <DialogTitle className="sr-only">AR Try-On for {product.name}</DialogTitle>

        <div className="relative flex-1 flex items-center justify-center bg-black w-full h-full">

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black text-white">
               <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
               <p className="text-sm">Accessing Camera...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black text-white p-6 text-center">
               <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />

          {/* Overlay Product Image (Mock AR) */}
          {!isLoading && !error && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="relative w-2/3 h-2/3 opacity-80 mix-blend-multiply flex items-center justify-center">
                   {product.mainImageUrl && (
                      <img
                        src={product.mainImageUrl}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
                      />
                   )}
                </div>
             </div>
          )}

          {/* Controls UI Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-30">
             <div className="flex justify-between items-end">
                <div className="text-white">
                   <p className="font-bold text-lg">{product.name}</p>
                   <p className="text-white/70 text-sm">Virtual Try-On</p>
                </div>
                <Button
                   size="icon"
                   variant="destructive"
                   className="rounded-full h-12 w-12"
                   onClick={() => setIsOpen(false)}
                >
                   <X className="h-6 w-6" />
                </Button>
             </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
