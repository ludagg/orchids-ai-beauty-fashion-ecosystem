import React, { useState } from 'react';
import { Ruler, ChevronRight, Loader2, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AIFitCheck({ product, userMeasurements }: { product: any, userMeasurements: any }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          userMeasurements,
        }),
      });

      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      console.error('Failed to fetch AI Fit Check:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (open && !recommendation && !loading) {
        fetchRecommendation();
      }
    }}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                AI Fit Check
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Get your personalized size recommendation</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-yellow-500" />
            Virtual Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            Our AI analyzes your body profile and this brand's typical sizing to recommend the perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm text-muted-foreground animate-pulse">Analyzing product dimensions...</p>
            </div>
          ) : recommendation ? (
             <div className="space-y-6">
                 {/* Recommendation Badge */}
                 <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Recommended Size</span>
                    <span className="text-5xl font-black text-yellow-600 dark:text-yellow-500">{recommendation.recommendedSize}</span>
                 </div>

                 {/* Fit Details */}
                 <div className="space-y-3">
                    <h4 className="font-medium text-sm">Fit Analysis</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg leading-relaxed">
                        {recommendation.analysis}
                    </p>
                 </div>

                 {/* Confidence Score */}
                 <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3 rounded-lg text-sm">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>Confidence Score: <strong>{recommendation.confidence}%</strong>. Based on {recommendation.dataPoints} data points.</span>
                 </div>
             </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
                <p>Failed to load recommendation. Please try again.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
