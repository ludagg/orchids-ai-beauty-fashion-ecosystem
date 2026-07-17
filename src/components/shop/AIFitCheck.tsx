"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
    productId: string;
    productName: string;
    productBrand?: string;
    productCategory?: string;
    availableSizes: any[];
}

export function AIFitCheck({ productId, productName, productBrand, productCategory, availableSizes }: AIFitCheckProps) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [height, setHeight] = useState(session?.user?.height || "");
    const [weight, setWeight] = useState(session?.user?.weight || "");
    const [bodyType, setBodyType] = useState(session?.user?.bodyType || "");

    const handleAnalyze = async () => {
        if (!height || !weight || !bodyType) {
             setIsEditing(true);
             return;
        }

        setIsAnalyzing(true);
        try {
            const response = await fetch("/api/ai-fit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    productName,
                    productBrand,
                    productCategory,
                    userProfile: { height, weight, bodyType },
                    availableSizes
                }),
            });

            if (!response.ok) throw new Error("Failed to get recommendation");

            const data = await response.json();
            setRecommendation(data);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze fit. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveProfileAndAnalyze = async () => {
         if (!height || !weight || !bodyType) {
             toast.error("Please fill in all profile fields");
             return;
         }

         try {
             // Save to profile
             const res = await fetch("/api/users/profile/measurements", {
                 method: "PATCH",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ height, weight, bodyType })
             });

             if (!res.ok) {
                  console.warn("Could not save profile to backend, proceeding with local values");
             } else {
                  toast.success("Profile saved!");
             }

             // Proceed to analyze
             await handleAnalyze();

         } catch (error) {
             console.error("Save error", error);
         }
    };

    // If we have a recommendation, use it. Otherwise placeholder if user has profile, otherwise prompt.
    let previewMessage = "AI recommends size M for you";
    let previewSubtext = "Based on your profile";

    if (recommendation) {
         previewMessage = `AI recommends size ${recommendation.size} for you`;
         previewSubtext = `${recommendation.confidence}% confidence match`;
    } else if (!height) {
         previewMessage = "Find your perfect size";
         previewSubtext = "Add measurements for AI fit";
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open && !recommendation && height && weight) {
                // Auto analyze if we have basic data and opening for first time
                handleAnalyze();
            } else if (open && !height) {
                setIsEditing(true);
            }
        }}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                {previewMessage}
                            </div>
                            <div className="text-xs text-muted-foreground">{previewSubtext}</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-yellow-500" /> AI Fit Intelligence
                    </DialogTitle>
                    <DialogDescription>
                        We analyze your measurements against brand sizing charts to find your perfect fit and reduce returns.
                    </DialogDescription>
                </DialogHeader>

                {isAnalyzing ? (
                     <div className="flex flex-col items-center justify-center py-12 space-y-4">
                         <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                         <p className="text-sm text-muted-foreground">Analyzing product dimensions and your profile...</p>
                     </div>
                ) : isEditing ? (
                     <div className="space-y-4 py-4">
                         <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                             <h4 className="font-medium text-sm">Your Measurements</h4>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                     <Label htmlFor="height">Height (cm)</Label>
                                     <Input id="height" type="number" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} />
                                 </div>
                                 <div className="space-y-2">
                                     <Label htmlFor="weight">Weight (kg)</Label>
                                     <Input id="weight" type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                 </div>
                             </div>
                             <div className="space-y-2">
                                 <Label htmlFor="bodyType">Body Type</Label>
                                 <Select value={bodyType} onValueChange={setBodyType}>
                                    <SelectTrigger id="bodyType">
                                        <SelectValue placeholder="Select body type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="slim">Slim</SelectItem>
                                        <SelectItem value="athletic">Athletic</SelectItem>
                                        <SelectItem value="average">Average / Regular</SelectItem>
                                        <SelectItem value="curvy">Curvy</SelectItem>
                                        <SelectItem value="broad">Broad / Stocky</SelectItem>
                                    </SelectContent>
                                 </Select>
                             </div>
                         </div>
                         <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600" onClick={handleSaveProfileAndAnalyze}>
                             <Save className="w-4 h-4 mr-2" /> Save & Analyze Fit
                         </Button>
                     </div>
                ) : recommendation ? (
                     <div className="space-y-6 py-4">
                         <div className="flex flex-col items-center justify-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-center">
                             <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">Recommended Size</div>
                             <div className="text-5xl font-bold mb-2">{recommendation.size}</div>
                             <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium dark:bg-yellow-900/30 dark:text-yellow-400">
                                 {recommendation.confidence}% Match Confidence
                             </div>
                         </div>

                         <div className="space-y-3">
                             <h4 className="font-medium text-sm">Fit Prediction</h4>
                             <div className="grid grid-cols-3 gap-2">
                                 {['Tight', 'Perfect', 'Loose'].map((fit) => (
                                     <div key={fit} className={`text-center p-2 rounded-md border text-xs ${
                                         recommendation.fitPrediction === fit.toLowerCase()
                                         ? 'bg-primary text-primary-foreground border-primary font-bold'
                                         : 'bg-muted text-muted-foreground border-border'
                                     }`}>
                                         {fit}
                                     </div>
                                 ))}
                             </div>
                             <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                 {recommendation.explanation}
                             </p>
                         </div>

                         <Button variant="outline" className="w-full text-xs" onClick={() => setIsEditing(true)}>
                             Update Measurements
                         </Button>
                     </div>
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        Something went wrong. Please try again.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
