"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function ARTryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check your permissions.");
      setIsCameraOn(false);
    } finally {
      setIsLoading(false);
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
    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* The Video Element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isCameraOn ? "block" : "hidden"} scale-x-[-1]`}
          playsInline
          muted
        />

        {/* Placeholder when camera is off */}
        {!isCameraOn && !isLoading && (
          <div className="absolute flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-2">
            <Sparkles className="h-12 w-12 opacity-20 mb-2" />
            <p>Turn on your camera for Virtual Try-On</p>
            <p className="text-xs">See how this looks on you in real-time using AR.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="absolute flex flex-col items-center justify-center text-muted-foreground">
             <Loader2 className="h-8 w-8 animate-spin text-yellow-500 mb-2" />
             <span className="text-sm">Accessing camera...</span>
          </div>
        )}

        {/* AR Overlay Mock (Only visible when camera is on) */}
        {isCameraOn && (
           <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Fake bounding box for face/body detection */}
              <div className="w-48 h-64 border-2 border-dashed border-yellow-500/50 rounded-full animate-pulse flex items-center justify-center">
                  <div className="bg-background/80 text-foreground px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm shadow mt-auto mb-4">
                      Position yourself here
                  </div>
              </div>
           </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={toggleCamera}
          variant={isCameraOn ? "outline" : "default"}
          className={!isCameraOn ? "bg-yellow-500 text-black hover:bg-yellow-600 font-bold" : ""}
          disabled={isLoading}
        >
          {isCameraOn ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Try-On
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Start Virtual Try-On
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
