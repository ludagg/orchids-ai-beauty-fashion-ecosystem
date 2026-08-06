"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, SwitchCamera, Loader2, Maximize } from "lucide-react";
import { toast } from "sonner";

interface ARTryOnProps {
  productId: string;
}

export function ARTryOn({ productId }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions.");
      setIsCameraActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5">
          <Maximize className="h-4 w-4 text-primary" />
          Virtual Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-black border-none text-white">
        <DialogHeader className="p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
          <DialogTitle className="text-white">AR Try-On</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-[3/4] w-full bg-zinc-900 flex items-center justify-center">
          {isLoading && !isCameraActive && (
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Accessing camera...</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''} ${!isCameraActive ? 'hidden' : ''}`}
          />

          {isCameraActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Fake AR overlay for MVP */}
              <div className="border-2 border-dashed border-primary/50 w-2/3 h-1/2 rounded-3xl animate-pulse flex items-center justify-center">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                  Align face/body here
                </span>
              </div>
            </div>
          )}

          {isCameraActive && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/30 backdrop-blur text-white border-none"
                onClick={toggleCamera}
              >
                <SwitchCamera className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                onClick={() => toast.success("Photo captured! Check out how it looks.")}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
