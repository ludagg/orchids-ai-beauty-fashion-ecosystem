"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface AIFitCheckProps {
  productId: string;
}

export function AIFitCheck({ productId }: AIFitCheckProps) {
  const { data: session, update: updateSession } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fitResult, setFitResult] = useState<any>(null);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");

  useEffect(() => {
    if (session?.user) {
      setHeight((session.user as any).height || "");
      setWeight((session.user as any).weight || "");
      setBodyType((session.user as any).bodyType || "");
    }
  }, [session]);

  const handleFetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to fetch recommendation");
      const data = await res.json();
      setFitResult(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load AI recommendation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && session?.user && (session.user as any).height && !fitResult && !loading) {
      handleFetchRecommendation();
    }
  }, [isOpen, session]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight, bodyType }),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      await updateSession();
      toast.success("Profile updated!");
      handleFetchRecommendation();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer opacity-70">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              AI Fit Check
            </div>
            <div className="text-xs text-muted-foreground">Sign in to get size recommendations</div>
          </div>
        </div>
      </div>
    );
  }

  const hasMeasurements = !!((session.user as any).height && (session.user as any).weight);

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
              <div className="text-xs text-muted-foreground opacity-80">
                {hasMeasurements ? "Based on your measurements" : "Add measurements for a recommendation"}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400 opacity-70" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <Ruler className="w-5 h-5 text-yellow-500" />
             AI Fit Analysis
          </DialogTitle>
          <DialogDescription>
             Personalized sizing intelligence based on your unique profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {!hasMeasurements ? (
             <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-lg text-sm">
                    Please provide your measurements to get an accurate size recommendation.
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Height (cm)</label>
                        <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="e.g. 175"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
                        <input
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="e.g. 68"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">Body Type (Optional)</label>
                        <select
                            value={bodyType}
                            onChange={(e) => setBodyType(e.target.value)}
                            className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">Select...</option>
                            <option value="slim">Slim</option>
                            <option value="athletic">Athletic</option>
                            <option value="average">Average</option>
                            <option value="curvy">Curvy</option>
                            <option value="plus">Plus Size</option>
                        </select>
                    </div>
                    <Button className="w-full mt-2" onClick={handleSaveProfile} disabled={saving || !height || !weight}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Analyze"}
                    </Button>
                </div>
             </div>
          ) : (
             <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                        <p className="text-sm text-muted-foreground">Analyzing measurements against product specs...</p>
                    </div>
                ) : fitResult ? (
                    <div className="space-y-4">
                         <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-yellow-50 to-background dark:from-yellow-900/10 border rounded-lg text-center">
                             <span className="text-sm text-muted-foreground mb-1">Recommended Size</span>
                             <span className="text-5xl font-black text-yellow-500">{fitResult.recommendedSize}</span>
                             <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                                 Confidence: {fitResult.confidence}%
                             </div>
                         </div>

                         <div className="space-y-2 text-sm">
                             <h4 className="font-semibold">Fit Details</h4>
                             <p className="text-muted-foreground bg-muted p-3 rounded-md leading-relaxed">
                                 {fitResult.reasoning}
                             </p>
                         </div>

                         <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                            Based on your profile: {height}cm, {weight}kg{bodyType ? `, ${bodyType} build` : ''}.
                            <Button variant="link" className="px-1 py-0 h-auto text-xs" onClick={() => {
                                setHeight(""); setWeight(""); // trigger edit mode
                            }}>Edit</Button>
                         </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        Could not generate a recommendation.
                    </div>
                )}
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
