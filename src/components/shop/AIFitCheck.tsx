"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Ruler, ChevronRight, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface AIFitCheckProps {
  productId: string;
  product: any;
}

export function AIFitCheck({ productId, product }: AIFitCheckProps) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [fitData, setFitData] = useState<{
    recommendedSize: string;
    confidenceScore: number;
    analysis: string;
    missingProfileInfo: boolean;
  } | null>(null);

  const fetchFitData = async () => {
    if (!session?.user) {
      toast.error("Please sign in to use the AI Fit Check");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch fit data");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setFitData(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze fit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch automatically on mount if we want to show it without clicking
    // fetchFitData();
  }, [productId, session]);

  if (!session?.user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          onClick={fetchFitData}
          className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ruler className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                AI Fit Check
              </div>
              <div className="text-xs text-muted-foreground">
                {loading ? "Analyzing your profile..." : fitData ? `Recommends size ${fitData.recommendedSize}` : "Get personalized size recommendation"}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-yellow-500" />
            AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
            Personalized sizing intelligence based on your profile measurements and product specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm">Calculating the perfect fit...</p>
            </div>
          ) : fitData ? (
            <>
              {fitData.missingProfileInfo ? (
                <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20 flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    <p className="font-semibold mb-1">Incomplete Profile</p>
                    <p>We need your height, weight, and body type to give an accurate recommendation. Please update your profile in settings.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Recommended Size</p>
                      <p className="text-3xl font-bold text-foreground">{fitData.recommendedSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${fitData.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-yellow-500">{fitData.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <h4 className="text-sm font-semibold mb-2">Analysis Details</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fitData.analysis}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
             <div className="h-40 flex items-center justify-center text-muted-foreground">
                <p>Could not load analysis.</p>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
