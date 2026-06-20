"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AIFitCheckProps {
    product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
    const [recommendation, setRecommendation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFitRecommendation() {
            try {
                const res = await fetch("/api/ai-fit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ product })
                });

                if (res.ok) {
                    const data = await res.json();
                    setRecommendation(data);
                } else if (res.status === 401) {
                    // Not logged in, handled gracefully
                    setRecommendation({ error: "Please sign in to get personalized size recommendations." });
                } else {
                    console.error("Failed to fetch AI fit recommendation");
                    setRecommendation({ error: "Could not fetch recommendation at this time." });
                }
            } catch (error) {
                console.error("Error fetching AI fit recommendation:", error);
                setRecommendation({ error: "An unexpected error occurred." });
            } finally {
                setLoading(false);
            }
        }

        if (product) {
            fetchFitRecommendation();
        }
    }, [product]);

    if (loading) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/50 text-white">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-yellow-700/50 dark:text-yellow-400/50">
                            Analyzing your perfect fit...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!recommendation || recommendation.error) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Ruler className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-foreground">
                            AI Fit Check Unavailable
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {recommendation?.error || "Update your profile to enable."}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!recommendation.recommendedSize) {
         return (
            <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                        <Ruler className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                            Update profile for size advice
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {recommendation.reasoning}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                AI recommends size {recommendation.recommendedSize}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <span>Based on your profile</span>
                                {recommendation.confidence > 0 && (
                                    <span className="text-[10px] bg-yellow-500/20 px-1.5 py-0.5 rounded-md font-bold text-yellow-700 dark:text-yellow-400">
                                        {recommendation.confidence}% match
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
                        </div>
                        Your Fit Analysis
                    </DialogTitle>
                    <DialogDescription>
                        Powered by AI Style Engine
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Recommended Size</div>
                        <div className="text-6xl font-black text-foreground drop-shadow-sm">{recommendation.recommendedSize}</div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                        <h4 className="font-semibold mb-2 text-sm">Why this size?</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {recommendation.reasoning}
                        </p>
                    </div>

                    {recommendation.confidence > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Confidence Score</span>
                                <span className="font-bold">{recommendation.confidence}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${recommendation.confidence}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
