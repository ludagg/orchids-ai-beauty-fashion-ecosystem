"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProductIds: string[];
  onRemoveProduct: (id: string) => void;
  productsData?: any[]; // The frontend can pass full products or we can fetch them
}

interface ComparisonResult {
    summary: string;
    points: { title: string; description: string }[];
}

export function CompareDialog({ open, onOpenChange, selectedProductIds, onRemoveProduct, productsData = [] }: CompareDialogProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && selectedProductIds.length >= 2) {
        handleCompare();
    }
  }, [open, selectedProductIds]);

  const handleCompare = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
        const res = await fetch("/api/ai-compare", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemIds: selectedProductIds })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to compare products");
        }

        const data = await res.json();
        setResult(data);
    } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  // Filter the provided product data to only those selected
  const displayProducts = productsData.filter(p => selectedProductIds.includes(p.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Product Comparison</DialogTitle>
          <DialogDescription>
            See how your selected products stack up against each other.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
            {/* Selected Products Grid */}
            <div className="grid grid-cols-2 gap-4">
                {displayProducts.map((p, idx) => (
                    <div key={p.id} className="relative flex items-center gap-3 border rounded-lg p-3">
                        <div className="h-16 w-16 bg-muted rounded relative overflow-hidden shrink-0">
                             {(p.images?.[0] || p.mainImageUrl) && (
                                 <Image src={p.images?.[0] || p.mainImageUrl} alt={p.name} fill className="object-cover" />
                             )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => onRemoveProduct(p.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {selectedProductIds.length < 2 && (
                <div className="text-center p-6 bg-muted/30 rounded-lg text-muted-foreground">
                    Please select at least 2 products to compare.
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">AI is analyzing your products...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            {/* Results State */}
            {result && !loading && !error && selectedProductIds.length >= 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-semibold text-primary mb-1">AI Summary</h4>
                        <p className="text-sm">{result.summary}</p>
                    </div>

                    <div className="space-y-3">
                        {result.points.map((point, index) => (
                             <div key={index} className="border rounded-lg p-3">
                                 <h5 className="font-medium text-sm mb-1">{point.title}</h5>
                                 <p className="text-sm text-muted-foreground">{point.description}</p>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
