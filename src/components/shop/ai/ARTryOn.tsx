"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ARTryOn() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsStreamActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check your permissions.");
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

    useEffect(() => {
        // Start camera on mount
        startCamera();

        // Cleanup on unmount
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="relative w-full h-[60vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {error ? (
                <div className="text-white text-center p-6 flex flex-col items-center gap-4">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                    <p>{error}</p>
                    <Button variant="secondary" onClick={startCamera}>
                        Try Again
                    </Button>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
                    />

                    {/* Overlay UI */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                        <div className="flex justify-between items-start">
                             <div className="bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-sm text-sm pointer-events-auto">
                                 AR Try-On
                             </div>
                        </div>

                        <div className="flex justify-center pb-8 pointer-events-auto">
                             <Button
                                variant="outline"
                                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                                onClick={() => {
                                    stopCamera();
                                    setTimeout(startCamera, 300);
                                }}
                             >
                                 <RefreshCw className="w-4 h-4 mr-2" />
                                 Refresh Camera
                             </Button>
                        </div>
                    </div>

                    {/* Mock AR Overlay element (bounding box / guideline) */}
                    {isStreamActive && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-full animate-pulse flex items-center justify-center">
                                <span className="text-white/50 text-sm">Align face here</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}