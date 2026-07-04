"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AIFitCheck({ productId, productBrand }: { productId: string, productBrand?: string }) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<{ recommendedSize: string, explanation: string, confidence: number } | null>(null);

    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [hasMeasurements, setHasMeasurements] = useState(false);

    // Load initial measurements from session if available
    useEffect(() => {
        if (session?.user) {
            // @ts-ignore - Assuming these are added to session type but might not be typed yet
            const userHeight = (session.user as any).height;
            const userWeight = (session.user as any).weight;
            const userBodyType = (session.user as any).bodyType;

            if (userHeight) setHeight(userHeight);
            if (userWeight) setWeight(userWeight);
            if (userBodyType) setBodyType(userBodyType);

            if (userHeight && userWeight) {
                setHasMeasurements(true);
            }
        }
    }, [session]);

    const analyzeFit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ai-fit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    height,
                    weight,
                    bodyType
                })
            });

            if (res.ok) {
                const data = await res.json();
                setRecommendation(data);
                setHasMeasurements(true);
            }
        } catch (error) {
            console.error("Failed to analyze fit", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndAnalyze = async () => {
        if (!height || !weight) return;

        setLoading(true);
        // Save to profile if logged in
        if (session?.user) {
            try {
                await fetch("/api/users/profile/measurements", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ height, weight, bodyType })
                });
            } catch (error) {
                console.error("Failed to save measurements", error);
            }
        }

        // Then analyze
        await analyzeFit();
    };

    const handleTriggerClick = (e: React.MouseEvent) => {
        // Only run analysis if we have measurements and haven't run it yet
        if (hasMeasurements && !recommendation) {
            analyzeFit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div
                    onClick={handleTriggerClick}
                    className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                                AI Fit Check
                                {loading && !isOpen && <Loader2 className="w-3 h-3 animate-spin" />}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {recommendation
                                    ? `AI recommends size ${recommendation.recommendedSize} for you`
                                    : "Find your perfect size based on your profile"
                                }
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        AI Fit Analysis
                    </DialogTitle>
                    <DialogDescription>
                        We use advanced AI to recommend the perfect fit based on your unique body profile and the specific sizing of {productBrand || 'this brand'}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {!hasMeasurements && !recommendation ? (
                        // Form to collect measurements
                        <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                                <h3 className="font-medium text-sm">Tell us about yourself</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height (cm)</Label>
                                        <Input
                                            id="height"
                                            placeholder="e.g. 175"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            type="number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            placeholder="e.g. 70"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bodyType">Body Type (Optional)</Label>
                                    <Select value={bodyType} onValueChange={setBodyType}>
                                        <SelectTrigger id="bodyType">
                                            <SelectValue placeholder="Select body type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="slim">Slim</SelectItem>
                                            <SelectItem value="athletic">Athletic</SelectItem>
                                            <SelectItem value="average">Average</SelectItem>
                                            <SelectItem value="curvy">Curvy</SelectItem>
                                            <SelectItem value="muscular">Muscular</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                                onClick={handleSaveAndAnalyze}
                                disabled={!height || !weight || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing Fit...
                                    </>
                                ) : (
                                    "Analyze My Fit"
                                )}
                            </Button>
                        </div>
                    ) : (
                        // Results view
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full blur-xl bg-yellow-500/20 animate-pulse" />
                                        <Sparkles className="h-12 w-12 text-yellow-500 animate-bounce relative" />
                                    </div>
                                    <p className="text-sm text-muted-foreground animate-pulse">Running AI models on product measurements...</p>
                                </div>
                            ) : recommendation ? (
                                <>
                                    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
                                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">Recommended Size</span>
                                        <div className="text-5xl font-black mb-4 flex items-baseline gap-2 text-foreground">
                                            {recommendation.recommendedSize}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {Math.round(recommendation.confidence * 100)}% match
                                            </span>
                                        </div>
                                        <p className="text-center text-sm text-muted-foreground">
                                            {recommendation.explanation}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Based on your profile</span>
                                            <button
                                                className="underline hover:text-foreground"
                                                onClick={() => {
                                                    setRecommendation(null);
                                                    setHasMeasurements(false);
                                                }}
                                            >
                                                Edit Measurements
                                            </button>
                                        </div>
                                        <div className="flex gap-2 text-xs font-medium">
                                            <span className="bg-muted px-2 py-1 rounded-md">{height} cm</span>
                                            <span className="bg-muted px-2 py-1 rounded-md">{weight} kg</span>
                                            {bodyType && <span className="bg-muted px-2 py-1 rounded-md capitalize">{bodyType}</span>}
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
