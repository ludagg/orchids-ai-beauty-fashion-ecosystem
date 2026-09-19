"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Smartphone, Eye, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
    product: any;
}

export function ARTryOn({ product }: ARTryOnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Filter to add overlay on camera stream. In a real AR implementation this would use TensorFlow.js or similar
    const [overlayFilter, setOverlayFilter] = useState("none");

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

    const startCamera = async () => {
        setError(null);
        setIsStreaming(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Important: Need to wait for metadata to be loaded to play
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(e => {
                        console.error("Error playing video:", e);
                        setError("Failed to play video stream.");
                    });
                    setIsStreaming(true);
                };
            }
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            setError(err.message || "Failed to access camera. Please check permissions.");
            toast.error("Camera access denied");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsStreaming(false);
    };

    const toggleCamera = async () => {
        if (isStreaming) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" /> AR Try-On
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black text-white border-zinc-800">
                <div className="relative h-[80vh] w-full bg-zinc-900 flex flex-col">

                    {/* Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{product?.name || "AR Try-On"}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Camera Viewport */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        {error ? (
                            <div className="text-center p-6 space-y-4">
                                <Camera className="h-12 w-12 text-zinc-500 mx-auto" />
                                <p className="text-zinc-400">{error}</p>
                                <Button onClick={startCamera} variant="secondary">Try Again</Button>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover mirror-mode"
                                    style={{ transform: "scaleX(-1)", filter: overlayFilter }}
                                />

                                {/* Simulated AR Overlay */}
                                {isStreaming && product?.mainImageUrl && (
                                     <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-70 transition-opacity duration-300 mix-blend-multiply">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.mainImageUrl}
                                            alt="Overlay"
                                            className="w-3/4 object-contain animate-pulse"
                                            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}
                                        />
                                     </div>
                                )}

                                {!isStreaming && !error && (
                                    <div className="flex flex-col items-center justify-center space-y-2 z-10">
                                        <Camera className="h-8 w-8 text-white animate-pulse" />
                                        <p className="text-sm text-zinc-300">Starting camera...</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-10 flex flex-col items-center gap-4">
                        <p className="text-xs text-center text-zinc-400 max-w-[250px]">
                            Position your face or body in the center of the frame.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-0"
                                onClick={toggleCamera}
                            >
                                <RefreshCw className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="default"
                                size="icon"
                                className="rounded-full h-16 w-16 bg-white hover:bg-zinc-200 text-black border-4 border-zinc-400"
                                onClick={() => toast.success("Photo captured! (Simulation)")}
                            >
                                <Camera className="h-6 w-6" />
                            </Button>
                             <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-0"
                                onClick={() => setOverlayFilter(overlayFilter === "none" ? "contrast(1.2) saturate(1.2)" : "none")}
                            >
                                <Maximize2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
