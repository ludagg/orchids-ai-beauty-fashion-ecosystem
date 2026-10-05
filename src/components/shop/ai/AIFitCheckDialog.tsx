"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";

export default function AIFitCheckDialog({ product }: { product: any }) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    size: string;
    confidence: number;
    reasoning: string;
    fitType: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user && isOpen) {
      fetchMeasurements();
    }
  }, [session, isOpen]);

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
        if (data.height || data.weight || data.bodyType) {
            getAIRecommendation({
                height: data.height || "",
                weight: data.weight || "",
                bodyType: data.bodyType || "",
            });
        }
      }
    } catch (error) {
      console.error("Failed to fetch measurements", error);
    }
  };

  const saveMeasurements = async () => {
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });

      if (res.ok) {
        toast.success("Measurements saved!");
        setIsEditing(false);
        getAIRecommendation(measurements);
      } else {
        toast.error("Failed to save measurements");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getAIRecommendation = async (currentMeasurements: any) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurements: currentMeasurements,
          product,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
      }
    } catch (error) {
      console.error("Failed to get recommendation", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                {recommendation ? `AI recommends size ${recommendation.size}` : "Check your perfect fit"}
              </div>
              <div className="text-xs text-muted-foreground">Powered by Virtual Fit Intelligence</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            We analyze your body profile to recommend the best size for this item.
          </DialogDescription>
        </DialogHeader>

        {!session ? (
            <div className="py-6 text-center">
                <p className="text-muted-foreground mb-4">Please sign in to use the AI Fit Check feature and save your measurements.</p>
                <Button variant="outline" onClick={() => window.location.href = "/auth/sign-in"}>Sign In</Button>
            </div>
        ) : (
            <div className="space-y-6 py-4">
                {/* Measurements Section */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Your Profile</h4>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={measurements.height}
                                        onChange={(e) => setMeasurements({...measurements, height: e.target.value})}
                                        placeholder="175"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={measurements.weight}
                                        onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                                        placeholder="70"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bodyType">Body Type</Label>
                                <Select value={measurements.bodyType} onValueChange={(v) => setMeasurements({...measurements, bodyType: v})}>
                                    <SelectTrigger id="bodyType">
                                        <SelectValue placeholder="Select body type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="slim">Slim</SelectItem>
                                        <SelectItem value="athletic">Athletic</SelectItem>
                                        <SelectItem value="average">Average</SelectItem>
                                        <SelectItem value="curvy">Curvy</SelectItem>
                                        <SelectItem value="plus">Plus Size</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={saveMeasurements} className="w-full">
                                <Save className="mr-2 h-4 w-4" /> Save Profile
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between text-sm">
                            <div>
                                <span className="text-muted-foreground">Height:</span> {measurements.height ? `${measurements.height} cm` : "-"}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Weight:</span> {measurements.weight ? `${measurements.weight} kg` : "-"}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Type:</span> {measurements.bodyType ? <span className="capitalize">{measurements.bodyType}</span> : "-"}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recommendation Section */}
                {!isEditing && (
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Analyzing product and profile...</p>
                            </div>
                        ) : recommendation ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Recommended Size</div>
                                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{recommendation.size}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Confidence Score</span>
                                        <span>{recommendation.confidence}%</span>
                                    </div>
                                    <Progress value={recommendation.confidence} className="h-2 bg-yellow-500/20" indicatorColor="bg-yellow-500" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {recommendation.reasoning}
                                </p>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-background">
                                    Expected fit: <span className="ml-1 capitalize text-primary">{recommendation.fitType}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
                                Ensure your profile is filled out to get a personalized fit recommendation.
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
