"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface AIFitCheckDialogProps {
  product: any;
}

export function AIFitCheckDialog({ product }: AIFitCheckDialogProps) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });
  const [fitResult, setFitResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user && !fitResult) {
      fetchMeasurements();
    }
  }, [isOpen, session]);

  const fetchMeasurements = async () => {
    try {
      const res = await fetch("/api/users/profile/measurements");
      if (res.ok) {
        const data = await res.json();
        if (data.height || data.weight || data.bodyType) {
            setMeasurements({
                height: data.height || "",
                weight: data.weight || "",
                bodyType: data.bodyType || "",
            });
            // If we have some measurements, run the fit check
            runFitCheck({
                height: data.height || "",
                weight: data.weight || "",
                bodyType: data.bodyType || "",
            });
        }
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

  const saveMeasurements = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });

      if (res.ok) {
        toast.success("Measurements saved");
        runFitCheck(measurements);
      } else {
        toast.error("Failed to save measurements");
      }
    } catch (error) {
      console.error("Error saving measurements:", error);
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const runFitCheck = async (currentMeasurements: any) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurements: currentMeasurements,
          product: {
            name: product.name,
            brand: product.brand,
            category: product.category,
            description: product.description,
            sizes: product.sizes
          }
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFitResult(data);
      }
    } catch (error) {
      console.error("Error running fit check:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                Try AI Fit Check
                            </div>
                            <div className="text-xs text-muted-foreground">Sign in to find your perfect size</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Fit Analysis</DialogTitle>
                    <DialogDescription>
                        Please sign in to use the AI Fit Check feature and save your measurements.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
  }

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
                {fitResult ? `AI recommends size ${fitResult.recommendedSize}` : "AI Fit Check"}
              </div>
              <div className="text-xs text-muted-foreground">
                {fitResult ? `${fitResult.confidence}% confidence` : "Find your perfect size based on your profile"}
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
            Update your measurements for a personalized size recommendation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">Height (cm)</label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={measurements.height}
                onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={measurements.weight}
                onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="bodyType" className="text-sm font-medium">Body Type</label>
            <Select
              value={measurements.bodyType}
              onValueChange={(value) => setMeasurements({ ...measurements, bodyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Slim">Slim</SelectItem>
                <SelectItem value="Athletic">Athletic</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Curvy">Curvy</SelectItem>
                <SelectItem value="Broad">Broad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={saveMeasurements}
            disabled={isSaving || (!measurements.height && !measurements.weight && !measurements.bodyType)}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save & Analyze
          </Button>
        </div>

        {isLoading ? (
          <div className="h-32 rounded-lg border bg-muted/20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <p className="text-sm text-muted-foreground animate-pulse">AI is analyzing the fit...</p>
          </div>
        ) : fitResult ? (
          <div className="rounded-lg border bg-yellow-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommended Size</p>
                <p className="text-3xl font-black text-yellow-600 dark:text-yellow-500">{fitResult.recommendedSize}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-xl font-bold text-green-600">{fitResult.confidence}%</p>
              </div>
            </div>
            <div className="pt-2 border-t border-yellow-500/20">
               <p className="text-sm text-foreground">{fitResult.rationale}</p>
               <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-background">
                  Fit: {fitResult.fitPrediction}
               </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}