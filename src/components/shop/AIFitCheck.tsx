"use client";

import { useState, useEffect } from "react";
import { Ruler, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AIFitCheckProps {
    product: any;
    onSizeRecommended?: (sizeName: string) => void;
}

export function AIFitCheck({ product, onSizeRecommended }: AIFitCheckProps) {
    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Measurements
    const [height, setHeight] = useState(session?.user?.height || "");
    const [weight, setWeight] = useState(session?.user?.weight || "");
    const [bodyType, setBodyType] = useState(session?.user?.bodyType || "");

    // Results
    const [recommendation, setRecommendation] = useState<{ size: string; fit: string; confidence: number; explanation: string } | null>(null);

    const hasMeasurements = !!(session?.user?.height && session?.user?.weight && session?.user?.bodyType);
    const isReadyToAnalyze = !!(height && weight && bodyType);

    useEffect(() => {
        if (session?.user) {
            if (session.user.height) setHeight(session.user.height);
            if (session.user.weight) setWeight(session.user.weight);
            if (session.user.bodyType) setBodyType(session.user.bodyType);
        }
    }, [session]);

    // Automatically analyze if we have measurements and haven't analyzed yet
    useEffect(() => {
        if (hasMeasurements && !recommendation && !isAnalyzing && product.sizes?.length > 0) {
            analyzeFit(session!.user!.height!, session!.user!.weight!, session!.user!.bodyType!);
        }
    }, [hasMeasurements, recommendation, product.sizes]);

    const analyzeFit = async (h: string, w: string, bt: string) => {
        if (!product.sizes || product.sizes.length === 0) return;

        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/ai-fit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    height: h,
                    weight: w,
                    bodyType: bt,
                    product: {
                        name: product.name,
                        brand: product.brand,
                        mainCategory: product.mainCategory,
                        subcategory: product.subcategory,
                        description: product.description,
                        material: product.material,
                    },
                    sizes: product.sizes
                })
            });

            if (!res.ok) throw new Error("Failed to analyze fit");

            const data = await res.json();
            setRecommendation(data);

            if (onSizeRecommended && data.size) {
                onSizeRecommended(data.size);
            }

        } catch (error) {
            console.error("AI Fit Check Error:", error);
            toast.error("Failed to analyze fit. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveMeasurements = async () => {
        if (!session?.user) {
            toast.error("Please sign in to save measurements");
            return;
        }

        if (!height || !weight || !bodyType) {
            toast.error("Please fill in all measurements");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/users/profile/measurements", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ height, weight, bodyType })
            });

            if (!res.ok) throw new Error("Failed to save measurements");

            toast.success("Measurements saved!");
            analyzeFit(height, weight, bodyType);
        } catch (error) {
            console.error("Save measurements error:", error);
            toast.error("Failed to save measurements");
        } finally {
            setIsSaving(false);
        }
    };

    if (!product.sizes || product.sizes.length === 0) {
        return null; // Don't show if no sizes available
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 cursor-pointer hover:bg-violet-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
                            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ruler className="h-4 w-4" />}
                        </div>
                        <div>
                            {recommendation ? (
                                <>
                                    <div className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                                        AI recommends size {recommendation.size} for you
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Fit: {recommendation.fit} • {recommendation.confidence}% match
                                    </div>
                                </>
                            ) : hasMeasurements ? (
                                <>
                                    <div className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                                        Analyzing your fit...
                                    </div>
                                    <div className="text-xs text-muted-foreground">Using your saved measurements</div>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                                        Find your perfect fit
                                    </div>
                                    <div className="text-xs text-muted-foreground">Add measurements for AI recommendation</div>
                                </>
                            )}
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-violet-600" />
                        AI Fit Intelligence
                    </DialogTitle>
                    <DialogDescription>
                        We use advanced AI to recommend the best size for your specific body type based on this brand's sizing.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {recommendation ? (
                        <div className="bg-muted p-4 rounded-xl border space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Recommended Size</span>
                                <span className="text-2xl font-bold text-violet-600 bg-violet-100 dark:bg-violet-900/30 w-12 h-12 flex items-center justify-center rounded-full">
                                    {recommendation.size}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Expected Fit</span>
                                    <span className="font-medium capitalize">{recommendation.fit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Confidence Score</span>
                                    <span className="font-medium flex items-center gap-1">
                                        {recommendation.confidence}%
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground pt-2 border-t">
                                {recommendation.explanation}
                            </p>

                            <Button variant="outline" className="w-full text-xs" onClick={() => setRecommendation(null)}>
                                Update Measurements
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
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
                                        placeholder="e.g. 65"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bodyType">Body Type</Label>
                                <Select value={bodyType} onValueChange={setBodyType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your body type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="slim">Slim</SelectItem>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="athletic">Athletic / Broad Shoulders</SelectItem>
                                        <SelectItem value="curvy">Curvy</SelectItem>
                                        <SelectItem value="plus_size">Plus Size</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                                onClick={handleSaveMeasurements}
                                disabled={!isReadyToAnalyze || isSaving || isAnalyzing}
                            >
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isAnalyzing ? "Analyzing Fit..." : "Save & Analyze Fit"}
                            </Button>

                            {!session?.user && (
                                <p className="text-xs text-center text-muted-foreground">
                                    Please sign in to save these measurements for future purchases.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
