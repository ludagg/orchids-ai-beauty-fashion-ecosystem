"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, Loader2, Edit2, Check, Info } from "lucide-react";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";

interface AIFitCheckDialogProps {
    product: any;
    onSizeRecommended?: (size: string) => void;
}

export function AIFitCheckDialog({ product, onSizeRecommended }: AIFitCheckDialogProps) {
    const { data: session } = authClient.useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [measurements, setMeasurements] = useState({ height: '', weight: '', bodyType: '' });
    const [isEditing, setIsEditing] = useState(false);

    const [recommendation, setRecommendation] = useState<{size: string, reasoning: string, confidence: number} | null>(null);

    useEffect(() => {
        if (session?.user && isOpen && !loading && !recommendation) {
            fetchMeasurementsAndRecommend();
        }
    }, [isOpen, session]);

    const fetchMeasurementsAndRecommend = async () => {
        setLoading(true);
        try {
            // 1. Fetch user measurements
            const profileRes = await fetch('/api/users/profile/measurements');
            if (!profileRes.ok) throw new Error("Failed to load profile");
            const profileData = await profileRes.json();

            const userMeasurements = {
                height: profileData.height || '',
                weight: profileData.weight || '',
                bodyType: profileData.bodyType || ''
            };
            setMeasurements(userMeasurements);

            // If no measurements, don't run AI yet, prompt user
            if (!userMeasurements.height && !userMeasurements.weight) {
                setIsEditing(true);
                setLoading(false);
                return;
            }

            // 2. Fetch AI recommendation
            await fetchRecommendation(userMeasurements);

        } catch (err) {
            console.error("Error in AI Fit Check init:", err);
            toast.error("Failed to load AI Fit Check");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendation = async (currentMeasurements: any) => {
        try {
            setLoading(true);
            const res = await fetch('/api/ai-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product,
                    measurements: currentMeasurements
                })
            });

            if (!res.ok) throw new Error("AI request failed");

            const data = await res.json();
            setRecommendation(data);
            if (data.size && onSizeRecommended) {
                onSizeRecommended(data.size);
            }
        } catch (error) {
            console.error("Error fetching recommendation:", error);
            toast.error("Failed to get size recommendation");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveMeasurements = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/users/profile/measurements', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(measurements)
            });

            if (!res.ok) throw new Error("Failed to save measurements");

            toast.success("Measurements saved");
            setIsEditing(false);

            // Re-run AI fit check with new measurements
            await fetchRecommendation(measurements);

        } catch (error) {
            console.error(error);
            toast.error("Error saving measurements");
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
                                {recommendation ? `AI recommends size ${recommendation.size}` : "AI Fit Check"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {recommendation ? "Based on your profile" : "Find your perfect size"}
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
                        AI Fit Analysis
                    </DialogTitle>
                    <DialogDescription>
                        We analyze your profile to find the best fit for this item.
                    </DialogDescription>
                </DialogHeader>

                {!session ? (
                    <div className="py-6 text-center text-muted-foreground">
                        Please sign in to use the AI Fit Check feature.
                    </div>
                ) : loading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                        <p className="text-sm text-muted-foreground animate-pulse">Analyzing measurements and product specs...</p>
                    </div>
                ) : isEditing ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                placeholder="e.g. 175"
                                value={measurements.height}
                                onChange={(e) => setMeasurements({...measurements, height: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                placeholder="e.g. 70"
                                value={measurements.weight}
                                onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bodyType">Body Type</Label>
                            <Input
                                id="bodyType"
                                placeholder="e.g. Athletic, Slim, Regular"
                                value={measurements.bodyType}
                                onChange={(e) => setMeasurements({...measurements, bodyType: e.target.value})}
                            />
                        </div>
                        <Button className="w-full mt-4" onClick={handleSaveMeasurements}>
                            Save & Analyze
                        </Button>
                    </div>
                ) : recommendation ? (
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border border-border">
                            <div className="text-5xl font-bold text-primary mb-2">{recommendation.size}</div>
                            <div className="text-sm font-medium text-muted-foreground">Recommended Size</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium flex items-center gap-1">
                                    <Info className="h-4 w-4" /> AI Confidence
                                </span>
                                <span className="text-sm text-muted-foreground">{recommendation.confidence}%</span>
                            </div>
                            <Progress value={recommendation.confidence} className="h-2" />
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 p-4 rounded-md text-sm">
                            <p className="flex items-start gap-2">
                                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{recommendation.reasoning}</span>
                            </p>
                        </div>

                        <div className="pt-4 border-t flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                Based on: {measurements.height}cm, {measurements.weight}kg, {measurements.bodyType}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-3 w-3 mr-1" /> Edit
                            </Button>
                        </div>
                    </div>
                ) : (
                     <div className="py-6 text-center text-muted-foreground">
                        Could not generate a recommendation.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
