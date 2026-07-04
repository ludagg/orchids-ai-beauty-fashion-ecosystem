"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ size: string; explanation: string; confidence: number } | null>(null);

  // User measurements state
  const [height, setHeight] = useState(session?.user?.height || "");
  const [weight, setWeight] = useState(session?.user?.weight || "");
  const [bodyType, setBodyType] = useState(session?.user?.bodyType || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [hasMeasurements, setHasMeasurements] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.height) setHeight(session.user.height);
      if (session.user.weight) setWeight(session.user.weight);
      if (session.user.bodyType) setBodyType(session.user.bodyType);

      if (session.user.height || session.user.weight) {
        setHasMeasurements(true);
      }
    }
  }, [session?.user]);

  const fetchRecommendation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI recommendation");
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze fit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateMeasurements = async () => {
    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight, bodyType }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated!");
      setHasMeasurements(true);
      fetchRecommendation(); // Refetch with new measurements
    } catch (error) {
      console.error(error);
      toast.error("Failed to update measurements.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !result && session?.user && (session.user.height || session.user.weight)) {
      fetchRecommendation();
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer" onClick={() => toast.error("Please login to use AI Fit Check")}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              AI Fit Check Available
            </div>
            <div className="text-xs text-muted-foreground">Log in to find your perfect size</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                {result ? `AI recommends size ${result.size}` : "Check your perfect size"}
              </div>
              <div className="text-xs text-muted-foreground">AI Fit Intelligence</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            Get a personalized size recommendation based on your profile and this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {(!hasMeasurements && !result) || isUpdatingProfile ? (
            <div className="space-y-4">
              <div className="text-sm font-medium">Please enter your details for a better fit:</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Height (cm)</label>
                  <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Weight (kg)</label>
                  <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Body Type</label>
                <Select value={bodyType} onValueChange={setBodyType}>
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
              <Button onClick={updateMeasurements} disabled={isUpdatingProfile} className="w-full">
                {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save & Analyze
              </Button>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                  <p className="text-sm text-muted-foreground">Analyzing product fit...</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="text-sm text-muted-foreground mb-1">Recommended Size</div>
                    <div className="text-5xl font-bold text-yellow-600 mb-2">{result.size}</div>
                    <div className="text-xs font-medium bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                      {result.confidence}% Match
                    </div>
                  </div>
                  <p className="text-sm text-center text-muted-foreground leading-relaxed">
                    {result.explanation}
                  </p>
                  <div className="flex justify-center pt-2">
                     <Button variant="outline" size="sm" onClick={() => setIsUpdatingProfile(true)}>
                       Update Measurements
                     </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={fetchRecommendation} className="w-full">
                   Analyze Fit Now
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
