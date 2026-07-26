"use client";

import { useState } from "react";
import { Scale, Loader2, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface CompareDialogProps {
  items: any[];
  onClear: () => void;
}

export function CompareDialog({ items, onClear }: CompareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);

  const fetchComparison = async () => {
    if (items.length < 2) {
       toast.error("Please select at least 2 items to compare.");
       return;
    }

    setLoading(true);
    setIsOpen(true);

    try {
      const res = await fetch("/api/ai-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Failed to get comparison");
      const data = await res.json();
      setComparison(data);
    } catch (error) {
      console.error(error);
      toast.error("AI Comparison failed.");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating Action Button for Comparison when items are selected */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 bg-background p-3 rounded-lg border shadow-lg">
         <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-sm font-medium">{items.length} selected</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onClear}>
                <X className="h-4 w-4" />
            </Button>
         </div>
         <div className="flex gap-2">
            {items.map(item => (
                <div key={item.id} className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border">
                     {item.images?.[0] || item.mainImageUrl ? (
                        <Image src={item.images?.[0] || item.mainImageUrl} alt={item.name} fill className="object-cover" />
                     ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                     )}
                </div>
            ))}
         </div>
         <Button onClick={fetchComparison} disabled={items.length < 2} className="w-full mt-2 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
             <Scale className="w-4 h-4" /> Compare
         </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-500" />
              AI Product Comparison
            </DialogTitle>
            <DialogDescription>
              Intelligent analysis to help you make the best choice.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm">Analyzing products and extracting key differences...</p>
              </div>
            ) : comparison ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">

                  {/* Summary */}
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Analysis Summary</h4>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200">{comparison.summary}</p>
                  </div>

                  {/* Feature Comparison Table */}
                  <div className="rounded-md border overflow-hidden">
                      <div className="grid grid-cols-3 bg-muted p-3 text-sm font-semibold text-center border-b">
                          <div className="text-left">Feature</div>
                          <div className="truncate px-2">{items[0]?.name}</div>
                          <div className="truncate px-2">{items[1]?.name}</div>
                      </div>

                      <div className="divide-y">
                          {comparison.features?.map((feature: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-3 p-3 text-sm items-center">
                                  <div className="font-medium text-muted-foreground">{feature.name}</div>
                                  <div className="text-center flex flex-col items-center gap-1">
                                      <span className={feature.betterFor === items[0]?.id ? "font-bold text-green-600" : ""}>
                                          {feature.name.toLowerCase().includes('price') ? formatPrice(Number(feature.item1Value) * 100) : feature.item1Value}
                                      </span>
                                      {feature.betterFor === items[0]?.id && <Check className="w-3 h-3 text-green-600" />}
                                  </div>
                                  <div className="text-center flex flex-col items-center gap-1">
                                      <span className={feature.betterFor === items[1]?.id ? "font-bold text-green-600" : ""}>
                                           {feature.name.toLowerCase().includes('price') ? formatPrice(Number(feature.item2Value) * 100) : feature.item2Value}
                                      </span>
                                      {feature.betterFor === items[1]?.id && <Check className="w-3 h-3 text-green-600" />}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Final Recommendation */}
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900/50 flex gap-4 items-start">
                      <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-full mt-1">
                          <Check className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">Final Verdict</h4>
                          <p className="text-sm text-green-800 dark:text-green-200">{comparison.recommendation}</p>
                      </div>
                  </div>

              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}