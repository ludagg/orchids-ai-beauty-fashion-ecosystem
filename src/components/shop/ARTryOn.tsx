"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ARTryOnProps {
  productImage: string;
  productName: string;
}

export function ARTryOn({ productImage, productName }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async (frontMode: boolean) => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: frontMode ? "user" : "environment" },
        audio: false,
      });
      setStream(newStream);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check your permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(isFrontCamera);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, isFrontCamera]);

  const toggleCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 mt-4 border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-700 dark:hover:text-yellow-400">
          <Camera className="h-4 w-4" />
          Virtual Try-On (AR)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black border-none h-[80vh] flex flex-col">
        <DialogHeader className="p-4 absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none text-white border-b-0">
          <DialogTitle className="text-white">AR Try-On: {productName}</DialogTitle>
          <DialogDescription className="text-gray-300">
            Position yourself in the frame to see how it looks.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-400 z-10 bg-black/50 rounded-lg backdrop-blur-sm m-4">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{error}</p>
              <Button onClick={() => startCamera(isFrontCamera)} variant="secondary" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Webcam Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  isFrontCamera ? "scale-x-[-1]" : ""
                }`}
              />

              {/* AR Overlay Container */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-3/4 h-3/4 opacity-80 mix-blend-multiply dark:mix-blend-screen transition-all duration-300">
                   <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-contain"
                   />
                </div>
              </div>

              {/* Overlay guides */}
              <div className="absolute inset-0 border-[2px] border-dashed border-white/20 rounded-[40px] m-12 pointer-events-none" />
            </>
          )}

          {/* Controls */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-50">
             <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/40 text-white border-none backdrop-blur-md"
                onClick={toggleCamera}
              >
                <RefreshCcw className="h-5 w-5" />
             </Button>
             <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
