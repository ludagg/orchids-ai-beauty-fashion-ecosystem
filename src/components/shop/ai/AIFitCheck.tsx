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
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AIFitCheckProps {
  product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile state
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");

  // Result state
  const [recommendation, setRecommendation] = useState<{ size: string | null; confidence: number } | null>(null);

  // Initialize from session if available
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      if (user.height) setHeight(user.height);
      if (user.weight) setWeight(user.weight);
      if (user.bodyType) setBodyType(user.bodyType);
    }
  }, [session]);

  const calculateFit = async () => {
    if (!height || !weight || !bodyType) {
        toast.error("Please fill in all measurements");
        return;
    }

    setLoading(true);
    setRecommendation(null);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height,
          weight,
          bodyType,
          product,
        }),
      });

      if (!res.ok) throw new Error("Failed to calculate fit");
      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze fit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
     if (!session?.user) {
         toast.error("Please login to save your profile");
         return;
     }

     setSaving(true);
     try {
        const res = await fetch("/api/users/profile/measurements", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ height, weight, bodyType })
        });

        if (!res.ok) throw new Error("Failed to save");
        toast.success("Profile updated");
     } catch(e) {
         console.error(e);
         toast.error("Failed to save profile");
     } finally {
         setSaving(false);
     }
  };

  const handleAnalyze = async () => {
      await calculateFit();
  };

  // Determine what to show on the trigger button
  const triggerText = recommendation?.size
    ? `AI recommends size ${recommendation.size} for you`
    : "Check your perfect size with AI";

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
                {triggerText}
              </div>
              <div className="text-xs text-muted-foreground">
                {recommendation ? `${recommendation.confidence}% confidence based on your profile` : "Personalized fit analysis"}
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
            Enter your measurements to get a personalized size recommendation for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                        id="height"
                        type="number"
                        placeholder="e.g. 175"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        placeholder="e.g. 70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="slim">Slim</SelectItem>
                        <SelectItem value="athletic">Athletic</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="curvy">Curvy</SelectItem>
                        <SelectItem value="plus_size">Plus Size</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {session?.user && (
                <div className="flex justify-end">
                     <Button variant="ghost" size="sm" onClick={saveProfile} disabled={saving} className="h-8">
                         {saving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                         Save to profile
                     </Button>
                </div>
            )}

            <Button
                onClick={handleAnalyze}
                disabled={loading || !height || !weight || !bodyType}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-2"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ruler className="h-4 w-4 mr-2" />}
                Analyze Fit
            </Button>

            {recommendation && recommendation.size && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border text-center space-y-2 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-sm text-muted-foreground">Recommended Size</div>
                    <div className="text-4xl font-bold text-primary">{recommendation.size}</div>
                    <div className="text-xs text-muted-foreground">Confidence: {recommendation.confidence}%</div>
                </div>
            )}

            {recommendation && !recommendation.size && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center text-sm">
                    Could not determine a recommended size.
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
