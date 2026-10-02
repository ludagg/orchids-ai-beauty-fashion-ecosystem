"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, X, Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ARTryOnProps {
    productImage?: string;
    productName?: string;
}

export function ARTryOn({ productImage, productName }: ARTryOnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [streamError, setStreamError] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setIsLoading(true);
        setStreamError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Important: Need to handle when metadata is loaded
                videoRef.current.onloadedmetadata = () => {
                     videoRef.current?.play().catch(e => {
                         console.error("Error playing video:", e);
                     });
                     setIsLoading(false);
                };
            }
        } catch (err: any) {
            console.error("Camera error:", err);
            setStreamError(err.message || "Could not access camera");
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
    };

    // Clean up when dialog closes or unmounts
    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            setIsApplying(false);
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const handleApplyFilter = () => {
        setIsApplying(true);
        // Simulate an AR filter processing delay
        setTimeout(() => {
            setIsApplying(false);
            toast.success("AR Filter applied!");
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10">
                    <Camera className="w-4 h-4" />
                    AR Try-On
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[95vw] h-[85vh] sm:h-auto flex flex-col p-0 overflow-hidden bg-black border-border/50">
                <DialogHeader className="p-4 bg-background/80 backdrop-blur-md absolute top-0 w-full z-10 border-b border-white/10 text-white">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Virtual Try-On
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                        See how {productName || "this item"} looks on you.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden h-full">
                    {isLoading && !streamError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 gap-3 text-white">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Starting camera...</p>
                        </div>
                    )}

                    {streamError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20 gap-4 text-center px-6 text-white">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                <X className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Camera Error</p>
                                <p className="text-sm text-gray-400 mt-1">{streamError}</p>
                            </div>
                            <Button onClick={startCamera} variant="outline" className="mt-2 bg-white/10 border-white/20 hover:bg-white/20">
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Camera Feed */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Simulated AR Overlay effect */}
                    {isApplying && (
                        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                            <div className="w-full h-full border-[10px] border-primary/40 animate-pulse rounded-lg mix-blend-overlay"></div>
                            <Loader2 className="w-12 h-12 text-primary animate-spin absolute" />
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10 flex flex-col gap-4">
                        {productImage && (
                            <div className="flex justify-center mb-2">
                                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 bg-white/5 backdrop-blur-sm shadow-xl p-1">
                                    <img src={productImage} alt="Product" className="w-full h-full object-cover rounded-md" />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-center">
                            <Button
                                onClick={handleApplyFilter}
                                disabled={isLoading || !!streamError || isApplying}
                                className="rounded-full w-16 h-16 p-0 bg-primary/20 hover:bg-primary/40 border-4 border-white backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform active:scale-95"
                            >
                                <span className="sr-only">Capture or Apply</span>
                                <div className="w-10 h-10 rounded-full bg-white/80"></div>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
