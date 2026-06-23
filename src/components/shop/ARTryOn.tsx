"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanFace, Camera, Loader2, Sparkles, RefreshCw } from "lucide-react";

interface ARTryOnProps {
  productId: string;
  productName: string;
  imageUrl?: string;
  category?: string;
}

export function ARTryOn({ productId, productName, imageUrl, category }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const requestCamera = () => {
    setIsProcessing(true);
    // Simulate camera permission and loading
    setTimeout(() => {
      setHasPermission(true);
      setIsProcessing(false);
    }, 1500);
  };

  const simulateCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowResult(true);
      setIsProcessing(false);
    }, 2000);
  };

  const reset = () => {
    setShowResult(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
          <ScanFace className="w-4 h-4" />
          Virtual Try-On
          <Sparkles className="w-3 h-3 text-yellow-500 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-yellow-500" />
            AR Try-On: {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-[3/4] bg-muted rounded-xl overflow-hidden mt-4 border border-border">
          {/* Main AR Viewport */}

          {!hasPermission && !isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-background/80 backdrop-blur-sm z-10">
              <Camera className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Camera Access Required</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We need access to your camera to show how this {category || 'item'} looks on you.
              </p>
              <Button onClick={requestCamera} className="w-full sm:w-auto">
                Allow Camera Access
              </Button>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-20">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-sm font-medium animate-pulse">
                {hasPermission ? "Applying AI Model..." : "Initializing AR Engine..."}
              </p>
            </div>
          )}

          {hasPermission && !showResult && !isProcessing && (
            <div className="absolute inset-0 bg-slate-900">
              {/* Mock Live Camera Feed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                 <ScanFace className="w-32 h-32 text-white" />
              </div>

              {/* Face Guide Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                 <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-[40%] animate-pulse" />
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16 p-0 border-4 border-white/20 hover:border-white/40 transition-all shadow-xl bg-yellow-500 hover:bg-yellow-400"
                  onClick={simulateCapture}
                >
                   <Camera className="w-6 h-6 text-black" />
                </Button>
              </div>
            </div>
          )}

          {showResult && !isProcessing && (
             <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900">
               {/* Mock Result */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                      <div className="relative w-32 h-32 mx-auto mb-4 bg-muted rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl">
                          {imageUrl ? (
                             <img src={imageUrl} alt={productName} className="w-full h-full object-cover" />
                          ) : (
                             <ScanFace className="w-full h-full p-6 text-muted-foreground" />
                          )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">Perfect Match!</h3>
                      <p className="text-sm text-muted-foreground">The AI Fit Engine rates this look 94%.</p>
                  </div>
               </div>

               <div className="absolute top-4 right-4 z-30">
                   <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={reset}>
                       <RefreshCw className="w-4 h-4" />
                   </Button>
               </div>
             </div>
          )}

        </div>

        <div className="text-center mt-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
               Powered by Rare AR Engine
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
