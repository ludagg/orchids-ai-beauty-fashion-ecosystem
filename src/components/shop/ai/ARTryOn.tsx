"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ARTryOn({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsStarted(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check your permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStarted(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
  };

  const handleSimulateTryOn = () => {
      setIsProcessing(true);
      // Simulate AR processing delay
      setTimeout(() => {
          setIsProcessing(false);
      }, 2000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) {
    return (
      <Button
        variant="secondary"
        className="w-full mt-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-violet-200 text-violet-700 hover:bg-violet-100 dark:border-violet-900/50 dark:text-violet-300 dark:hover:bg-violet-900/50 font-medium"
        onClick={() => { setIsOpen(true); startCamera(); }}
      >
        <Camera className="w-4 h-4 mr-2" />
        AR Virtual Try-On
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="text-white font-medium text-lg flex items-center">
            <Wand2 className="w-5 h-5 mr-2 text-violet-400" />
            Virtual Try-On
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="relative flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-700 ${isProcessing ? 'opacity-50 blur-sm' : 'opacity-100'}`}
        />

        {/* AR Overlay (Mock) */}
        {isStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Guide box */}
                <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-3xl relative">
                    {/* Corner markers */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-white"></div>

                    {isProcessing && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mb-2" />
                                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    Applying {product?.name || 'product'}...
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {!isProcessing && (
                    <p className="text-white/80 mt-8 text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm text-center">
                        Position your face/body in the frame
                    </p>
                )}
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black p-6 pb-safe flex flex-col items-center">
        <div className="flex gap-4 overflow-x-auto w-full pb-4 px-2 no-scrollbar mb-4 justify-center">
             {/* Mock Product Variants for Try On */}
             {product?.colors?.map((color: any, idx: number) => (
                <button
                    key={idx}
                    className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shrink-0"
                    style={{ backgroundColor: color.hex }}
                    onClick={handleSimulateTryOn}
                />
             ))}
        </div>

        <Button
            className="w-full max-w-sm rounded-full py-6 text-lg font-bold bg-white text-black hover:bg-zinc-200"
            onClick={handleSimulateTryOn}
            disabled={isProcessing}
        >
            {isProcessing ? 'Processing...' : 'Apply Fit'}
        </Button>
      </div>
    </div>
  );
}
