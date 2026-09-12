"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, RefreshCcw, Maximize2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
    product: any;
}

export default function ARTryOn({ product }: ARTryOnProps) {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsActive(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (!isActive) {
        return (
            <Button
                variant="outline"
                onClick={startCamera}
                disabled={isLoading}
                className="w-full gap-2 border-primary/20 hover:bg-primary/5"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Try On Visually (AR)
            </Button>
        );
    }

    return (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video border shadow-lg group">
            {error && (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-500 bg-background/80">
                    <p>{error}</p>
                    <Button variant="link" onClick={() => setIsActive(false)}>Close</Button>
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100" // Mirror effect
            />

            {/* AR Overlay Mock */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                <img
                    src={product.mainImageUrl || product.images?.[0]}
                    alt="AR Overlay"
                    className="w-1/2 max-w-[200px] object-contain drop-shadow-2xl mix-blend-multiply"
                />
            </div>

            {/* Controls Overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 border-none" onClick={stopCamera}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4">
                <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 border-none">
                    <RefreshCcw className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 bg-white text-black hover:bg-gray-200 border-none">
                    <Camera className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 border-none">
                    <Maximize2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
