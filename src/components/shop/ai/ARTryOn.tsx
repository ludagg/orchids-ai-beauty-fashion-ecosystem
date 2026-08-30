"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
  productImage: string;
  productName: string;
}

export function ARTryOn({ productImage, productName }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setError("Camera not supported on this device.");
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setError(err.message || "Could not access the camera.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      // Memory cleanup rule: Use streamRef to stop tracks during unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-black">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover scale-x-[-1]" // Mirror effect
      />

      {/* AR Overlay (Product Image) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {productImage && (
          <div className="relative w-2/3 aspect-square opacity-80">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        )}
      </div>

      {/* States */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
          <RefreshCw className="h-8 w-8 animate-spin mb-2" />
          <p>Starting Camera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
          <Camera className="h-10 w-10 mb-4 text-red-500" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={startCamera} variant="outline" className="text-white border-white hover:bg-white/20">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
