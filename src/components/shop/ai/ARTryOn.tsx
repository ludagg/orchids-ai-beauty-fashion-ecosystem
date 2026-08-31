"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CameraOff, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
  productImageUrl: string;
}

export function ARTryOn({ productImageUrl }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in your browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setError("Failed to access camera. Please check your permissions.");
      }
    }

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-muted text-center p-4">
        <CameraOff className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60vh] md:h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-black"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover -scale-x-100"
      />

      {/* AR Overlay (Simplified for MVP: Just superimposes the image) */}
      {productImageUrl && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-80 mix-blend-multiply">
           {/* In a real AR app, this would use Face/Body tracking (e.g. MediaPipe). Here we mock it. */}
           <div className="relative h-2/3 w-2/3 max-w-sm">
              <Image
                src={productImageUrl}
                alt="Product AR Try-On"
                fill
                className="object-contain"
              />
           </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-0 text-white"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
