"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
  product: any;
}

export function ARTryOn({ product }: ARTryOnProps) {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsActive(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  if (!isActive) {
    return (
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 text-violet-600 dark:text-violet-400"
        onClick={startCamera}
      >
        <Camera className="w-4 h-4" />
        Virtual Try-On (AR)
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <p className="font-semibold text-sm">AR Try-On</p>
          <p className="text-xs text-white/70">{product?.name || "Product"}</p>
        </div>
        <button
          onClick={stopCamera}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Camera View */}
      <div className="flex-1 relative overflow-hidden bg-zinc-900 flex items-center justify-center">
        {error ? (
          <div className="text-center p-6 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
               <Camera className="w-8 h-8" />
            </div>
            <p className="text-white mb-2 font-medium">Camera Error</p>
            <p className="text-white/60 text-sm">{error}</p>
            <Button onClick={startCamera} className="mt-4" variant="secondary">Try Again</Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100" // Mirror effect
            />

            {/* AR Overlay Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <div className="border-2 border-dashed border-white/40 w-[200px] h-[300px] rounded-3xl flex items-center justify-center relative">
                     {/* Decorative corners */}
                     <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-violet-500 rounded-tl-lg"></div>
                     <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-violet-500 rounded-tr-lg"></div>
                     <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-violet-500 rounded-bl-lg"></div>
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-violet-500 rounded-br-lg"></div>

                     <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                         <Wand2 className="w-3 h-3 text-violet-400" />
                         Position product here
                     </div>
                 </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black p-6 pb-8">
         <div className="flex justify-center gap-6">
             <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                 <RefreshCw className="w-5 h-5" />
             </button>
             <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                 <div className="w-12 h-12 bg-white rounded-full hover:scale-95 transition-transform"></div>
             </button>
             <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors opacity-50 cursor-not-allowed">
                 {/* Placeholder for variant selector */}
                 <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
             </button>
         </div>
      </div>
    </div>
  );
}
