"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Smartphone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
    productImage?: string;
    productName?: string;
}

export default function ARTryOn({ productImage, productName }: ARTryOnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                setError(null);
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsStreaming(false);
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => stopCamera();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex gap-2 border-primary/20 hover:bg-primary/5">
                    <Smartphone className="w-4 h-4" />
                    AR Try-On
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-black/90">
                <DialogHeader className="p-4 absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
                    <DialogTitle className="text-white flex items-center gap-2 text-sm">
                        <Camera className="w-4 h-4" />
                        Virtual Try-On: {productName || "Product"}
                    </DialogTitle>
                </DialogHeader>

                <div className="relative w-full aspect-[3/4] bg-zinc-900 flex items-center justify-center">
                    {error ? (
                        <div className="text-center p-6 text-zinc-400">
                            <p className="mb-4">{error}</p>
                            <Button onClick={startCamera} variant="outline" className="border-zinc-700 text-zinc-300">
                                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                            </Button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover scale-x-[-1]"
                            />

                            {/* Overlay UI - The AR effect placeholder */}
                            {isStreaming && (
                                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                    <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-3xl relative animate-pulse">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-medium whitespace-nowrap bg-black/50 px-2 py-1 rounded-full">
                                            Align face here
                                        </div>
                                    </div>

                                    {/* Mock Product Overlay */}
                                    {productImage && (
                                        <div className="absolute bottom-1/4 opacity-80 mix-blend-multiply drop-shadow-2xl">
                                            {/* We use standard img to avoid next/image layout complexities in absolute positioned AR overlays */}
                                            <img src={productImage} alt="Product Overlay" className="w-40 h-auto object-contain" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isStreaming && !error && (
                                <div className="text-zinc-500 animate-pulse">
                                    Initializing camera...
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 z-50 bg-gradient-to-t from-black to-transparent flex justify-center pb-8">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        onClick={() => {
                            // Mock capture action
                            const el = document.createElement('div');
                            el.className = 'fixed inset-0 bg-white z-[100] animate-flash pointer-events-none';
                            document.body.appendChild(el);
                            setTimeout(() => el.remove(), 500);
                        }}
                    >
                        <div className="w-14 h-14 rounded-full border-2 border-black" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
