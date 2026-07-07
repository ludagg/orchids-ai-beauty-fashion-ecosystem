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
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
  product: {
    name: string;
    description?: string;
    category?: string;
  };
}

export function AIFitCheck({ product }: AIFitCheckProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fitResult, setFitResult] = useState<{ size: string; reason: string } | null>(null);

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        height: (session.user as any).height || "",
        weight: (session.user as any).weight || "",
        bodyType: (session.user as any).bodyType || "",
      });
    }
  }, [session]);

  useEffect(() => {
    if (isOpen && session?.user && formData.height && formData.weight && formData.bodyType && !fitResult && !isAnalyzing) {
        handleAnalyzeFit();
    }
  }, [isOpen]);

  const handleUpdateMeasurements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please login to save measurements");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update measurements");

      toast.success("Measurements saved!");

      // Immediately trigger analysis after saving
      handleAnalyzeFit();
    } catch (error) {
      toast.error("Failed to save measurements");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAnalyzeFit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: formData.height,
          weight: formData.weight,
          bodyType: formData.bodyType,
          productName: product.name,
          productDescription: product.description,
          productCategory: product.category,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze fit");

      const data = await res.json();
      setFitResult(data);
    } catch (error) {
      toast.error("Failed to analyze fit. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasMeasurements = Boolean(formData.height && formData.weight && formData.bodyType);

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
                {hasMeasurements && fitResult ? `AI recommends size ${fitResult.size} for you` : "AI Fit Check"}
              </div>
              <div className="text-xs text-muted-foreground">
                {hasMeasurements && fitResult ? "Based on your profile" : "Find your perfect size"}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <Ruler className="h-5 w-5 text-yellow-500" />
             Virtual Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            Get personalized size recommendations based on your body measurements.
          </DialogDescription>
        </DialogHeader>

        {!session?.user ? (
            <div className="py-6 text-center space-y-4">
                <p className="text-muted-foreground">Please log in to use the AI Fit Check feature and save your measurements.</p>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/auth/sign-in"}>
                    Log In to Continue
                </Button>
            </div>
        ) : !hasMeasurements || (!fitResult && !isAnalyzing) ? (
            <form onSubmit={handleUpdateMeasurements} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="height">Height (e.g., 175cm, 5'9")</Label>
                    <Input
                        id="height"
                        value={formData.height}
                        onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        placeholder="Enter your height"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (e.g., 70kg, 154lbs)</Label>
                    <Input
                        id="weight"
                        value={formData.weight}
                        onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="Enter your weight"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type (e.g., Slim, Athletic, Average)</Label>
                    <Input
                        id="bodyType"
                        value={formData.bodyType}
                        onChange={e => setFormData(prev => ({ ...prev, bodyType: e.target.value }))}
                        placeholder="Enter your body type"
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-600" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save & Analyze Fit
                </Button>
            </form>
        ) : isAnalyzing ? (
             <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                     <Ruler className="h-8 w-8 text-yellow-600 relative z-10" />
                </div>
                <p className="text-sm font-medium animate-pulse">AI is analyzing your fit...</p>
             </div>
        ) : fitResult ? (
            <div className="py-6 space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/20 text-center space-y-3">
                    <div className="text-sm text-yellow-800 dark:text-yellow-300 font-medium uppercase tracking-wider">Recommended Size</div>
                    <div className="text-6xl font-black text-yellow-600 dark:text-yellow-400">
                        {fitResult.size}
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                         <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">AI</span>
                         Why this size?
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted p-4 rounded-lg">
                        {fitResult.reason}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={() => {
                        setFitResult(null); // Reset to show form again
                    }}>
                        Update Profile
                    </Button>
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                        Done
                    </Button>
                </div>
            </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
