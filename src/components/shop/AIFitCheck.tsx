"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, ChevronRight, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AIFitCheckProps {
    productId: string;
}

interface FitRecommendation {
    recommendedSize: string;
    confidenceScore: number;
    explanation: string;
}

export function AIFitCheck({ productId }: AIFitCheckProps) {
    const { data: session, isPending: isSessionLoading } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{ message: string; code?: string } | null>(null);
    const [recommendation, setRecommendation] = useState<FitRecommendation | null>(null);

    useEffect(() => {
        if (isOpen && session?.user && !recommendation && !error) {
            fetchRecommendation();
        }
    }, [isOpen, session]);

    const fetchRecommendation = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/ai-fit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError({ message: data.message || data.error, code: data.code });
            } else {
                setRecommendation(data);
            }
        } catch (err) {
            setError({ message: "Failed to connect to AI Fit Check service." });
        } finally {
            setIsLoading(false);
        }
    };

    // Before clicking, show a generic preview
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-1.5">
                                AI Fit Check
                                <Sparkles className="h-3 w-3" />
                            </div>
                            <div className="text-xs text-muted-foreground">Find your perfect size</div>
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
                        We analyze your profile measurements and product details to find your perfect fit.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {isSessionLoading ? (
                         <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            <p>Checking authentication...</p>
                        </div>
                    ) : !session?.user ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30 px-4">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Sign in required</h3>
                                <p className="text-sm text-muted-foreground mt-1">Please sign in to use the AI Fit Check feature.</p>
                            </div>
                            <Button asChild variant="outline" className="mt-2">
                                <Link href="/auth/signin">Sign In</Link>
                            </Button>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            <p>Analyzing product dimensions and your profile...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 bg-red-500/10 rounded-lg border border-red-500/20 px-4 text-red-600 dark:text-red-400">
                            <AlertCircle className="h-8 w-8" />
                            <div>
                                <h3 className="font-semibold">Analysis Failed</h3>
                                <p className="text-sm mt-1">{error.message}</p>
                            </div>
                            {error.code === "MISSING_MEASUREMENTS" && (
                                <Button asChild variant="outline" className="mt-2 border-red-500/50 hover:bg-red-500/10">
                                    <Link href="/app/profile">Update Profile</Link>
                                </Button>
                            )}
                        </div>
                    ) : recommendation ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-xl border border-yellow-500/20">
                                <div className="text-sm font-medium text-muted-foreground mb-2">Recommended Size</div>
                                <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400">
                                    {recommendation.recommendedSize}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Confidence Score</span>
                                    <span className="font-bold">{recommendation.confidenceScore}%</span>
                                </div>
                                <Progress value={recommendation.confidenceScore} className="h-2 bg-muted">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                                        style={{ width: `${recommendation.confidenceScore}%` }}
                                    />
                                </Progress>
                                <p className="text-xs text-muted-foreground text-center mt-1">
                                    {recommendation.confidenceScore > 80 ? "High match probability" : "Moderate match probability"}
                                </p>
                            </div>

                            <div className="bg-muted p-4 rounded-lg text-sm border">
                                <div className="font-semibold mb-1 flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                    AI Insights
                                </div>
                                <p className="text-muted-foreground">{recommendation.explanation}</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
