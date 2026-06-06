"use client";

import { useState } from "react";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AIFitCheck({ productId, productCategory }: { productId: string, productCategory?: string }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen && !result && !loading) {
            setLoading(true);
            try {
                const res = await fetch("/api/ai-fit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, category: productCategory }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setResult(data);
                } else {
                    setResult({ error: "Failed to analyze fit." });
                }
            } catch (error) {
                setResult({ error: "An error occurred." });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                AI Fit Check
                            </div>
                            <div className="text-xs text-muted-foreground">Find your perfect size</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Fit Analysis</DialogTitle>
                    <DialogDescription>
                        We analyze your profile measurements and purchase history.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[160px] flex flex-col items-center justify-center p-4 bg-muted/30 rounded-md">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                            <span className="text-sm">Analyzing dimensions...</span>
                        </div>
                    ) : result?.error ? (
                        <div className="text-sm text-red-500">{result.error}</div>
                    ) : result ? (
                        <div className="w-full space-y-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-600 mb-1">
                                    Size {result.recommendedSize}
                                </div>
                                <div className="text-sm font-medium text-foreground">
                                    {result.confidence}% Confidence
                                </div>
                            </div>
                            <div className="bg-background p-3 rounded-md border text-sm text-muted-foreground">
                                {result.explanation}
                            </div>
                            <div className="text-xs text-center text-muted-foreground mt-2">
                                Based on: {result.factors?.join(", ") || "General sizing trends"}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Click to run analysis</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
