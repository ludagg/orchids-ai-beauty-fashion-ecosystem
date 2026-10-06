"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface AIFitCheckDialogProps {
    product: any;
    onSizeRecommended: (size: string) => void;
}

export function AIFitCheckDialog({ product, onSizeRecommended }: AIFitCheckDialogProps) {
    const { data: session } = authClient.useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [measurements, setMeasurements] = useState({ height: "", weight: "", bodyType: "" });
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [recommendation, setRecommendation] = useState<{ size: string; explanation: string; confidence: number } | null>(null);

    // Fetch measurements when dialog opens
    useEffect(() => {
        if (isOpen && session?.user && !recommendation) {
            fetchMeasurements();
        }
    }, [isOpen, session]);

    const fetchMeasurements = async () => {
        try {
            setIsLoadingMeasurements(true);
            const res = await fetch("/api/users/profile/measurements");
            if (res.ok) {
                const data = await res.json();
                setMeasurements({
                    height: data.height || "",
                    weight: data.weight || "",
                    bodyType: data.bodyType || "",
                });

                // If we have some basic data, try to get a recommendation right away
                if (data.height || data.weight) {
                     getRecommendation({
                        height: data.height || "",
                        weight: data.weight || "",
                        bodyType: data.bodyType || "",
                     });
                }
            }
        } catch (error) {
            console.error("Failed to fetch measurements:", error);
        } finally {
            setIsLoadingMeasurements(false);
        }
    };

    const handleSaveMeasurements = async () => {
        if (!session?.user) {
            toast.error("Please sign in to save measurements");
            return;
        }

        try {
            setIsSaving(true);
            const res = await fetch("/api/users/profile/measurements", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(measurements),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Measurements saved!");
            getRecommendation(measurements);

        } catch (error) {
            toast.error("Failed to save measurements");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const getRecommendation = async (userMeasurements: any) => {
        try {
            setIsAnalyzing(true);
            const res = await fetch("/api/ai-fit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product: {
                        name: product.name,
                        category: product.category,
                        description: product.description,
                        sizes: product.sizes
                    },
                    measurements: userMeasurements
                }),
            });

            if (!res.ok) throw new Error("Failed to get recommendation");

            const data = await res.json();
            setRecommendation({
                size: data.recommendedSize,
                explanation: data.explanation,
                confidence: data.confidence
            });

            if (data.recommendedSize) {
                onSizeRecommended(data.recommendedSize);
            }

        } catch (error) {
            console.error("AI Fit Check Error:", error);
            toast.error("Could not analyze fit right now.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const needsMeasurements = !measurements.height && !measurements.weight && !isLoadingMeasurements && !isAnalyzing && !recommendation;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                {recommendation ? `AI recommends size ${recommendation.size}` : "Try AI Fit Check"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {recommendation ? `Confidence: ${recommendation.confidence}%` : "Find your perfect size"}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-yellow-500" />
                        AI Fit Analysis
                    </DialogTitle>
                    <DialogDescription>
                        We use your measurements to predict the best fit for this specific item.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Measurements Form */}
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                        <h4 className="text-sm font-medium">Your Measurements</h4>

                        {!session?.user ? (
                            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                Please sign in to save your measurements for better recommendations.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        placeholder="e.g. 170"
                                        value={measurements.height}
                                        onChange={(e) => setMeasurements(prev => ({ ...prev, height: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        placeholder="e.g. 65"
                                        value={measurements.weight}
                                        onChange={(e) => setMeasurements(prev => ({ ...prev, weight: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="bodyType">Body Type (Optional)</Label>
                                    <Input
                                        id="bodyType"
                                        placeholder="e.g. Athletic, Curvy, Slim"
                                        value={measurements.bodyType}
                                        onChange={(e) => setMeasurements(prev => ({ ...prev, bodyType: e.target.value }))}
                                    />
                                </div>

                                <div className="col-span-2 flex justify-end">
                                     <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSaveMeasurements}
                                        disabled={isSaving || (!measurements.height && !measurements.weight)}
                                    >
                                        {isSaving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                        Save & Analyze
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recommendation Area */}
                    <div className="space-y-4">
                        {isAnalyzing ? (
                             <div className="flex flex-col items-center justify-center py-6 text-muted-foreground space-y-4">
                                 <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                                 <p className="text-sm animate-pulse">AI is analyzing product sizing and your profile...</p>
                             </div>
                        ) : recommendation ? (
                             <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg space-y-3">
                                 <div className="flex items-center justify-between">
                                     <span className="font-semibold text-yellow-700 dark:text-yellow-400">Recommended Size</span>
                                     <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{recommendation.size}</span>
                                 </div>
                                 <div className="h-px bg-yellow-500/20 w-full" />
                                 <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                     {recommendation.explanation}
                                 </p>
                                 <div className="flex items-center gap-2 mt-2">
                                     <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                         <div
                                            className="h-full bg-yellow-500 rounded-full"
                                            style={{ width: `${recommendation.confidence}%` }}
                                         />
                                     </div>
                                     <span className="text-xs font-medium text-muted-foreground">{recommendation.confidence}% Match</span>
                                 </div>
                             </div>
                        ) : needsMeasurements ? (
                             <div className="text-center py-4 text-sm text-muted-foreground">
                                 Add your measurements above to get a personalized size recommendation.
                             </div>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
