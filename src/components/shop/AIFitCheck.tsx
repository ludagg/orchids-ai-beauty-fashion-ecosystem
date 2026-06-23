"use client";

import { useState, useEffect } from 'react';
import { Ruler, ChevronRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

export function AIFitCheck({ product }: { product: any }) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user || !product?.id) return;

        let isMounted = true;
        const fetchFit = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/ai-fit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id })
                });

                const data = await res.json();

                if (!res.ok) {
                    if (isMounted) setError(data.message || data.error || "Failed to fetch recommendation");
                    return;
                }

                if (isMounted) setRecommendation(data);
            } catch (err) {
                console.error(err);
                if (isMounted) setError("Network error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchFit();
        return () => { isMounted = false; };
    }, [session, product?.id]);

    if (!session?.user) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 opacity-70">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                            Analyzing fit...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="flex items-center justify-between rounded-lg border border-muted bg-muted/20 p-3 cursor-pointer">
                 <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground text-white">
                        <Ruler className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">
                            {error === "Profile incomplete" ? "Add measurements for Fit Check" : "AI Fit Check Unavailable"}
                        </div>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
         );
    }

    if (!recommendation) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                AI recommends size {recommendation.recommendedSize} for you
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {recommendation.confidence}% match • {recommendation.fitDetails || "Standard Fit"}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Fit Analysis</DialogTitle>
                    <DialogDescription>
                        Based on your profile measurements and the product details.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
                         <div className="text-center space-y-2">
                             <div className="text-4xl font-black text-yellow-600 dark:text-yellow-500">
                                {recommendation.recommendedSize}
                             </div>
                             <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                Best Fit
                             </div>
                         </div>
                    </div>

                    <div className="text-sm text-muted-foreground leading-relaxed">
                        {recommendation.explanation}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Fit Type</div>
                            <div className="text-sm font-medium">{recommendation.fitDetails || "Standard"}</div>
                        </div>
                        <div>
                             <div className="text-xs text-muted-foreground mb-1">Confidence Score</div>
                             <div className="text-sm font-medium">{recommendation.confidence}%</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
