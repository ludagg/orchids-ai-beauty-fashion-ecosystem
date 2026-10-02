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
import { Ruler, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface AIFitCheckDialogProps {
    productBrand?: string;
    productCategory?: string;
}

export function AIFitCheckDialog({ productBrand, productCategory }: AIFitCheckDialogProps) {
    const { data: session } = authClient.useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bodyType, setBodyType] = useState("average");

    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (isOpen && session && !height && !weight) {
             fetchMeasurements();
        }
    }, [isOpen, session]);

    const fetchMeasurements = async () => {
         try {
             const res = await fetch('/api/users/profile/measurements');
             if (res.ok) {
                 const data = await res.json();
                 if (data.height) setHeight(data.height);
                 if (data.weight) setWeight(data.weight);
                 if (data.bodyType) setBodyType(data.bodyType);
             }
         } catch (error) {
             console.error("Error fetching measurements:", error);
         }
    };

    const handleAnalyze = async () => {
        if (!height || !weight) {
            toast.error("Please enter height and weight");
            return;
        }

        setLoading(true);
        try {
            // Save measurements first if logged in
            if (session) {
                await fetch('/api/users/profile/measurements', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ height, weight, bodyType })
                });
            }

            const res = await fetch('/api/ai-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ height, weight, bodyType, productBrand, productCategory })
            });

            if (!res.ok) throw new Error("Failed to analyze");

            const data = await res.json();
            setResult(data);

        } catch (error) {
            console.error("Analysis error:", error);
            toast.error("Could not complete AI Fit analysis.");
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
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                Try AI Fit Check
                            </div>
                            <div className="text-xs text-muted-foreground">Find your perfect size instantly</div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-yellow-500" />
                        AI Fit Intelligence
                    </DialogTitle>
                    <DialogDescription>
                        Enter your measurements and our AI will recommend the best size for this item.
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div className="space-y-4 py-4">
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
                                    placeholder="e.g. 70"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="bodyType">Body Type</Label>
                             <select
                                id="bodyType"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={bodyType}
                                onChange={(e) => setBodyType(e.target.value)}
                             >
                                 <option value="slim">Slim</option>
                                 <option value="average">Average</option>
                                 <option value="athletic">Athletic</option>
                                 <option value="curvy">Curvy</option>
                             </select>
                        </div>
                        <Button
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                            onClick={handleAnalyze}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Analyze Fit
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                            <div className="text-sm font-medium text-yellow-800 dark:text-yellow-500 mb-1">Recommended Size</div>
                            <div className="text-5xl font-black text-yellow-600 dark:text-yellow-400">{result.recommendedSize}</div>
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-xs font-semibold text-yellow-800 dark:text-yellow-400">
                                {result.confidence}% Match
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">AI Analysis</p>
                                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-muted rounded-lg">
                                <span className="font-medium">Expected Fit:</span>
                                <span>{result.fitType}</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                            Recalculate
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
