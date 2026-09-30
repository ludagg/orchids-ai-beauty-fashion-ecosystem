"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";

interface AIFitCheckDialogProps {
  product: any;
}

export function AIFitCheckDialog({ product }: AIFitCheckDialogProps) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [needsProfileUpdate, setNeedsProfileUpdate] = useState(false);

  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    if (isOpen && session) {
      fetchMeasurements();
    }
  }, [isOpen, session]);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile/measurements");
      if (res.ok) {
        const data = await res.json();
        if (!data.height || !data.weight) {
          setNeedsProfileUpdate(true);
        } else {
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setBodyType(data.bodyType || "");
          setNeedsProfileUpdate(false);
          await fetchRecommendation(data.height, data.weight, data.bodyType);
        }
      } else {
        setNeedsProfileUpdate(true);
      }
    } catch (e) {
      console.error(e);
      setNeedsProfileUpdate(true);
    } finally {
      setLoading(false);
    }
  };

  const saveMeasurements = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight, bodyType }),
      });
      if (res.ok) {
        setNeedsProfileUpdate(false);
        await fetchRecommendation(height, weight, bodyType);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const fetchRecommendation = async (h: string, w: string, bt: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: h,
          weight: w,
          bodyType: bt,
          product,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data.recommendation);
        setExplanation(data.explanation);
        setConfidence(data.confidence);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
       <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer opacity-50" title="Sign in to use AI Fit Check">
          <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                  <Ruler className="h-4 w-4" />
              </div>
              <div>
                  <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                      AI Fit Check
                  </div>
                  <div className="text-xs text-muted-foreground">Sign in for personalized sizing</div>
              </div>
          </div>
      </div>
    );
  }

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
                        AI Fit Check
                    </div>
                    <div className="text-xs text-muted-foreground">Find your perfect size</div>
                </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            Personalized sizing recommendations powered by AI.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <p className="text-sm text-muted-foreground">Analyzing measurements and product fit...</p>
          </div>
        ) : needsProfileUpdate ? (
          <div className="space-y-4 py-4">
             <div className="text-sm text-muted-foreground mb-4">
                Tell us a bit about yourself to get a personalized size recommendation for this item.
             </div>
             <div className="grid gap-2">
                <Label htmlFor="height">Height (e.g., 5'9" or 175cm)</Label>
                <Input
                   id="height"
                   value={height}
                   onChange={(e) => setHeight(e.target.value)}
                   placeholder="Your height"
                />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="weight">Weight (e.g., 150 lbs or 68kg)</Label>
                <Input
                   id="weight"
                   value={weight}
                   onChange={(e) => setWeight(e.target.value)}
                   placeholder="Your weight"
                />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="bodyType">Body Type (Optional)</Label>
                <Input
                   id="bodyType"
                   value={bodyType}
                   onChange={(e) => setBodyType(e.target.value)}
                   placeholder="e.g., Athletic, Slim, Curvy"
                />
             </div>
             <Button
                onClick={saveMeasurements}
                disabled={saving || !height || !weight}
                className="w-full mt-4 bg-yellow-500 text-black hover:bg-yellow-600"
             >
                {saving ? "Saving..." : "Get AI Recommendation"}
             </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
             <div className="flex flex-col items-center text-center space-y-2">
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                     <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                         {recommendation || "?"}
                     </span>
                 </div>
                 <h3 className="text-lg font-semibold">Size {recommendation} Recommended</h3>
                 <p className="text-sm text-muted-foreground px-4">
                     {explanation}
                 </p>
             </div>

             <div className="space-y-2 pt-4 border-t">
                 <div className="flex justify-between text-sm">
                     <span className="font-medium">AI Confidence Score</span>
                     <span>{confidence}%</span>
                 </div>
                 <Progress value={confidence} className="h-2" />
                 <p className="text-xs text-muted-foreground mt-1">
                     Based on comparison with your profile (Height: {height}, Weight: {weight}) and brand sizing data.
                 </p>
             </div>

             <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => setNeedsProfileUpdate(true)}>
                   Update Measurements
                </Button>
             </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
