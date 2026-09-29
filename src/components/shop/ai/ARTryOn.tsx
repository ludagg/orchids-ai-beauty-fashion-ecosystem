"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Smartphone, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ARTryOnProps {
  product: any;
}

export function ARTryOn({ product }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
      if (!isOpen) {
          stopCamera();
      }
  }, [isOpen]);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary/5">
          <ScanFace className="w-4 h-4" />
          Virtual Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black text-white border-zinc-800">
        <DialogHeader className="absolute top-0 z-50 w-full p-4 bg-gradient-to-b from-black/80 to-transparent flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-white text-base">AR Try-On</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full h-8 w-8">
             <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative aspect-[3/4] w-full bg-zinc-900 flex flex-col items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-sm">Initializing AR Engine...</p>
            </div>
          )}

          {!isCameraActive && !isLoading && (
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                <Camera className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="font-semibold text-lg">See it on yourself</h3>
              <p className="text-zinc-400 text-sm max-w-[250px]">
                Allow camera access to virtually try on the {product?.name || "product"}.
              </p>
              {hasPermission === false && (
                <p className="text-red-400 text-xs">Camera access was denied. Please check your browser permissions.</p>
              )}
              <Button onClick={startCamera} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                Enable Camera
              </Button>
            </div>
          )}

          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isCameraActive ? "hidden" : ""}`}
            style={{ transform: "scaleX(-1)" }} // Mirror effect
          />

          {/* AR Overlay Mock */}
          {isCameraActive && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Face/Body tracking guide */}
              <div className="w-3/4 h-3/4 border-2 border-dashed border-white/30 rounded-[100px] flex items-center justify-center relative">
                  <ScanFace className="w-12 h-12 text-white/20 absolute -top-6" />
                  <p className="text-white/50 text-xs text-center px-4 mt-auto mb-10">Position yourself within the frame</p>
              </div>

              {/* Mock Product Overlay */}
              <div className="absolute bottom-20 w-full px-6 flex justify-center">
                 <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-white/10 shadow-xl pointer-events-auto w-full max-w-sm">
                    {product?.images?.[0] ? (
                        <img src={product.images[0]} alt="Product" className="w-12 h-12 rounded-lg object-cover bg-white" />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center"><Smartphone className="w-5 h-5 text-zinc-500" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product?.name || "AR Product"}</p>
                        <p className="text-xs text-zinc-400">Applying virtual layer...</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}