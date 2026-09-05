"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ARTryOnProps {
    productId?: string;
    productName?: string;
}

export function ARTryOn({ productId, productName }: ARTryOnProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setIsActive(true);
        } catch (err: any) {
            console.error('Error accessing camera:', err);
            setError(err.message || 'Unable to access camera.');
            toast.error('Could not access camera for AR Try-On.');
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
        setIsActive(false);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Virtual Try-On
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        See how {productName || 'this'} looks on you
                    </p>
                </div>
                {!isActive ? (
                    <Button onClick={startCamera} variant="outline" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Try it on
                    </Button>
                ) : (
                    <Button onClick={stopCamera} variant="destructive" size="sm" className="gap-2">
                        <CameraOff className="h-4 w-4" />
                        Close
                    </Button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {isActive && (
                <div className="relative aspect-[3/4] sm:aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                        ref={videoRef}
                        className="h-full w-full object-cover scale-x-[-1]" // Mirror the video
                        playsInline
                        muted
                    />

                    {/* AR Overlay Placeholder */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-4 border-yellow-500/30 rounded-xl">
                        <div className="w-48 h-48 border-2 border-dashed border-yellow-500/50 rounded-full animate-pulse flex items-center justify-center">
                            <span className="bg-black/50 text-yellow-500 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                                Align face here
                            </span>
                        </div>
                        <p className="mt-4 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                            AI computing fit...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
