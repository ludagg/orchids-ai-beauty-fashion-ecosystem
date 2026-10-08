"use client";

import { useState } from 'react';
import { Ruler, ChevronRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AIFitCheckDialog({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fitData, setFitData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !fitData && !loading) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/ai-fit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product })
        });
        const data = await res.json();
        if (res.ok) {
          setFitData(data);
        } else {
          setError(data.error || "Failed to analyze fit");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                AI Fit Check
              </div>
              <div className="text-xs text-muted-foreground">Find your perfect size</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            Personalized sizing recommendations based on your profile and brand data.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[160px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 text-center">
          {loading ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                 <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                 <p className="text-sm">Analyzing product dimensions...</p>
             </div>
          ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
          ) : fitData ? (
             <div className="space-y-4 w-full">
                <div className="text-lg font-bold text-foreground">
                    Recommended Size: <span className="text-yellow-600 dark:text-yellow-400">{fitData.recommendedSize}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    {fitData.explanation}
                </div>
                {fitData.confidenceScore && (
                    <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
                        <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${fitData.confidenceScore}%` }}
                        />
                    </div>
                )}
                {fitData.confidenceScore && (
                     <p className="text-xs text-muted-foreground text-right mt-1">{fitData.confidenceScore}% match</p>
                )}
             </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
