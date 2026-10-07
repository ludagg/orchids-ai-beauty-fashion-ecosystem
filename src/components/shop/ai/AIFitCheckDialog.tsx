"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Sparkles, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckDialogProps {
  product: any;
}

export function AIFitCheckDialog({ product }: AIFitCheckDialogProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [measurements, setMeasurements] = useState({ height: "", weight: "", bodyType: "" });
  const [fitResult, setFitResult] = useState<any>(null);
  const [hasFetchedMeasurements, setHasFetchedMeasurements] = useState(false);

  useEffect(() => {
      if (isOpen && session && !hasFetchedMeasurements) {
          fetchMeasurements();
      }
  }, [isOpen, session, hasFetchedMeasurements]);

  const fetchMeasurements = async () => {
      try {
          const res = await fetch("/api/users/profile/measurements");
          if (res.ok) {
              const data = await res.json();
              setMeasurements({
                  height: data.height || "",
                  weight: data.weight || "",
                  bodyType: data.bodyType || "",
              });
              setHasFetchedMeasurements(true);

              // If we already have data, auto-run the fit check
              if (data.height && data.weight) {
                  runFitCheck(data);
              }
          }
      } catch (error) {
          console.error("Error fetching measurements:", error);
      }
  };

  const saveMeasurements = async () => {
      if (!session) {
          toast.error("Please log in to save measurements");
          return;
      }

      setSaving(true);
      try {
          const res = await fetch("/api/users/profile/measurements", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(measurements)
          });
          if (res.ok) {
              toast.success("Measurements saved!");
              runFitCheck(measurements);
          } else {
              toast.error("Failed to save measurements");
          }
      } catch (error) {
          toast.error("An error occurred while saving.");
      } finally {
          setSaving(false);
      }
  };

  const runFitCheck = async (dataToUse = measurements) => {
      if (!dataToUse.height || !dataToUse.weight) return;

      setLoading(true);
      try {
          const res = await fetch("/api/ai-fit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  ...dataToUse,
                  productBrand: product?.brand,
                  productName: product?.name,
                  productCategory: product?.category
              })
          });

          if (res.ok) {
              const data = await res.json();
              setFitResult(data);
          }
      } catch (error) {
          console.error("Fit check failed", error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
                    <Sparkles className="h-4 w-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                        {fitResult?.recommendation ? `AI recommends size ${fitResult.recommendation}` : "Try AI Fit Check"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                         {fitResult ? "Based on your measurements" : "Find your perfect size instantly"}
                    </div>
                </div>
            </div>
            <Ruler className="h-4 w-4 text-yellow-600/70" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              AI Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            We analyze your measurements and this brand's sizing to recommend the perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            {/* Measurements Form */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="height">Height (e.g. 5'8" or 170cm)</Label>
                    <Input
                        id="height"
                        placeholder="175cm"
                        value={measurements.height}
                        onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (e.g. 150lbs or 68kg)</Label>
                    <Input
                        id="weight"
                        placeholder="70kg"
                        value={measurements.weight}
                        onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                    />
                </div>
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="bodyType">Body Type (Optional)</Label>
                    <Input
                        id="bodyType"
                        placeholder="Athletic, Curvy, Slim..."
                        value={measurements.bodyType}
                        onChange={(e) => setMeasurements({ ...measurements, bodyType: e.target.value })}
                    />
                </div>
            </div>

            <Button
                className="w-full"
                onClick={saveMeasurements}
                disabled={saving || !measurements.height || !measurements.weight}
            >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Saving..." : fitResult ? "Update Measurements" : "Analyze Fit"}
            </Button>

            {/* Results Section */}
            {loading && (
                 <div className="flex flex-col items-center justify-center py-6 space-y-4">
                     <div className="relative">
                         <div className="absolute inset-0 rounded-full blur-xl bg-yellow-500/20 animate-pulse"></div>
                         <Loader2 className="h-10 w-10 text-yellow-500 animate-spin relative z-10" />
                     </div>
                     <p className="text-sm text-muted-foreground animate-pulse">AI is calculating your perfect fit...</p>
                 </div>
            )}

            {!loading && fitResult && (
                <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                             <h4 className="font-semibold text-lg">Recommended Size</h4>
                             <p className="text-sm text-muted-foreground">Confidence: {fitResult.confidence}%</p>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold shadow-md">
                            {fitResult.recommendation}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm leading-relaxed text-card-foreground/90">
                            "{fitResult.reasoning}"
                        </p>
                    </div>

                    <div className="pt-2">
                         <p className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider">Estimated Fit</p>
                         <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                             <div className="bg-blue-400 h-full" style={{ width: `${fitResult.chart?.tight || 0}%` }} title="Tight"></div>
                             <div className="bg-emerald-500 h-full" style={{ width: `${fitResult.chart?.regular || 100}%` }} title="Regular"></div>
                             <div className="bg-yellow-400 h-full" style={{ width: `${fitResult.chart?.loose || 0}%` }} title="Loose"></div>
                         </div>
                         <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                             <span>Tight</span>
                             <span>Regular</span>
                             <span>Loose</span>
                         </div>
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
