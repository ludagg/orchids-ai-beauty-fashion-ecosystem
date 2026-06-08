"use client";

import { useState } from "react";
import { Ruler, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AIFitCheckProps {
  productId: string;
  productDetails: {
    name: string;
    brand: string;
    sizes: { name: string }[];
  };
}

interface FitRecommendation {
  recommendedSize: string;
  confidence: "High" | "Medium" | "Low";
  reason: string;
}

export function AIFitCheck({ productId, productDetails }: AIFitCheckProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<FitRecommendation | null>(null);
  const [error, setError] = useState<{ message: string; requiresProfileUpdate?: boolean } | null>(null);

  const fetchFitCheck = async () => {
    if (recommendation || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDetails }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresProfileUpdate) {
            setError({ message: data.message, requiresProfileUpdate: true });
        } else {
            throw new Error(data.error || "Failed to fetch fit check");
        }
        return;
      }

      setRecommendation(data);
    } catch (err: any) {
      console.error(err);
      setError({ message: "Unable to analyze fit at this moment. Please try again later." });
      toast.error("AI Fit Check failed");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  const getConfidenceValue = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high": return 90;
      case "medium": return 60;
      case "low": return 30;
      default: return 50;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) fetchFitCheck();
    }}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                {recommendation ? `AI recommends size ${recommendation.recommendedSize}` : "AI Fit Check"}
              </div>
              <div className="text-xs text-muted-foreground">
                {recommendation ? "Based on your profile" : "Find your perfect size"}
              </div>
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
            Personalized sizing recommendations using your profile measurements.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm text-muted-foreground animate-pulse">Analyzing your fit...</p>
            </div>
          ) : error ? (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="space-y-3">
                    <p>{error.message}</p>
                    {error.requiresProfileUpdate && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                                setIsOpen(false);
                                router.push('/app/profile/edit'); // Adjust route as needed
                            }}
                        >
                            Update Profile
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
          ) : recommendation ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border">
                 <div className="text-5xl font-bold text-primary mb-2">
                    {recommendation.recommendedSize}
                 </div>
                 <div className="text-sm font-medium text-muted-foreground">
                    Recommended Size
                 </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="font-medium">Confidence Score</span>
                    <span className="text-muted-foreground font-semibold">{recommendation.confidence}</span>
                </div>
                <Progress
                    value={getConfidenceValue(recommendation.confidence)}
                    className={getConfidenceColor(recommendation.confidence)}
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                 <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Why this size?</h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                     {recommendation.reason}
                 </p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
