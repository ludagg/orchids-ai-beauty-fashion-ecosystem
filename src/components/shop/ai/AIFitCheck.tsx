"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });

  // Pre-fill from session if available
  useEffect(() => {
    if (session?.user) {
      setMeasurements({
        height: (session.user as any).height || "",
        weight: (session.user as any).weight || "",
        bodyType: (session.user as any).bodyType || "",
      });
      if (!(session.user as any).height || !(session.user as any).weight) {
          setIsEditingProfile(true);
      }
    }
  }, [session]);

  const handleUpdateMeasurements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });

      if (!res.ok) throw new Error("Failed to update measurements");

      toast.success("Measurements updated!");
      setIsEditingProfile(false);
      // Automatically trigger analysis if not editing anymore
      await handleAnalyzeFit();
    } catch (error) {
      toast.error("Could not update measurements");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeFit = async () => {
    if (!session?.user) {
        toast.error("Please login to use AI Fit Check");
        return;
    }

    // Check if measurements are reasonably filled out
    if (!measurements.height || !measurements.weight) {
        setIsEditingProfile(true);
        return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productData: {
              name: product.name,
              brand: product.brand,
              description: product.description,
              sizes: product.sizes
          },
          measurements
        }),
      });

      if (!res.ok) throw new Error("Failed to get fit recommendation");

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast.error("AI Analysis failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger analysis when dialog opens if we have measurements
  useEffect(() => {
      if (open && !result && !isEditingProfile && measurements.height && measurements.weight) {
          handleAnalyzeFit();
      }
  }, [open]);

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
                AI Fit Check
              </div>
              <div className="text-xs text-muted-foreground">
                Find your perfect size
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            We analyze your measurements against brand sizing data to find your perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="text-sm font-medium">Please enter your measurements to get started:</div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    placeholder="e.g. 175"
                    value={measurements.height}
                    onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    placeholder="e.g. 70"
                    value={measurements.weight}
                    onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bodyType">Body Type (Optional)</Label>
                  <Input
                    id="bodyType"
                    placeholder="e.g. Athletic, Slim, Curvy"
                    value={measurements.bodyType}
                    onChange={(e) => setMeasurements({ ...measurements, bodyType: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleUpdateMeasurements} className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Analyze
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              <p className="text-sm text-muted-foreground animate-pulse">AI is analyzing sizing data...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                 <div className="text-sm text-muted-foreground mb-1">Recommended Size</div>
                 <div className="text-5xl font-black text-yellow-600 dark:text-yellow-400">
                    {result.recommendedSize}
                 </div>
                 {result.confidenceScore && (
                     <div className="mt-2 text-xs font-medium text-yellow-700/70 bg-yellow-500/20 px-2 py-1 rounded-full">
                        {result.confidenceScore}% Match
                     </div>
                 )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fit Analysis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.analysis}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                 <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                    Update Measurements
                 </Button>
              </div>
            </div>
          ) : (
             <div className="flex justify-center">
                 <Button onClick={handleAnalyzeFit}>Analyze Fit</Button>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
