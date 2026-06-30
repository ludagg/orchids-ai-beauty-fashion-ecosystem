"use client";

import { useState, useEffect } from 'react';
import { Ruler, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ size: string, reason: string } | null>(null);

  // Profile form state
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyType, setBodyType] = useState('Athletic');
  const [needsProfileUpdate, setNeedsProfileUpdate] = useState(false);

  useEffect(() => {
      if (session?.user) {
          const u = session.user as any;
          if (u.height) setHeight(u.height);
          if (u.weight) setWeight(u.weight);
          if (u.bodyType) setBodyType(u.bodyType);

          if (!u.height || !u.weight || !u.bodyType) {
              setNeedsProfileUpdate(true);
          } else {
              setNeedsProfileUpdate(false);
          }
      }
  }, [session]);

  const handleFetchRecommendation = async () => {
    if (!session?.user) {
        toast.error("Please log in to use AI Fit Check");
        return;
    }

    if (needsProfileUpdate && (!height || !weight || !bodyType)) {
        toast.error("Please fill in your measurements first");
        return;
    }

    setLoading(true);
    setResult(null);
    try {
        // Save profile if needed
        if (needsProfileUpdate) {
             const patchRes = await fetch('/api/users/profile/measurements', {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ height, weight, bodyType })
             });
             if (!patchRes.ok) throw new Error("Failed to update profile");
             setNeedsProfileUpdate(false);
        }

        // Fetch AI recommendation
        const res = await fetch('/api/ai-fit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: product.id,
                height,
                weight,
                bodyType
            })
        });

        if (!res.ok) throw new Error("Failed to get recommendation");

        const data = await res.json();
        setResult({ size: data.recommendedSize, reason: data.recommendation });

    } catch (err) {
        console.error(err);
        toast.error("Could not analyze fit at this time.");
    } finally {
        setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (open && !needsProfileUpdate && !result && session?.user) {
          handleFetchRecommendation();
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
            <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                        <Ruler className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                            {result ? `AI recommends size ${result.size}` : "AI Fit Check"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {result ? "Based on your measurements" : "Find your perfect size"}
                        </div>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-yellow-500" />
                    AI Fit Intelligence
                </DialogTitle>
                <DialogDescription>
                    Get a personalized size recommendation based on your body profile and this brand's fit.
                </DialogDescription>
            </DialogHeader>

            {!session?.user ? (
                 <div className="py-6 text-center text-sm text-muted-foreground">
                     Please sign in to use this feature.
                 </div>
            ) : needsProfileUpdate ? (
                <div className="space-y-4 py-4">
                     <p className="text-sm font-medium">Complete your fit profile:</p>
                     <div className="space-y-2">
                         <label className="text-xs">Height (cm)</label>
                         <input
                             type="number"
                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                             value={height}
                             onChange={(e) => setHeight(e.target.value)}
                             placeholder="e.g. 175"
                         />
                     </div>
                     <div className="space-y-2">
                         <label className="text-xs">Weight (kg)</label>
                         <input
                             type="number"
                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                             value={weight}
                             onChange={(e) => setWeight(e.target.value)}
                             placeholder="e.g. 70"
                         />
                     </div>
                     <div className="space-y-2">
                         <label className="text-xs">Body Type</label>
                         <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={bodyType}
                            onChange={(e) => setBodyType(e.target.value)}
                         >
                             <option value="Slim">Slim</option>
                             <option value="Athletic">Athletic</option>
                             <option value="Average">Average</option>
                             <option value="Curvy">Curvy</option>
                             <option value="Broad">Broad</option>
                         </select>
                     </div>
                     <Button className="w-full mt-2" onClick={handleFetchRecommendation} disabled={loading || !height || !weight}>
                         {loading ? "Analyzing..." : "Save & Analyze"}
                     </Button>
                </div>
            ) : (
                <div className="py-6 space-y-6">
                    {loading ? (
                         <div className="flex flex-col items-center justify-center space-y-4 py-8">
                             <div className="h-12 w-12 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin" />
                             <p className="text-sm text-muted-foreground animate-pulse">Analyzing product dimensions & your profile...</p>
                         </div>
                    ) : result ? (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border border-yellow-500/20">
                                <span className="text-sm text-muted-foreground mb-1">Recommended Size</span>
                                <span className="text-5xl font-bold text-yellow-600">{result.size}</span>
                            </div>
                            <div className="flex items-start gap-3 bg-yellow-500/10 p-4 rounded-lg">
                                <Check className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-yellow-800 leading-relaxed">
                                    {result.reason}
                                </p>
                            </div>
                            <div className="pt-4 text-center">
                                <Button variant="outline" size="sm" onClick={() => setNeedsProfileUpdate(true)}>
                                    Update My Measurements
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Button onClick={handleFetchRecommendation}>Analyze Fit Now</Button>
                        </div>
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
  );
}
