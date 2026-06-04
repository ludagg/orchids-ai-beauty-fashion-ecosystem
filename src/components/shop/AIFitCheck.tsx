"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface AIFitCheckProps {
  productId: string;
  sizes: any[];
}

export function AIFitCheck({ productId, sizes }: AIFitCheckProps) {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fitData, setFitData] = useState<{
    recommendedSize: string;
    confidenceScore: number;
    reasoning: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFitRecommendation = async () => {
    if (!session?.user) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ai-fit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI recommendation.");
      }

      const data = await response.json();
      if (data.error) {
         setError(data.error);
      } else {
         setFitData(data);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the AI recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && session?.user && !fitData) {
      fetchFitRecommendation();
    }
  };

  // If there's no session data loaded yet or no sizes available, don't show the check yet (or show a skeleton)
  if (sizes.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenChange(true) }} className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                AI Fit Check
                {fitData?.recommendedSize && <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[10px] leading-none font-bold">Size {fitData.recommendedSize}</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {isPending ? "Loading..." : (!session?.user ? "Sign in to get your perfect size" : "Find your perfect size match")}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-yellow-500" />
            AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
            Our AI analyzes your body measurements and product dimensions to find the perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[160px] flex flex-col justify-center">
          {!session?.user ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You need to be signed in and have completed your profile (height, weight, body type) to use the AI Fit Check.
              </p>
              <Button onClick={() => window.location.href = '/login'} className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-bold">
                Sign In
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm animate-pulse">Calculating your perfect fit...</p>
            </div>
          ) : error ? (
             <div className="text-center p-4 bg-red-50 text-red-600 rounded-md">
                <p className="text-sm">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchFitRecommendation} className="mt-4">
                    Try Again
                </Button>
             </div>
          ) : fitData ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">Recommended Size</div>
                <div className="text-5xl font-black text-yellow-500">{fitData.recommendedSize}</div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="font-medium">Match Confidence</span>
                    <span>{fitData.confidenceScore}%</span>
                 </div>
                 <Progress value={fitData.confidenceScore} className="h-2" />
                 <p className="text-xs text-muted-foreground text-right">
                    {fitData.confidenceScore >= 90 ? "Excellent Match" : fitData.confidenceScore >= 70 ? "Good Match" : "Fair Match"}
                 </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">AI Reasoning:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fitData.reasoning}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
