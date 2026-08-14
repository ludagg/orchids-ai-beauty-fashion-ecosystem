"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ARTryOnProps {
    productId: string;
    productName: string;
    productImage: string;
}

export default function ARTryOn({ productId, productName, productImage }: ARTryOnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
            setHasPermission(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setHasPermission(false);
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

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full gap-2 mb-4 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-none shadow-none" variant="outline">
                    <Zap className="w-4 h-4 fill-primary" />
                    AR Try-On
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black text-white border-zinc-800">
                <DialogHeader className="p-4 absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent">
                    <DialogTitle className="text-white flex items-center justify-between">
                        <span>Trying on: {productName}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="relative w-full aspect-[3/4] bg-zinc-900 flex items-center justify-center">
                    {hasPermission === false && (
                        <div className="text-center p-6 flex flex-col items-center">
                            <Camera className="w-12 h-12 text-zinc-500 mb-4" />
                            <p className="text-zinc-300">Camera access is required for AR Try-On.</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-zinc-700 text-black hover:text-black hover:bg-zinc-100 bg-white"
                                onClick={startCamera}
                            >
                                Grant Permission
                            </Button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${!isStreaming ? 'hidden' : ''} -scale-x-100`}
                    />

                    {isStreaming && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
                            {/* Simulated AR Overlay */}
                            <img src={productImage} alt="AR Overlay" className="w-1/2 object-contain mix-blend-multiply drop-shadow-2xl" />
                            <div className="absolute inset-0 border-2 border-primary/50 m-12 rounded-3xl border-dashed opacity-50 animate-pulse" />
                        </div>
                    )}

                    {!isStreaming && hasPermission !== false && (
                        <div className="animate-pulse text-zinc-500 flex flex-col items-center">
                            <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                            <span>Loading Camera...</span>
                        </div>
                    )}
                </div>

                {isStreaming && (
                     <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6 z-10">
                        <Button className="rounded-full w-16 h-16 bg-white hover:bg-zinc-200 border-4 border-zinc-300 shadow-xl" aria-label="Take Photo" />
                     </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
