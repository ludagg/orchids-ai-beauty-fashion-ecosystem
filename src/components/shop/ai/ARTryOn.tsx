"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

interface ARTryOnProps {
  productImageUrl: string;
}

export function ARTryOn({ productImageUrl }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
        <Button variant="outline" className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10">
          <Camera className="w-4 h-4" />
          Virtual Try-On (AR)
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black border-none h-[80vh] flex flex-col">
          <div className="absolute top-4 right-4 z-50">
              <Button variant="ghost" size="icon" onClick={() => handleOpenChange(false)} className="text-white hover:bg-white/20 rounded-full">
                  <X className="w-6 h-6" />
              </Button>
          </div>

          <div className="relative flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden">
             {error ? (
                <div className="text-white text-center p-6 space-y-4">
                    <p className="text-red-400">{error}</p>
                    <Button onClick={startCamera} variant="secondary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
             ) : (
                <>
                    {/* Camera Feed */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                    />

                    {/* AR Overlay (MVP: simple static overlay centered on screen) */}
                    {isCameraActive && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-80 z-10 mix-blend-multiply">
                            <div className="relative w-3/4 h-3/4">
                                <Image
                                    src={productImageUrl}
                                    alt="Product Overlay"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {!isCameraActive && !error && (
                        <div className="text-white flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                            <p>Accessing camera...</p>
                        </div>
                    )}
                </>
             )}
          </div>

          <div className="bg-zinc-950 p-4 text-center text-zinc-400 text-sm z-20">
              <p>Position the item over yourself.</p>
              <p className="text-xs mt-1 text-zinc-600">AR Try-On is currently in Beta.</p>
          </div>
      </DialogContent>
    </Dialog>
  );
}
