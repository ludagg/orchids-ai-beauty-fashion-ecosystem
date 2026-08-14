"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, XCircle } from "lucide-react";

interface CompareDialogProps {
    productId: string;
    productName: string;
    productCategory: string;
}

export function CompareDialog({ productId, productName, productCategory }: CompareDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [comparisonData, setComparisonData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCompare = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/ai-compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, productName, productCategory })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch comparison");
            }

            const data = await response.json();
            setComparisonData(data);
        } catch (err) {
            setError("Could not load comparison. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open && !comparisonData && !isLoading) {
                handleCompare();
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    AI Compare
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        AI Comparison
                    </DialogTitle>
                    <DialogDescription>
                        Comparing {productName} against similar alternatives.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            <p className="text-sm text-muted-foreground animate-pulse">Analyzing alternatives...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-6 text-red-500 space-y-2">
                            <XCircle className="h-8 w-8" />
                            <p className="text-sm">{error}</p>
                            <Button variant="outline" size="sm" onClick={handleCompare} className="mt-2">Try Again</Button>
                        </div>
                    ) : comparisonData ? (
                        <div className="space-y-6">
                            <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">AI Summary</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {comparisonData.summary}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Pros & Cons of {productName}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="font-medium text-xs text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Pros</div>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                                            {comparisonData.pros?.map((pro: string, i: number) => <li key={i}>{pro}</li>)}
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-medium text-xs text-red-600 flex items-center gap-1"><XCircle className="h-3 w-3" /> Cons</div>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                                            {comparisonData.cons?.map((con: string, i: number) => <li key={i}>{con}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {comparisonData.alternatives && comparisonData.alternatives.length > 0 && (
                                <div className="space-y-3 border-t pt-4">
                                    <h4 className="font-semibold text-sm">Consider These Instead</h4>
                                    <div className="space-y-3">
                                        {comparisonData.alternatives.map((alt: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1 border p-3 rounded-md bg-background">
                                                <div className="font-medium text-sm flex justify-between items-center">
                                                    <span>{alt.name}</span>
                                                    {alt.price && <span className="text-xs font-bold text-yellow-600">{alt.price}</span>}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{alt.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
