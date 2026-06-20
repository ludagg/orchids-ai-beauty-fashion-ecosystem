"use client";

import React, { useState, useEffect } from 'react';
import { Ruler, ChevronRight, Loader2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AIFitCheckProps {
  productId: string;
  brand?: string;
  mainCategory?: string;
  subcategory?: string;
}

export function AIFitCheck({ productId, brand, mainCategory, subcategory }: AIFitCheckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ recommendation: string; confidence: number; reasoning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFitData = async () => {
    if (data || loading) return; // Don't fetch if already have data
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, brand, mainCategory, subcategory })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch AI recommendation');
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError('Could not analyze fit at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFitData();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                {data ? `AI recommends size ${data.recommendation}` : 'AI Fit Check Analysis'}
              </div>
              <div className="text-xs text-muted-foreground">
                {data ? `${Math.round(data.confidence * 100)}% Match` : 'Tap to see your recommended size'}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-3 w-3" />
            </div>
            AI Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            Personalized sizing based on your profile and brand specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[160px] flex flex-col justify-center">
          {loading && (
             <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                <p className="text-sm animate-pulse">Analyzing measurements and product specs...</p>
             </div>
          )}

          {error && !loading && (
             <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive text-center">
                {error}
                <Button variant="outline" size="sm" className="mt-3 w-full" onClick={fetchFitData}>Retry</Button>
             </div>
          )}

          {data && !loading && !error && (
            <div className="space-y-6">
               <div className="flex flex-col items-center justify-center space-y-2 py-4 border-b">
                 <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recommended Size</span>
                 <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-yellow-500 bg-yellow-50 text-3xl font-bold text-yellow-700 shadow-inner">
                    {data.recommendation}
                 </div>
                 <Badge variant={data.confidence > 0.8 ? "default" : "secondary"} className="mt-2">
                    {Math.round(data.confidence * 100)}% Confidence
                 </Badge>
               </div>

               <div className="space-y-2">
                 <h4 className="text-sm font-medium">Why this size?</h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.reasoning}
                 </p>
               </div>

               <div className="text-xs text-center text-muted-foreground pt-2">
                 Update your profile measurements for even better accuracy.
               </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
