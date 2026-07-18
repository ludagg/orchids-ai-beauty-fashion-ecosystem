"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scale, Sparkles, Loader2, X } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatPrice = (cents: number, locale = 'en-IN', currency = 'INR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

interface CompareDialogProps {
  baseProduct: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    images?: string[];
    brand?: string;
  };
}

export function CompareDialog({ baseProduct }: CompareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetQuery, setTargetQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const handleCompare = async () => {
    if (!targetQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseProductId: baseProduct.id,
          targetQuery: targetQuery,
        }),
      });

      if (!res.ok) throw new Error("Failed to compare");
      const data = await res.json();
      setComparisonResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full mt-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}>
          <Scale className="w-4 h-4" />
          Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {!comparisonResult ? (
            <>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {baseProduct.images?.[0] ? (
                    <Image src={baseProduct.images[0]} alt={baseProduct.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{baseProduct.name}</h4>
                  <p className="text-sm font-bold mt-1">{formatPrice(baseProduct.price)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 items-center justify-center py-2">
                 <div className="h-8 w-[1px] bg-border" />
                 <span className="text-xs font-medium text-muted-foreground bg-background px-2">VS</span>
                 <div className="h-8 w-[1px] bg-border" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">What do you want to compare it with?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. A cheaper alternative, or 'Nike Air Max'"
                    value={targetQuery}
                    onChange={(e) => setTargetQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <Button onClick={handleCompare} disabled={loading || !targetQuery.trim()}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Compare"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
             <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">Analysis</h3>
                        <Button variant="ghost" size="sm" onClick={() => setComparisonResult(null)}>
                            Reset
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Base Product */}
                        <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
                            <div className="w-full aspect-square relative rounded-md overflow-hidden bg-background">
                                {comparisonResult.baseProduct.images?.[0] ? (
                                    <Image src={comparisonResult.baseProduct.images[0]} alt={comparisonResult.baseProduct.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-sm line-clamp-2">{comparisonResult.baseProduct.name}</h4>
                                <p className="text-sm font-bold mt-1">{formatPrice(comparisonResult.baseProduct.price)}</p>
                            </div>
                        </div>

                        {/* Target Product */}
                        {comparisonResult.targetProduct ? (
                            <div className="space-y-3 p-3 rounded-lg border bg-violet-50/50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-900/50">
                                <div className="w-full aspect-square relative rounded-md overflow-hidden bg-background">
                                    {comparisonResult.targetProduct.images?.[0] ? (
                                        <Image src={comparisonResult.targetProduct.images[0]} alt={comparisonResult.targetProduct.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm line-clamp-2 text-violet-900 dark:text-violet-100">{comparisonResult.targetProduct.name}</h4>
                                    <p className="text-sm font-bold mt-1 text-violet-700 dark:text-violet-300">{formatPrice(comparisonResult.targetProduct.price)}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-4 border border-dashed rounded-lg text-sm text-muted-foreground text-center">
                                No similar product found to compare against.
                            </div>
                        )}
                    </div>

                    {/* AI Insights */}
                    <div className="space-y-4">
                         <div className="p-4 rounded-lg bg-card border">
                             <div className="flex items-center gap-2 mb-2 text-violet-600 dark:text-violet-400 font-medium">
                                 <Sparkles className="w-4 h-4" />
                                 Verdict
                             </div>
                             <p className="text-sm leading-relaxed">{comparisonResult.comparison.summary}</p>
                         </div>

                         {comparisonResult.targetProduct && (
                             <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <h5 className="font-medium">Why choose {baseProduct.name?.substring(0, 15)}...</h5>
                                    <ul className="space-y-1">
                                        {comparisonResult.comparison.basePros.map((pro: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-500 mt-0.5">+</span>
                                                <span className="text-muted-foreground leading-snug">{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="font-medium">Why choose {comparisonResult.targetProduct.name?.substring(0, 15)}...</h5>
                                    <ul className="space-y-1">
                                        {comparisonResult.comparison.targetPros.map((pro: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-500 mt-0.5">+</span>
                                                <span className="text-muted-foreground leading-snug">{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             </div>
                         )}
                    </div>
                </div>
             </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
