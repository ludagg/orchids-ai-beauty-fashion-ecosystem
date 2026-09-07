"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, X, Maximize } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ARTryOnProps {
    productImage: string;
    productName: string;
    onClose?: () => void;
}

export function ARTryOn({ productImage, productName, onClose }: ARTryOnProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' } // Use front camera by default
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Add explicit play to ensure it starts playing
                await videoRef.current.play();
                setIsStreamActive(true);
            }
        } catch (err: any) {
            console.error("Camera access error:", err);
            setError("Could not access camera. Please check permissions.");
            toast.error("Camera access denied.");
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreamActive(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Effect to start camera when component mounts
    useEffect(() => {
        startCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-border group flex flex-col justify-center items-center">

            {/* Main Video Element */}
            {error ? (
                <div className="flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                        <Camera className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-white font-semibold">{error}</p>
                        <p className="text-gray-400 text-sm mt-1">Please allow camera access in your browser settings.</p>
                    </div>
                    <Button onClick={startCamera} variant="secondary" className="mt-4">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                        isStreamActive ? "opacity-100" : "opacity-0"
                    )}
                    style={{ transform: "scaleX(-1)" }} // Mirror effect
                />
            )}

            {/* Loading State */}
            {isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white text-sm font-medium">Starting AR Camera...</p>
                    </div>
                </div>
            )}

            {/* AR Overlay (MVP implementation: just showing the product over the camera) */}
            {isStreamActive && !isLoading && !error && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-end pb-12 sm:pb-8">
                     {/* The "Virtual" Product Overlay */}
                     <div className="relative w-2/3 max-w-[200px] aspect-square animate-in slide-in-from-bottom-10 fade-in duration-700 opacity-90 drop-shadow-2xl mix-blend-multiply">
                         {/* We use a simple image overlay for the MVP of AR Try-On */}
                         <img
                            src={productImage}
                            alt={`Try on ${productName}`}
                            className="w-full h-full object-contain"
                         />
                     </div>
                     <div className="mt-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium animate-in fade-in delay-500">
                         Trying on: {productName}
                     </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {onClose && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { stopCamera(); onClose(); }}
                        className="bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {!isStreamActive && !isLoading && !error && (
                <Button onClick={startCamera} className="z-10 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Virtual Try-On
                </Button>
            )}
        </div>
    );
}
