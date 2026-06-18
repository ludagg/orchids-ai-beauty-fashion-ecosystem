"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Ruler, ChevronRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
  productId: string;
  productName: string;
  brand?: string | null;
  category?: string | null;
}

export function AIFitCheck({ productId, productName, brand, category }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [recommendation, setRecommendation] = useState<{
    size: string;
    confidence: number;
    explanation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchFitRecommendation = async () => {
    if (!session?.user) {
      setError("Please sign in to use the AI Fit Check feature.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          brand,
          category,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch recommendation");
      }

      const data = await res.json();
      setRecommendation(data.recommendation);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && !recommendation && !loading && !error) {
      fetchFitRecommendation();
    }
  }, [open]);

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
                AI Fit Check
              </div>
              <div className="text-xs text-muted-foreground">Get personalized size recommendations</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-yellow-500" />
            AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
            We analyze your measurements and this product's specs to find your perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[160px] flex flex-col justify-center items-center rounded-md bg-muted/50 p-6 border border-border">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm font-medium animate-pulse">Analyzing your profile...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-destructive font-medium">{error}</p>
              {!session?.user && (
                 <p className="text-xs text-muted-foreground mt-2">
                    Add your height, weight, and body type in your profile for accurate AI predictions.
                 </p>
              )}
            </div>
          ) : recommendation ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center justify-center gap-2">
                <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-4 border-yellow-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {recommendation.size}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-center">
                <h3 className="font-semibold text-foreground flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Recommended Size
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {recommendation.confidence}% Confidence Match
                </p>
              </div>

              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                   className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                   style={{ width: `${recommendation.confidence}%` }}
                />
              </div>

              <div className="mt-2 text-sm text-center leading-relaxed text-muted-foreground bg-background rounded-lg p-3 border border-border/50">
                {recommendation.explanation}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
