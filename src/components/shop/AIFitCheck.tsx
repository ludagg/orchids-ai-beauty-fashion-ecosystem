"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductSize {
  name: string;
}

interface ProductDetails {
  id: string;
  brand: string;
  name: string;
  sizes: ProductSize[];
}

export function AIFitCheck({ product }: { product: ProductDetails }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });
  const [recommendation, setRecommendation] = useState<{
    size: string;
    explanation: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user && open) {
      // @ts-ignore
      setMeasurements({
        // @ts-ignore
        height: session.user.height || "",
        // @ts-ignore
        weight: session.user.weight || "",
        // @ts-ignore
        bodyType: session.user.bodyType || "",
      });
    }
  }, [session, open]);

  const handleAnalyze = async () => {
    if (!session?.user) {
      toast.error("Please login to use AI Fit Check");
      return;
    }

    if (!measurements.height || !measurements.weight) {
      toast.error("Please provide at least height and weight");
      return;
    }

    setLoading(true);
    try {
      // 1. Save measurements if they were updated
      await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });

      // 2. Request AI Analysis
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          measurements,
        }),
      });

      if (!res.ok) throw new Error("Failed to get recommendation");

      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while analyzing fit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                Check my size with AI
              </div>
              <div className="text-xs text-muted-foreground">
                Personalized fit analysis
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
            We'll analyze your measurements against {product.brand}&apos;s sizing.
          </DialogDescription>
        </DialogHeader>

        {recommendation ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md text-center">
              <h3 className="text-lg font-semibold">Recommended Size: {recommendation.size}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {recommendation.explanation}
            </p>
            <Button className="w-full" variant="outline" onClick={() => setRecommendation(null)}>
              Check another measurement
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  placeholder="e.g. 175"
                  value={measurements.height}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, height: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="e.g. 70"
                  value={measurements.weight}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, weight: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyType">Body Type (Optional)</Label>
              <Input
                id="bodyType"
                placeholder="e.g. Athletic, Slim, Curvy"
                value={measurements.bodyType}
                onChange={(e) =>
                  setMeasurements({ ...measurements, bodyType: e.target.value })
                }
              />
            </div>
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Fit"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
