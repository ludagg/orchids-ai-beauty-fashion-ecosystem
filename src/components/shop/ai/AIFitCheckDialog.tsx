"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, Loader2, Sparkles, ChevronRight, Activity } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIFitCheckDialogProps {
    productId: string;
    productName: string;
    brand: string;
    category: string;
}

export default function AIFitCheckDialog({ productId, productName, brand, category }: AIFitCheckDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // User profile measurements
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bodyType, setBodyType] = useState("");

    // AI Analysis result
    const [analysisResult, setAnalysisResult] = useState<{
        recommendedSize: string;
        confidence: number;
        reasoning: string;
        fitDetails: string;
    } | null>(null);

    // Load existing measurements when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchMeasurements();
        }
    }, [isOpen]);

    const fetchMeasurements = async () => {
        try {
            const res = await fetch('/api/users/profile/measurements');
            if (res.ok) {
                const data = await res.json();
                if (data.height) setHeight(data.height);
                if (data.weight) setWeight(data.weight);
                if (data.bodyType) setBodyType(data.bodyType);

                // If we have data, we could auto-trigger analysis here,
                // but let's let the user verify and click "Analyze" first
            }
        } catch (error) {
            console.error("Error fetching measurements:", error);
        }
    };

    const handleSaveMeasurements = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/users/profile/measurements', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ height, weight, bodyType })
            });
            if (!res.ok) throw new Error("Failed to save measurements");
            toast.success("Measurements saved to profile");
            return true;
        } catch (error) {
            toast.error("Could not save measurements");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnalyze = async () => {
        if (!height || !weight || !bodyType) {
            toast.error("Please fill in all measurements");
            return;
        }

        setIsLoading(true);

        // Save first to ensure profile is up to date
        await handleSaveMeasurements();

        try {
            const res = await fetch('/api/ai-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    productName,
                    brand,
                    category,
                    measurements: { height, weight, bodyType }
                })
            });

            if (res.ok) {
                const data = await res.json();
                setAnalysisResult(data.recommendation);
            } else {
                throw new Error("Failed to get analysis");
            }
        } catch (error) {
            console.error(error);
            toast.error("AI analysis failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                            <Sparkles className="h-4 w-4" />
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Virtual Fit Intelligence
                    </DialogTitle>
                    <DialogDescription>
                        Enter your details to get an AI-powered size recommendation for {productName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {!analysisResult ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        placeholder="175"
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        placeholder="70"
                                        type="number"
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
                                        <SelectItem value="slim">Slim / Athletic</SelectItem>
                                        <SelectItem value="regular">Regular / Average</SelectItem>
                                        <SelectItem value="curvy">Curvy / Muscular</SelectItem>
                                        <SelectItem value="plus">Plus Size</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:opacity-90"
                                onClick={handleAnalyze}
                                disabled={isLoading || !height || !weight || !bodyType}
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                                ) : (
                                    <><Activity className="mr-2 h-4 w-4" /> Get Recommendation</>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl border border-yellow-500/20 text-center space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Ruler className="h-24 w-24" />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Recommended Size
                                </div>
                                <div className="text-5xl font-black text-yellow-600 dark:text-yellow-400">
                                    {analysisResult.recommendedSize}
                                </div>
                                <div className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">
                                    {analysisResult.confidence}% Confidence Match
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Why this size?</h4>
                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg leading-relaxed">
                                        {analysisResult.reasoning}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Fit Details</h4>
                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg leading-relaxed">
                                        {analysisResult.fitDetails}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setAnalysisResult(null)}
                                >
                                    Update Details
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
