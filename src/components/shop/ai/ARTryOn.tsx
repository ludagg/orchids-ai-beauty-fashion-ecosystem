"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ARTryOnProps {
  productName: string;
  productImage: string;
}

export function ARTryOn({ productName, productImage }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      setStream(mediaStream);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError("Could not access camera. Please check your permissions.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const simulateTryOn = () => {
    setIsProcessing(true);
    // Simulate AI processing time
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-yellow-500/50 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400">
          <Camera className="h-4 w-4" />
          Virtual AR Try-On
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black border-yellow-500/30">
        <div className="relative aspect-[3/4] w-full bg-zinc-900 flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent text-white">
            <h3 className="font-semibold text-sm tracking-wide">AR Try-On: {productName}</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Camera View */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {error ? (
              <div className="text-white text-center p-6 bg-red-900/50 rounded-lg mx-4">
                <p className="text-sm font-medium">{error}</p>
                <Button variant="outline" className="mt-4" onClick={startCamera}>Try Again</Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-700",
                    isProcessing ? "opacity-30" : "opacity-100",
                    // Flip horizontally for selfie cam
                    "scale-x-[-1]"
                  )}
                />

                {/* Simulated AR Overlay */}
                {!isProcessing && stream && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-overlay opacity-80">
                     <div className="relative w-2/3 h-2/3">
                       <Image
                         src={productImage}
                         alt="Product Overlay"
                         fill
                         className="object-contain"
                       />
                     </div>
                  </div>
                )}

                {/* Scanning Animation */}
                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-400">
                    <RefreshCw className="h-10 w-10 animate-spin mb-4" />
                    <p className="font-medium animate-pulse">Applying AI Fit...</p>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500/50 animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                )}

                {/* Guidelines */}
                {!isProcessing && stream && (
                  <div className="absolute inset-0 pointer-events-none">
                     {/* Face/Body guide lines could go here */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-white/30 rounded-[100px] animate-pulse" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex justify-center items-end pb-8">
            <Button
              size="lg"
              className={cn(
                "rounded-full h-16 w-16 shadow-lg shadow-yellow-500/20 transition-all",
                isProcessing ? "bg-zinc-700 text-zinc-400" : "bg-yellow-500 hover:bg-yellow-400 text-black scale-110"
              )}
              onClick={simulateTryOn}
              disabled={isProcessing || !stream || !!error}
            >
              {isProcessing ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
