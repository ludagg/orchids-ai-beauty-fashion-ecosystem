"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fitData, setFitData] = useState<{
    recommendedSize: string;
    confidence: number;
    analysis: string;
  } | null>(null);

  const fetchFitData = async () => {
    if (!session?.user || !product || !product.sizes || product.sizes.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      if (res.ok) {
        const data = await res.json();
        setFitData(data);
      }
    } catch (error) {
      console.error("Error fetching AI fit data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, session?.user]);

  if (!product || !product.sizes || product.sizes.length === 0) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              {loading ? (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 bg-yellow-500/20" />
                  <Skeleton className="h-3 w-24 bg-yellow-500/20" />
                </div>
              ) : fitData ? (
                <>
                  <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    AI recommends size {fitData.recommendedSize}
                  </div>
                  <div className="text-xs text-yellow-600/80 dark:text-yellow-400/80">
                    Based on your profile ({fitData.confidence}% match)
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    Get AI Size Recommendation
                  </div>
                  <div className="text-xs text-yellow-600/80 dark:text-yellow-400/80">
                    Add measurements to profile
                  </div>
                </>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-yellow-600/50" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            We analyzed your profile measurements against this {product.brand || 'product'}'s sizing.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
           <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
           </div>
        ) : fitData ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-2">
               <div className="text-sm text-muted-foreground">Recommended Size</div>
               <div className="text-5xl font-bold text-yellow-500">{fitData.recommendedSize}</div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Fit Confidence</span>
                    <span className="font-bold">{fitData.confidence}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${fitData.confidence}%` }}
                    />
                </div>
            </div>

            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              {fitData.analysis}
            </div>
          </div>
        ) : (
           <div className="py-8 text-center text-muted-foreground">
               Sign in and complete your profile measurements to get personalized sizing recommendations.
           </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
