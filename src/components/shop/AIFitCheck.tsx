"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Check, AlertCircle, Loader2 } from "lucide-react";
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

interface AIFitCheckProps {
  product: {
    id: string;
    name: string;
    brand: string;
    sizes?: any[];
  };
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [bodyType, setBodyType] = useState(user?.bodyType || "");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    recommendedSize: string;
    confidenceScore: number;
    explanation: string;
  } | null>(null);

  // Sync state if user data loads later
  useEffect(() => {
    if (user && !height && !weight) {
      if (user.height) setHeight(user.height);
      if (user.weight) setWeight(user.weight);
      if (user.bodyType) setBodyType(user.bodyType);
    }
  }, [user]);

  const handleAnalyze = async () => {
    if (!height || !weight || !bodyType) {
      toast.error("Please fill in all measurements");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. Optionally save measurements to profile if logged in
      if (user) {
        await fetch("/api/users/profile/measurements", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ height, weight, bodyType }),
        });
      }

      // 2. Fetch AI recommendation
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height,
          weight,
          bodyType,
          brand: product.brand,
          productName: product.name,
          availableSizes: product.sizes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get recommendation");
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
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
                AI Fit Check
              </div>
              <div className="text-xs text-muted-foreground">
                Find your perfect size instantly
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-yellow-500" />
            AI Virtual Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            Enter your measurements to get a personalized size recommendation for this item.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  placeholder="e.g., 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="e.g., 70"
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
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="curvy">Curvy</SelectItem>
                  <SelectItem value="broad">Broad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4 bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing fit...
                </>
              ) : (
                "Get Size Recommendation"
              )}
            </Button>
          </div>
        ) : (
          <div className="py-6 space-y-6 flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-4 border-yellow-500 relative">
                <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                    {result.recommendedSize}
                </span>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {result.confidenceScore}% Match
                </div>
             </div>

             <div className="space-y-2">
                 <h3 className="text-lg font-semibold">Perfect Fit Found!</h3>
                 <p className="text-sm text-muted-foreground">
                    {result.explanation}
                 </p>
             </div>

             <div className="flex gap-3 w-full">
                <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                    Edit Measurements
                </Button>
                <Button className="w-full bg-primary" onClick={() => setIsOpen(false)}>
                    Done
                </Button>
             </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
