"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, Ruler, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AIFitCheckProps {
    productId: string;
}

export function AIFitCheck({ productId }: AIFitCheckProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{recommendedSize: string, explanation: string, confidenceScore: number} | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && !result && !error) {
            fetchFitRecommendation();
        }
    }, [open]);

    const fetchFitRecommendation = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/ai-fit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Please log in to use AI Fit Check");
                throw new Error("Failed to get recommendation");
            }

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                                AI Fit Check
                                {result && <span className="px-1.5 py-0.5 rounded-sm bg-yellow-500/20 text-[10px]">Size {result.recommendedSize}</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">Get your personalized size recommendation</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        AI Fit Analysis
                    </DialogTitle>
                    <DialogDescription>
                        Our AI analyzes your body profile and this product's specific cut to find your perfect fit.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center h-24">
                                <div className="flex flex-col items-center gap-2 text-yellow-500">
                                    <Sparkles className="h-8 w-8 animate-pulse" />
                                    <span className="text-sm animate-pulse">Analyzing measurements...</span>
                                </div>
                            </div>
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-900/20 flex flex-col items-center text-center gap-2">
                            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
                            <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
                            {error.includes("log in") ? (
                                <Button className="mt-2" variant="outline" onClick={() => window.location.href = "/login"}>Log in</Button>
                            ) : (
                                <Button className="mt-2" variant="outline" onClick={fetchFitRecommendation}>Try Again</Button>
                            )}
                        </div>
                    ) : result ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center gap-2 py-4">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Recommended Size</div>
                                <div className="text-6xl font-black text-yellow-500 drop-shadow-sm">{result.recommendedSize}</div>
                            </div>

                            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Confidence Score</span>
                                    <span className="text-sm font-bold text-yellow-600">{result.confidenceScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${result.confidenceScore}%` }}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground pt-2 border-t">
                                    {result.explanation}
                                </p>
                            </div>

                            {result.confidenceScore === 0 && (
                                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/app/settings"}>
                                    Update Body Profile
                                </Button>
                            )}
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
