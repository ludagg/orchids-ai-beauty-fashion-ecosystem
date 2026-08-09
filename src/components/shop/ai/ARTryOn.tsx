"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Check, Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ARTryOnProps {
  productImage: string;
  onClose: () => void;
}

export function ARTryOn({ productImage, onClose }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      // Must use ref in cleanup as videoRef.current is null when unmounting
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      setStream(mediaStream);
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    processImage();
  };

  const processImage = () => {
    setIsProcessing(true);

    // Simulate AI processing time
    setTimeout(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Create a composite image (mocking the AR effect)
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = productImage;
      img.onload = () => {
        // Draw the product image over the user (simple overlay for MVP)
        const width = canvasRef.current!.width * 0.5;
        const height = canvasRef.current!.height * 0.5;
        const x = (canvasRef.current!.width - width) / 2;
        const y = (canvasRef.current!.height - height) / 2 + 50; // Offset down a bit

        ctx.globalAlpha = 0.8;
        ctx.drawImage(img, x, y, width, height);
        ctx.globalAlpha = 1.0;

        setResultImage(canvasRef.current!.toDataURL("image/png"));
        setIsProcessing(false);
      };

      img.onerror = () => {
        // Fallback if image fails to load
        setResultImage(canvasRef.current!.toDataURL("image/png"));
        setIsProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 z-50">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="relative w-full max-w-lg aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <Camera className="w-12 h-12 mb-4 text-zinc-500" />
            <p>{error}</p>
            <Button className="mt-4 bg-white/20 hover:bg-white/30 text-white" onClick={startCamera}>Try Again</Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${resultImage ? "hidden" : "block"}`}
            />

            <canvas ref={canvasRef} className="hidden" />

            <AnimatePresence>
              {resultImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Using standard img here because data URLs aren't fully supported by next/image by default without config */}
                  <img
                    src={resultImage}
                    alt="AR Try-On Result"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10"
                >
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                  <p className="font-medium animate-pulse text-shadow">AI is fitting the product...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center z-20">
              {!resultImage ? (
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 border-4 border-white backdrop-blur-md p-0"
                  onClick={takeSnapshot}
                  disabled={isProcessing || !stream}
                >
                  <span className="sr-only">Take Photo</span>
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-md"
                    onClick={() => setResultImage(null)}
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    onClick={onClose}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Looks Good
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-center text-white/70 max-w-sm px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-medium text-white">AI Virtual Try-On</h3>
        </div>
        <p className="text-sm text-balance">
          Position yourself in the frame to see how this product looks on you.
        </p>
      </div>
    </div>
  );
}
