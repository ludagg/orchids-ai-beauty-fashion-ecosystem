"use client";

import { useState, useEffect } from 'react';
import { Ruler, ChevronRight, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";

interface AIFitCheckDialogProps {
  productId: string;
  productName: string;
}

interface Measurements {
  height: string;
  weight: string;
  bodyType: string;
}

interface FitRecommendation {
  recommendedSize: string;
  confidenceScore: number;
  reasoning: string;
  fitType: string;
}

export function AIFitCheckDialog({ productId, productName }: AIFitCheckDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>({ height: '', weight: '', bodyType: '' });
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<FitRecommendation | null>(null);

  // Fetch existing measurements on open
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        setIsFetchingProfile(true);
        try {
          const res = await fetch('/api/users/profile/measurements');
          if (res.ok) {
            const data = await res.json();
            if (data.height || data.weight || data.bodyType) {
              const fetchedMeasurements = {
                height: data.height || '',
                weight: data.weight || '',
                bodyType: data.bodyType || ''
              };
              setMeasurements(fetchedMeasurements);
              // If we have all required fields, auto-analyze
              if (fetchedMeasurements.height && fetchedMeasurements.weight && fetchedMeasurements.bodyType) {
                 analyzeFit(fetchedMeasurements);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch measurements", error);
        } finally {
          setIsFetchingProfile(false);
        }
      };

      // Reset state if reopening
      if (!recommendation) {
        fetchProfile();
      }
    }
  }, [isOpen]);

  const handleUpdateMeasurements = async () => {
    if (!measurements.height || !measurements.weight || !measurements.bodyType) {
      toast.error("Please fill in all measurements.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/users/profile/measurements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurements)
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated");
      await analyzeFit(measurements);
    } catch (error) {
      toast.error("Failed to save measurements");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const analyzeFit = async (currentMeasurements: Measurements) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          ...currentMeasurements
        })
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      toast.error("AI Analysis failed. Try again later.");
    } finally {
      setIsAnalyzing(false);
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
                {recommendation ? `AI recommends size ${recommendation.recommendedSize}` : 'AI Fit Check'}
              </div>
              <div className="text-xs text-muted-foreground">
                {recommendation ? 'Based on your profile' : 'Find your perfect size'}
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Fit Analysis</DialogTitle>
          <DialogDescription>
            We use your body measurements and product data to recommend the perfect size.
          </DialogDescription>
        </DialogHeader>

        {isFetchingProfile ? (
           <div className="flex justify-center p-8">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           </div>
        ) : recommendation ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Recommended Size</span>
              <span className="text-5xl font-bold text-yellow-600 dark:text-yellow-500">{recommendation.recommendedSize}</span>
              <Badge variant="outline" className="mt-2 bg-background">
                {recommendation.fitType.charAt(0).toUpperCase() + recommendation.fitType.slice(1)} Fit
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence Score</span>
                <span className="font-medium">{recommendation.confidenceScore}%</span>
              </div>
              <Progress value={recommendation.confidenceScore} className="h-2" />
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md border">
              {recommendation.reasoning}
            </div>

            <Button variant="outline" className="w-full" onClick={() => setRecommendation(null)}>
              Update Measurements
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="height">Height (cm)</Label>
                 <Input
                   id="height"
                   type="number"
                   placeholder="e.g. 175"
                   value={measurements.height}
                   onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="weight">Weight (kg)</Label>
                 <Input
                   id="weight"
                   type="number"
                   placeholder="e.g. 70"
                   value={measurements.weight}
                   onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                 />
               </div>
             </div>

             <div className="space-y-2">
               <Label>Body Type</Label>
               <Select
                  value={measurements.bodyType}
                  onValueChange={(val) => setMeasurements({ ...measurements, bodyType: val })}
                >
                 <SelectTrigger>
                   <SelectValue placeholder="Select your body type" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="slim">Slim</SelectItem>
                   <SelectItem value="athletic">Athletic</SelectItem>
                   <SelectItem value="regular">Regular</SelectItem>
                   <SelectItem value="curvy">Curvy</SelectItem>
                   <SelectItem value="plus-size">Plus Size</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             <Button
               className="w-full mt-4"
               onClick={handleUpdateMeasurements}
               disabled={isUpdatingProfile || isAnalyzing || !measurements.height || !measurements.weight || !measurements.bodyType}
             >
               {isUpdatingProfile || isAnalyzing ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                 <Save className="mr-2 h-4 w-4" />
               )}
               {isUpdatingProfile ? 'Saving...' : isAnalyzing ? 'Analyzing Fit...' : 'Save & Analyze'}
             </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}