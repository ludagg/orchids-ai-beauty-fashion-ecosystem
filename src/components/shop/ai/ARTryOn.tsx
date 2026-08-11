"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ARTryOnProps {
    productName: string;
}

export function ARTryOn({ productName }: ARTryOnProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setIsLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setHasPermission(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setHasPermission(false);
            toast.error("Camera access denied or unavailable.");
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
                <Button variant="outline" className="w-full gap-2">
                    <Camera className="w-4 h-4" />
                    AR Try-On
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Try On {productName}</DialogTitle>
                </DialogHeader>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-black flex items-center justify-center">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10">
                            Loading camera...
                        </div>
                    )}

                    {!hasPermission && !isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-black/80">
                            <Camera className="w-12 h-12 mb-4 opacity-50" />
                            <p className="mb-4">Camera access is required for AR Try-On.</p>
                            <Button onClick={startCamera} variant="secondary">
                                Enable Camera
                            </Button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform -scale-x-100 ${hasPermission ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Simulated AR Overlay */}
                    {hasPermission && (
                        <div className="absolute inset-0 flex flex-col pointer-events-none">
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="border-2 border-dashed border-yellow-500 w-full h-full rounded-lg opacity-50 flex items-center justify-center">
                                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">Align face/body here</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-center text-sm mb-4">
                                    Simulating fit for {productName}
                                </p>
                                <div className="flex justify-center gap-4 pointer-events-auto">
                                    <Button size="icon" variant="secondary" className="rounded-full w-12 h-12" onClick={() => {
                                        toast.success("Screenshot saved to favorites!");
                                    }}>
                                        <div className="w-8 h-8 border-2 border-primary rounded-full bg-white" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
