"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ruler, ChevronRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  const [isOpen, setIsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });

  const [recommendation, setRecommendation] = useState<{
    size: string;
    analysis: string;
    confidence: number;
    fitType: "tight" | "regular" | "loose";
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setMeasurements({
        height: user.height || "",
        weight: user.weight || "",
        bodyType: user.bodyType || "",
      });

      // If user is opening the dialog and they have measurements, don't show edit form initially
      if (user.height && user.weight && user.bodyType) {
        setIsEditingProfile(false);
      } else {
        setIsEditingProfile(true);
      }
    }
  }, [user]);

  // Run analysis when modal opens IF we have measurements and haven't analyzed yet
  useEffect(() => {
    if (isOpen && !isEditingProfile && !recommendation && user?.height && user?.weight && user?.bodyType) {
      runAnalysis();
    }
  }, [isOpen, isEditingProfile]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });

      if (!res.ok) throw new Error("Failed to save measurements");

      setIsEditingProfile(false);
      runAnalysis();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const runAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Merge current local state if not saved yet, but we usually want saved state
      const payload = {
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.mainCategory || product.category,
        },
        userMeasurements: measurements,
      };

      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to analyze fit");

      const data = await res.json();
      setRecommendation(data.recommendation);
    } catch (err: any) {
      setError(err.message || "Could not complete analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // If no session, we can either hide it or show a login prompt. We'll show a prompt in the dialog.
  if (!session) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
           <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer">
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>AI Fit Analysis</DialogTitle>
                <DialogDescription>
                    Please log in to use our AI Fit Check intelligence.
                </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
               <Button onClick={() => window.location.href = '/login'}>Log In</Button>
            </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer transition-colors hover:bg-yellow-500/20">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                    {recommendation ? <Sparkles className="h-4 w-4" /> : <Ruler className="h-4 w-4" />}
                </div>
                <div>
                    <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                        {recommendation ? `AI recommends size ${recommendation.size} for you` : "AI Fit Check"}
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
             <Sparkles className="h-5 w-5 text-yellow-500" />
             AI Fit Intelligence
          </DialogTitle>
          <DialogDescription>
             We analyze your body type and the brand's sizing to find your perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md mb-4 text-sm text-muted-foreground">
                 Please provide your measurements to enable personalized size recommendations.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={measurements.height}
                    onChange={(e) => setMeasurements(m => ({...m, height: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={measurements.weight}
                    onChange={(e) => setMeasurements(m => ({...m, weight: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select
                  value={measurements.bodyType}
                  onValueChange={(val) => setMeasurements(m => ({...m, bodyType: val}))}
                >
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

              {error && (
                <div className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <div className="flex justify-end pt-4 gap-2">
                {user?.height && (
                   <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                )}
                <Button
                  onClick={handleSaveProfile}
                  disabled={!measurements.height || !measurements.weight || !measurements.bodyType || isSaving}
                  className="bg-yellow-500 text-black hover:bg-yellow-600"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save & Analyze
                </Button>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-yellow-500 animate-pulse" />
               </div>
               <p className="text-sm font-medium text-muted-foreground animate-pulse">
                  Analyzing fit for {product.brand || "this item"}...
               </p>
            </div>
          ) : recommendation ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-2 py-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                 <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Recommended Size</div>
                 <div className="text-5xl font-black text-foreground">{recommendation.size}</div>
                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border">
                    <div className="flex items-center gap-1">
                       <div className={cn("h-2 w-2 rounded-full", recommendation.confidence > 85 ? "bg-green-500" : "bg-yellow-500")}></div>
                       {recommendation.confidence}% match
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-sm font-semibold">Fit Details</h4>
                 <div className="grid grid-cols-3 gap-2">
                    {["tight", "regular", "loose"].map((fit) => (
                       <div
                         key={fit}
                         className={cn(
                           "flex flex-col items-center justify-center p-2 rounded-md border text-xs capitalize transition-colors",
                           recommendation.fitType === fit
                             ? "bg-primary text-primary-foreground border-primary"
                             : "bg-muted text-muted-foreground"
                         )}
                       >
                         {fit}
                       </div>
                    ))}
                 </div>
                 <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                   {recommendation.analysis}
                 </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                 <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(true)} className="text-xs text-muted-foreground">
                    Update Measurements
                 </Button>
                 <Button className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={() => setIsOpen(false)}>
                    Got it
                 </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
               <p className="text-sm text-muted-foreground mb-4">Something went wrong.</p>
               <Button onClick={() => setIsEditingProfile(true)}>Check Profile</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
