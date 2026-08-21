"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Maximize } from "lucide-react";
import Image from "next/image";

interface ARTryOnProps {
  mainImageUrl?: string;
  productName?: string;
}

export function ARTryOn({ mainImageUrl, productName }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
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
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
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
        <Button variant="outline" className="w-full flex items-center gap-2 border-purple-500/30 bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
          <Maximize className="w-4 h-4" />
          Virtual AR Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-black text-white border-zinc-800">
        <DialogHeader className="p-4 bg-zinc-900/80 backdrop-blur-md absolute top-0 w-full z-20">
          <DialogTitle className="text-white">AR Try-On</DialogTitle>
          <DialogDescription className="text-zinc-400">
            See how {productName || "this product"} looks on you.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-[3/4] bg-zinc-900 flex items-center justify-center">
          {error ? (
            <div className="text-red-400 p-4 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{error}</p>
            </div>
          ) : !streamActive ? (
            <div className="text-zinc-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Starting camera...</p>
            </div>
          ) : null}

          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            playsInline
            muted
          />

          {/* AR Overlay Mockup */}
          {streamActive && mainImageUrl && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-80 mix-blend-multiply">
              <div className="relative w-1/2 aspect-square">
                 <Image
                    src={mainImageUrl}
                    alt="AR Overlay"
                    fill
                    className="object-contain filter drop-shadow-2xl"
                 />
              </div>
            </div>
          )}

          {/* UI Controls overlay */}
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent z-20 flex justify-center gap-4">
            <Button
                variant="default"
                size="icon"
                className="rounded-full w-14 h-14 bg-white text-black hover:bg-zinc-200"
                onClick={() => {
                     // Mock photo capture
                     const btn = document.activeElement as HTMLElement;
                     if(btn) btn.blur();
                     setTimeout(() => alert("Photo saved to gallery!"), 300);
                }}
            >
              <Camera className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
