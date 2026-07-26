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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingMeasurements, setSavingMeasurements] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });

  useEffect(() => {
    if (session?.user) {
      setMeasurements({
        height: (session.user as any).height || "",
        weight: (session.user as any).weight || "",
        bodyType: (session.user as any).bodyType || "",
      });
    }
  }, [session]);

  const hasMeasurements = measurements.height && measurements.weight && measurements.bodyType;

  // Fetch recommendation automatically if opened and has measurements
  useEffect(() => {
    if (isOpen && hasMeasurements && !recommendation && !loading) {
      fetchRecommendation();
    }
  }, [isOpen]);

  const saveMeasurements = async () => {
    setSavingMeasurements(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });

      if (!res.ok) throw new Error("Failed to save measurements");
      toast.success("Measurements saved!");

      // Fetch new recommendation based on new measurements
      await fetchRecommendation();

    } catch (error) {
      console.error(error);
      toast.error("Could not save measurements");
    } finally {
      setSavingMeasurements(false);
    }
  };

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productData: product,
          measurements: hasMeasurements ? measurements : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to get recommendation");
      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      console.error(error);
      toast.error("AI Fit Check failed to analyze this product.");
    } finally {
      setLoading(false);
    }
  };

  if (!product.sizes || product.sizes.length === 0) {
    return null; // Don't show if product has no sizes
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
                {recommendation?.recommendedSize ? `AI recommends size ${recommendation.recommendedSize}` : "AI Fit Check"}
              </div>
              <div className="text-xs text-muted-foreground">
                 {recommendation ? "Based on your profile" : "Find your perfect size"}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <Ruler className="h-5 w-5 text-yellow-500" />
             AI Virtual Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            Get personalized sizing recommendations based on your unique body profile and the specific fit of this brand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* Profile Measurements Form */}
          <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
            <h4 className="text-sm font-medium">Your Body Profile</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g. 175"
                  value={measurements.height}
                  onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g. 70"
                  value={measurements.weight}
                  onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Body Type</Label>
                <Select
                  value={measurements.bodyType}
                  onValueChange={(value) => setMeasurements({ ...measurements, bodyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slim">Slim</SelectItem>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="curvy">Curvy</SelectItem>
                    <SelectItem value="broad">Broad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
                variant="secondary"
                size="sm"
                className="w-full mt-2"
                onClick={saveMeasurements}
                disabled={savingMeasurements || !measurements.height || !measurements.weight || !measurements.bodyType}
            >
                {savingMeasurements ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save & Analyze Fit
            </Button>
          </div>

          {/* AI Recommendation Result */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground">
                 <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                 <p className="text-sm">Analyzing product data and your profile...</p>
             </div>
          ) : recommendation ? (
             <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-center">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Recommended Size</p>
                    <div className="text-4xl font-black text-yellow-600 dark:text-yellow-500 mb-2">
                        {recommendation.recommendedSize || "?"}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className="capitalize">{recommendation.fitPrediction} Fit</Badge>
                        {recommendation.confidence === 'high' && <Badge className="bg-green-500">High Confidence</Badge>}
                    </div>
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    <span className="font-semibold text-foreground block mb-1">AI Analysis:</span>
                    {recommendation.explanation}
                </div>
             </div>
          ) : (
             <div className="text-center py-6 text-sm text-muted-foreground">
                 Please fill out your body profile to see the fit recommendation.
             </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}