"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AIFitCheckDialogProps {
    product: any;
}

export function AIFitCheckDialog({ product }: AIFitCheckDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [measurements, setMeasurements] = useState({ height: '', weight: '', bodyType: '' });
    const [result, setResult] = useState<{ recommendedSize?: string, explanation?: string } | null>(null);

    useEffect(() => {
        if (open) {
            fetchMeasurements();
        }
    }, [open]);

    const fetchMeasurements = async () => {
        try {
            const res = await fetch('/api/users/profile/measurements');
            if (res.ok) {
                const data = await res.json();
                setMeasurements({
                    height: data?.height || '',
                    weight: data?.weight || '',
                    bodyType: data?.bodyType || ''
                });
            }
        } catch (error) {
            console.error("Failed to fetch measurements");
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            // Optionally update measurements profile first
            await fetch('/api/users/profile/measurements', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(measurements)
            });

            // Call AI Fit API
            const res = await fetch('/api/ai-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product, measurements })
            });

            if (!res.ok) throw new Error("Failed to analyze fit");

            const data = await res.json();
            setResult(data);
            toast.success("Analysis complete");
        } catch (error) {
            toast.error("Failed to perform AI fit check");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>AI Fit Analysis</DialogTitle>
                    <DialogDescription>
                        Enter your measurements to get a personalized size recommendation for {product.name}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="height" className="text-right">Height (cm)</Label>
                        <Input
                            id="height"
                            value={measurements.height}
                            onChange={(e) => setMeasurements({...measurements, height: e.target.value})}
                            className="col-span-3"
                            placeholder="e.g. 175"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="weight" className="text-right">Weight (kg)</Label>
                        <Input
                            id="weight"
                            value={measurements.weight}
                            onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                            className="col-span-3"
                            placeholder="e.g. 70"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bodyType" className="text-right">Body Type</Label>
                        <Input
                            id="bodyType"
                            value={measurements.bodyType}
                            onChange={(e) => setMeasurements({...measurements, bodyType: e.target.value})}
                            className="col-span-3"
                            placeholder="e.g. Slim, Athletic, Curvy"
                        />
                    </div>

                    <Button onClick={handleAnalyze} disabled={loading} className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loading ? "Analyzing..." : "Analyze Fit"}
                    </Button>
                </div>

                {result && (
                    <div className="mt-4 p-4 rounded-lg bg-muted border">
                        <h4 className="font-bold text-lg mb-2">Recommended Size: <span className="text-yellow-600">{result.recommendedSize}</span></h4>
                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
