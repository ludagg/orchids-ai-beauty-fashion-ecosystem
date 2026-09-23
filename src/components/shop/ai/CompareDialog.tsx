"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface CompareDialogProps {
    items: any[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRemoveItem: (id: string) => void;
}

export function CompareDialog({ items, open, onOpenChange, onRemoveItem }: CompareDialogProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCompare = async () => {
        if (items.length < 2) {
            toast.error("Please select at least two items to compare");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/ai-compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });

            if (!res.ok) throw new Error("Failed to compare");

            const data = await res.json();
            setResult(data);
        } catch (error) {
            toast.error("Failed to perform AI comparison");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(price / 100);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setResult(null); // Reset on close
        }}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        AI Compare
                    </DialogTitle>
                    <DialogDescription>
                        Compare {items.length} selected items to find the best match for you.
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {items.map((item) => (
                                <div key={item.id} className="relative border rounded-lg p-2 flex flex-col items-center">
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="absolute -top-2 -right-2 bg-background border rounded-full p-1 hover:bg-destructive hover:text-white"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    <div className="relative w-full aspect-square bg-muted rounded-md mb-2 overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                                        )}
                                    </div>
                                    <div className="text-xs font-medium text-center line-clamp-2 h-8">{item.name}</div>
                                    <div className="text-sm font-bold mt-1">{formatPrice(item.price)}</div>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleCompare}
                            disabled={loading || items.length < 2}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? "Analyzing..." : "Compare Now"}
                        </Button>
                        {items.length < 2 && (
                            <p className="text-xs text-center text-muted-foreground mt-2">Select at least 2 items to compare.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 mt-4">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 text-yellow-700 dark:text-yellow-400">Recommendation</h4>
                            <p className="text-sm">{result.recommendation}</p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-2">Detailed Analysis</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{result.comparison}</p>
                        </div>

                        {result.features && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {Object.entries(result.features).map(([itemName, feats]: [string, any]) => (
                                    <div key={itemName} className="border rounded-lg p-3 bg-muted/30">
                                        <div className="font-semibold text-sm mb-2">{itemName}</div>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {feats.map((feat: string, i: number) => (
                                                <li key={i} className="text-xs text-muted-foreground">{feat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button variant="outline" className="w-full mt-4" onClick={() => setResult(null)}>
                            Back to Selection
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
