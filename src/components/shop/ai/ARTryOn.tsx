"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ARTryOnProps {
  productImageUrl: string;
  productName: string;
}

export function ARTryOn({ productImageUrl, productName }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (isOpen && !hasPermissionError) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasPermissionError(true);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, hasPermissionError]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-violet-500/30 text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20">
          <Camera className="w-4 h-4" />
          Virtual Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-black border-none">
        <DialogHeader className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent text-white border-b-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-sm font-medium">Try On: {productName}</span>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-[3/4] bg-neutral-900 flex items-center justify-center">
          {hasPermissionError ? (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-neutral-500" />
              </div>
              <p className="text-neutral-400 text-sm">Camera access is required for Virtual Try-On.</p>
              <Button variant="secondary" onClick={() => setHasPermissionError(false)}>
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
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                  isCameraActive ? "opacity-100" : "opacity-0"
                )}
              />

              {!isCameraActive && (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <RefreshCw className="w-8 h-8 text-white/50 animate-spin" />
                 </div>
              )}

              {/* Product Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                 {/* Guide Frame */}
                 <div className="w-3/4 h-1/2 border-2 border-dashed border-white/30 rounded-[40px] mb-20 relative">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/80 text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                      Position your face/body here
                    </div>
                 </div>

                 {/* Mock AR Item positioned relatively */}
                 <div className="absolute bottom-1/4 w-1/2 aspect-square max-w-[200px]">
                    <Image
                      src={productImageUrl}
                      alt="AR Product Overlay"
                      fill
                      className="object-contain opacity-90 drop-shadow-2xl mix-blend-multiply dark:mix-blend-normal"
                    />
                 </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center gap-4">
                 <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20">
                       <RefreshCw className="w-4 h-4 mr-2" />
                       Retake
                    </Button>
                    <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white border-none">
                       <ShoppingBag className="w-4 h-4 mr-2" />
                       Buy Now
                    </Button>
                 </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
