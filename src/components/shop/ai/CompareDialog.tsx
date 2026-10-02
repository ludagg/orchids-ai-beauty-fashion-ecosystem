"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Check, X, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CompareDialogProps {
  productIds: string[];
  disabled?: boolean;
}

export function CompareDialog({ productIds, disabled }: CompareDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleCompare = async () => {
    if (productIds.length < 2) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val && !data && !loading) {
        handleCompare();
      }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || productIds.length < 2}
          className="gap-2"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Compare Selected ({productIds.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Comparison
          </DialogTitle>
          <DialogDescription>
            Let our AI help you decide between these items.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm text-muted-foreground">Analyzing products...</p>
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6 mt-4">
            <div className="bg-muted/50 p-4 rounded-xl text-sm border border-border">
              <p className="font-medium text-foreground">AI Verdict</p>
              <p className="text-muted-foreground mt-1">{data.comparison.summary}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.products.map((product: any) => {
                const isWinner = data.comparison.winnerId === product.id;
                const features = data.comparison.features.find((f: any) => f.id === product.id);

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "border rounded-xl p-3 space-y-3 flex flex-col",
                      isWinner ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20 ring-1 ring-violet-500" : "bg-card"
                    )}
                  >
                    {isWinner && (
                      <div className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-[-4px]">
                        Top Pick
                      </div>
                    )}

                    <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                      {product.mainImageUrl ? (
                        <Image src={product.mainImageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                      <p className="text-lg font-bold mt-1">
                        {formatPrice(product.salePrice || product.originalPrice)}
                      </p>
                    </div>

                    {features && (
                      <div className="space-y-3 mt-auto pt-3 border-t text-xs">
                        {features.pros && features.pros.length > 0 && (
                          <div className="space-y-1">
                            {features.pros.map((pro: string, i: number) => (
                              <div key={i} className="flex gap-1.5 items-start text-emerald-600 dark:text-emerald-400">
                                <Check className="w-3 h-3 mt-0.5 shrink-0" />
                                <span className="leading-tight">{pro}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {features.cons && features.cons.length > 0 && (
                          <div className="space-y-1">
                            {features.cons.map((con: string, i: number) => (
                              <div key={i} className="flex gap-1.5 items-start text-red-500 dark:text-red-400">
                                <X className="w-3 h-3 mt-0.5 shrink-0" />
                                <span className="leading-tight">{con}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full mt-2"
                      size="sm"
                      variant={isWinner ? "default" : "outline"}
                      onClick={() => window.location.href = `/app/shop/product/${product.id}`}
                    >
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
