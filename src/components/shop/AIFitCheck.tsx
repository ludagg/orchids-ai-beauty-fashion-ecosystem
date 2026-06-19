"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, ChevronRight, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIFitCheckProps {
  productId: string;
  brand?: string;
}

interface FitResponse {
  recommendedSize: string;
  confidence: number;
  reasoning: string;
}

export function AIFitCheck({ productId, brand }: AIFitCheckProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchFitData() {
      if (!open || result || loading) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai-fit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch fit recommendation');
        }

        const data = await response.json();
        setResult(data);
      } catch (err: any) {
        console.error(err);
        setError("Could not generate AI fit recommendation at this time.");
      } finally {
        setLoading(false);
      }
    }

    fetchFitData();
  }, [open, productId, result, loading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                {result ? `AI recommends size ${result.recommendedSize}` : "Check AI Fit Recommendation"}
              </div>
              <div className="text-xs text-muted-foreground">Based on your profile</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <Ruler className="h-5 w-5 text-yellow-500" />
             AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
            {brand ? `We analyzed your profile against ${brand}'s sizing charts.` : 'We analyzed your profile measurements for this item.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-[120px] flex flex-col justify-center">
          {loading ? (
             <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-6">
                 <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                 <p className="text-sm">Analyzing measurements...</p>
             </div>
          ) : error ? (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-4 rounded-md border border-red-200 dark:border-red-900">
                 {error}
              </div>
          ) : result ? (
             <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4 bg-muted/30 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-1">Recommended Size</div>
                    <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{result.recommendedSize}</div>
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Confidence Score: <span className="font-medium text-foreground">{result.confidence}%</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Why this size?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-md">
                        {result.reasoning}
                    </p>
                </div>
             </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
