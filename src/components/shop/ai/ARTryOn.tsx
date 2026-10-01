"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export function ARTryOn() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
        <Button variant="outline" className="w-full flex gap-2 border-yellow-500/50 hover:bg-yellow-500/10">
          <Camera className="h-4 w-4 text-yellow-600" />
          <span className="text-yellow-700 dark:text-yellow-500 font-medium">AR Try-On</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 overflow-hidden bg-black border-none">
        <DialogHeader className="absolute top-0 z-50 w-full p-4 bg-gradient-to-b from-black/80 to-transparent flex flex-row items-center justify-between pointer-events-none">
          <DialogTitle className="text-white">Virtual Try-On</DialogTitle>
          <DialogDescription className="sr-only">AR Try-on camera view</DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 w-full bg-zinc-900 flex items-center justify-center">
          {hasPermission === false ? (
            <div className="flex flex-col items-center text-center p-6 text-zinc-400">
              <VideoOff className="h-12 w-12 mb-4 opacity-50" />
              <p className="mb-4">Camera access is required for AR Try-On.</p>
              <Button onClick={startCamera} variant="outline" className="text-black bg-white">
                Grant Permission
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />

              {/* AR Overlay Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[60%] aspect-[3/4] border-2 border-dashed border-white/50 rounded-lg flex flex-col items-center justify-center">
                   <span className="text-white/50 text-sm font-medium uppercase tracking-widest mt-auto mb-10 drop-shadow-md">
                     Align face here
                   </span>
                </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex justify-center gap-4">
                 <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/30 backdrop-blur" onClick={() => {
                     // Placeholder for snapshot or retake logic
                     startCamera();
                 }}>
                     <RefreshCw className="h-5 w-5 text-white" />
                 </Button>

                 <Button size="icon" variant="destructive" className="rounded-full h-12 w-12 shadow-lg" onClick={() => setIsOpen(false)}>
                     <X className="h-6 w-6" />
                 </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
