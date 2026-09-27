"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AIFitCheck({ productId, brand, category }: { productId: string, brand?: string, category?: string }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [needsMeasurements, setNeedsMeasurements] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchFit = async () => {
        if (result || loading) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, brand, category })
            });
            const data = await res.json();

            if (data.needsMeasurements) {
                setNeedsMeasurements(true);
            } else if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Failed to analyze fit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    onClick={fetchFit}
                    className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                {result ? `AI recommends size ${result.recommendedSize}` : "Get AI Size Recommendation"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {result ? `${result.confidence}% confidence match` : "Based on your measurements"}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Fit Analysis</DialogTitle>
                    <DialogDescription>
                        Personalized sizing powered by AI
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
                            <p className="text-sm text-muted-foreground">Analyzing measurements & brand sizing...</p>
                        </div>
                    ) : needsMeasurements ? (
                        <div className="space-y-4 text-center">
                            <p className="text-sm">Please update your profile with your height and weight to use the AI Fit Check.</p>
                            <Button variant="outline" className="w-full">Update Profile Measurements</Button>
                        </div>
                    ) : error ? (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    ) : result ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/20 border-4 border-yellow-500">
                                    <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{result.recommendedSize}</span>
                                </div>
                            </div>
                            <div className="space-y-2 text-center">
                                <h4 className="font-semibold text-lg">Perfect Match</h4>
                                <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between text-sm">
                                    <span>Confidence Score</span>
                                    <span className="font-semibold">{result.confidence}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 rounded-full"
                                        style={{ width: `${result.confidence}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
