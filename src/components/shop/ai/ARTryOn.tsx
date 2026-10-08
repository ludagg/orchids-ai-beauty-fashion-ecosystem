"use client";

import React, { useState, useEffect, useRef } from 'react';
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

interface ARTryOnProps {
  productImage: string;
  productName: string;
}

export function ARTryOn({ productImage, productName }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400 hover:bg-violet-500/20">
          <Sparkles className="w-4 h-4" />
          Virtual AR Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black border-none">
        <DialogHeader className="absolute top-4 left-4 z-50 text-left p-0 m-0">
          <DialogTitle className="text-white drop-shadow-md">AR Try-On</DialogTitle>
          <DialogDescription className="text-white/80 drop-shadow-md">
            Trying on: {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-[60vh] sm:h-[80vh] flex items-center justify-center bg-zinc-900">
          {hasPermission === false && (
            <div className="text-white text-center p-6">
              <Camera className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
              <p>Camera access denied or unavailable.</p>
              <Button onClick={startCamera} variant="outline" className="mt-4 text-black bg-white">
                Retry Camera
              </Button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover mirror-mode"
            style={{ transform: 'scaleX(-1)' }}
          />

          {hasPermission && productImage && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {/* Mock AR overlay - simply floats the product image in the center */}
                <div className="relative w-1/2 max-w-[200px] aspect-square animate-pulse-slow mix-blend-multiply opacity-80" style={{ transform: 'scaleX(-1)' }}>
                   <img
                      src={productImage}
                      alt="AR Overlay"
                      className="w-full h-full object-contain drop-shadow-2xl filter contrast-125"
                   />
                </div>
            </div>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-50">
             <Button
                variant="secondary"
                size="icon"
                className="rounded-full w-12 h-12 bg-white/20 backdrop-blur hover:bg-white/40 text-white border-none"
                onClick={startCamera}
             >
                <RefreshCw className="w-5 h-5" />
             </Button>

             <div className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white" />
             </div>

             <Button
                variant="secondary"
                size="icon"
                className="rounded-full w-12 h-12 bg-white/20 backdrop-blur hover:bg-white/40 text-white border-none"
                onClick={() => setIsOpen(false)}
             >
                <X className="w-5 h-5" />
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
