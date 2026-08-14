"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, Shirt, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ARTryOnProps {
    productImageUrl: string;
    productName: string;
    onClose: () => void;
}

export function ARTryOn({ productImageUrl, productName, onClose }: ARTryOnProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    const simulateProcessing = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ScanFace className="w-5 h-5 text-yellow-500" />
                        AR Try-On
                    </h2>
                    <p className="text-xs text-gray-300">{productName}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Main Camera View */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
                {error ? (
                    <div className="text-center p-6 space-y-4">
                        <Camera className="w-12 h-12 text-gray-500 mx-auto" />
                        <p className="text-red-400">{error}</p>
                        <Button onClick={startCamera} variant="outline" className="text-black bg-white hover:bg-gray-200">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                        />

                        {/* Overlay Guidelines */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-30">
                            <div className="w-48 h-64 border-2 border-dashed border-white rounded-[40px] mb-20" />
                        </div>

                        {/* Simulated Product Overlay */}
                        {isCameraActive && (
                            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none transition-all duration-500 ${isProcessing ? 'scale-110 opacity-50 blur-sm' : 'scale-100 opacity-90'}`}>
                                <img
                                    src={productImageUrl}
                                    alt="Product Overlay"
                                    className="w-full h-full object-contain drop-shadow-2xl mix-blend-multiply filter contrast-125"
                                />
                            </div>
                        )}

                        {/* Processing Indicator */}
                        {isProcessing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                                <div className="text-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-yellow-500 font-medium tracking-wide animate-pulse">Adjusting Fit...</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-xs text-center text-gray-300 max-w-xs">
                        Position yourself within the frame. The AI will automatically map the item to your body.
                    </p>
                    <div className="flex justify-center gap-4 w-full max-w-md">
                        <Button
                            className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600 font-bold"
                            onClick={simulateProcessing}
                            disabled={!isCameraActive || isProcessing}
                        >
                            <Shirt className="w-4 h-4 mr-2" />
                            Recalibrate Fit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
