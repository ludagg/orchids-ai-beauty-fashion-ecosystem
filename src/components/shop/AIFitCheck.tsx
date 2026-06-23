"use client";

import { useState } from 'react';
import { Ruler, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AIFitCheckProps {
  productId: string;
}

interface FitResponse {
  size: string;
  explanation: string;
}

export function AIFitCheck({ productId }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fitData, setFitData] = useState<FitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFitRecommendation = async () => {
    if (!session?.user) {
      toast.error("Please log in to use AI Fit Check.");
      return;
    }

    if (fitData) {
        // Already fetched
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch fit recommendation');
      }

      setFitData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
            fetchFitRecommendation();
        }
    }}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                AI Fit Check Available
              </div>
              <div className="text-xs text-muted-foreground">Find your perfect size</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-yellow-500" />
            AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
            Personalized sizing recommendations based on your profile measurements.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {!session?.user ? (
            <div className="text-center p-6 bg-muted rounded-md">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">You need to be logged in to use this feature.</p>
                <Button variant="outline" onClick={() => window.location.href = '/login'}>Log In</Button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
                <div className="flex items-center justify-center p-6">
                     <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/50">
               <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
               <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
               <Button variant="outline" onClick={fetchFitRecommendation}>Try Again</Button>
            </div>
          ) : fitData ? (
             <div className="space-y-6">
                 <div className="flex flex-col items-center justify-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                     <span className="text-sm text-muted-foreground mb-1">Recommended Size</span>
                     <span className="text-5xl font-bold text-yellow-600 dark:text-yellow-400">{fitData.size}</span>
                 </div>
                 <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-foreground/90 leading-relaxed text-center">
                        {fitData.explanation}
                    </p>
                 </div>
             </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
