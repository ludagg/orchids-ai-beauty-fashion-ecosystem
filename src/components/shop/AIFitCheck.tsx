"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
  productId: string;
}

interface FitData {
  recommendation: string;
  confidence: number;
  reasoning: string;
  fitPrediction: string;
}

export function AIFitCheck({ productId }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingData, setMissingData] = useState(false);
  const [fitData, setFitData] = useState<FitData | null>(null);

  useEffect(() => {
    async function fetchFitData() {
      if (!session?.user) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai-fit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        const data = await res.json();

        if (res.ok) {
          setFitData(data);
        } else if (data.code === "MISSING_MEASUREMENTS") {
          setMissingData(true);
        } else {
          setError(data.error || "Failed to analyze fit");
        }
      } catch (err) {
        console.error("AI Fit check error", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchFitData();
  }, [productId, session]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium">AI Fit Check</div>
            <div className="text-xs text-muted-foreground">Sign in to get size recommendations</div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 opacity-70">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
          <div className="space-y-1">
             <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
             <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (missingData) {
    return (
      <Link href="/app/profile">
        <div className="flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 hover:bg-blue-500/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                Unlock AI Fit Check
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Add your measurements to profile</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    );
  }

  if (error || !fitData) {
    return null;
  }

  // Calculate colors based on confidence
  let confidenceColor = "text-yellow-600 dark:text-yellow-400";
  let confidenceBg = "bg-yellow-100 dark:bg-yellow-900/30";
  let confidenceBorder = "border-yellow-200 dark:border-yellow-800";

  if (fitData.confidence >= 80) {
    confidenceColor = "text-emerald-600 dark:text-emerald-400";
    confidenceBg = "bg-emerald-100 dark:bg-emerald-900/30";
    confidenceBorder = "border-emerald-200 dark:border-emerald-800";
  } else if (fitData.confidence < 60) {
    confidenceColor = "text-orange-600 dark:text-orange-400";
    confidenceBg = "bg-orange-100 dark:bg-orange-900/30";
    confidenceBorder = "border-orange-200 dark:border-orange-800";
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn("flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors group", confidenceBg, confidenceBorder)}>
          <div className="flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm", confidenceColor)}>
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className={cn("text-sm font-bold flex items-center gap-1.5", confidenceColor)}>
                AI recommends size {fitData.recommendation}
              </div>
              <div className="text-xs opacity-80 mt-0.5">Based on your profile ({fitData.confidence}% match)</div>
            </div>
          </div>
          <ChevronRight className={cn("h-4 w-4 group-hover:translate-x-1 transition-transform", confidenceColor)} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
            Personalized sizing prediction for this specific item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-muted">
              <div
                className="absolute inset-0 rounded-full border-8 border-violet-500 rounded-full"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                  transform: `rotate(${(fitData.confidence / 100) * 360}deg)`
                }}
              />
              <div className="text-center z-10 bg-background rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-sm">
                 <span className="text-3xl font-black">{fitData.recommendation}</span>
                 <span className="text-[10px] text-muted-foreground uppercase font-semibold">Size</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-semibold">{fitData.confidence}%</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Predicted Fit</span>
              <span className="font-semibold capitalize">{fitData.fitPrediction}</span>
            </div>
            <div className="text-sm pt-1">
              <span className="text-muted-foreground block mb-1">Reasoning</span>
              <span className="leading-relaxed">{fitData.reasoning}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
