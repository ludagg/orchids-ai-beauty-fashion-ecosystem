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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, ChevronRight, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface AIFitCheckProps {
  productId: string;
}

export function AIFitCheck({ productId }: AIFitCheckProps) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [profile, setProfile] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });

  useEffect(() => {
    if (session?.user) {
      setProfile({
        height: (session.user as any).height || "",
        weight: (session.user as any).weight || "",
        bodyType: (session.user as any).bodyType || "",
      });
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        toast.success("Profile measurements updated");
        handleAnalyzeFit();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeFit = async () => {
    if (!profile.height || !profile.weight || !profile.bodyType) {
      toast.error("Please fill in your measurements first");
      return;
    }

    setAnalyzing(true);
    setRecommendation(null);
    try {
      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userProfile: profile }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendation(data);
      } else {
        toast.error(data.error || "Failed to analyze fit");
      }
    } catch (e) {
      toast.error("An error occurred during analysis");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
      if (isOpen && session?.user && profile.height && profile.weight && profile.bodyType && !recommendation && !analyzing) {
          handleAnalyzeFit();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-black">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                AI Fit Analysis
              </div>
              <div className="text-xs text-muted-foreground">Find your perfect size</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Virtual Fit Check</DialogTitle>
          <DialogDescription>
            Let our AI recommend the best size for you based on your measurements.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                placeholder="e.g. 175"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                placeholder="e.g. 70"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyType">Body Type</Label>
            <Select
              value={profile.bodyType}
              onValueChange={(value) => setProfile({ ...profile, bodyType: value })}
            >
              <SelectTrigger id="bodyType">
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slim">Slim / Slender</SelectItem>
                <SelectItem value="athletic">Athletic / Muscular</SelectItem>
                <SelectItem value="average">Average / Regular</SelectItem>
                <SelectItem value="curvy">Curvy / Full</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleUpdateProfile}
            disabled={loading || analyzing || !profile.height || !profile.weight || !profile.bodyType}
            className="w-full mt-2"
          >
            {analyzing ? (
                <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Analyzing Fit...
                </>
            ) : (
                "Analyze My Fit"
            )}
          </Button>

          {recommendation && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500 text-black font-bold h-12 w-12 rounded-full flex items-center justify-center text-xl shrink-0">
                  {recommendation.recommendedSize}
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-400">
                    Recommended Size: {recommendation.recommendedSize}
                  </h4>
                  <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80 mt-1 leading-tight">
                    {recommendation.reasoning}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-yellow-700/70 dark:text-yellow-500">
                    <Info className="h-3 w-3" />
                    <span>Expected fit: <span className="font-medium capitalize">{recommendation.fit}</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
