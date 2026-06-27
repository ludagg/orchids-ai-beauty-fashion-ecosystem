"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface AIFitCheckProps {
    product: any;
}

export function AIFitCheck({ product }: AIFitCheckProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Profile form state
    const [height, setHeight] = useState(session?.user?.height || "");
    const [weight, setWeight] = useState(session?.user?.weight || "");
    const [bodyType, setBodyType] = useState(session?.user?.bodyType || "");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
         if (session?.user) {
             setHeight(session.user.height || "");
             setWeight(session.user.weight || "");
             setBodyType(session.user.bodyType || "");
         }
    }, [session]);

    useEffect(() => {
        if (open && !recommendation && (height || weight) && !showForm) {
            fetchRecommendation();
        } else if (open && !height && !weight) {
             setShowForm(true);
        }
    }, [open]);

    const fetchRecommendation = async (useOverrides = false) => {
        setLoading(true);
        setError(null);
        try {
            const payload: any = { productId: product.id };
            if (useOverrides || !session?.user) {
                payload.height = height;
                payload.weight = weight;
                payload.bodyType = bodyType;
            }

            const res = await fetch('/api/ai-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setRecommendation(data);
                setShowForm(false);
            } else {
                setError(data.error || "Failed to fetch recommendation");
                if (data.error?.includes("required")) {
                     setShowForm(true);
                }
            }
        } catch (err) {
            setError("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
         if (!height && !weight) {
             toast.error("Please provide height or weight");
             return;
         }

         setSaving(true);
         try {
             if (session?.user) {
                 const res = await fetch('/api/users/profile/measurements', {
                     method: 'PATCH',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ height, weight, bodyType })
                 });
                 if (!res.ok) throw new Error("Failed to save profile");
             }

             // Fetch new recommendation with new data
             await fetchRecommendation(true);
         } catch (err) {
             toast.error("Could not save profile");
         } finally {
             setSaving(false);
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
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                                AI Fit Check
                                {recommendation && (
                                     <span className="bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[10px]">
                                         {recommendation.recommendedSize}
                                     </span>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {recommendation ? "View full analysis" : "Find your perfect size"}
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
                        AI Fit Intelligence
                    </DialogTitle>
                    <DialogDescription>
                        Get personalized size recommendations based on your unique body profile.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[200px] flex flex-col justify-center">
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                             <Loader2 className="h-8 w-8 animate-spin mb-4 text-yellow-500" />
                             <p className="text-sm">Analyzing product dimensions...</p>
                         </div>
                    ) : showForm ? (
                         <div className="space-y-4 py-2">
                              <p className="text-sm text-muted-foreground mb-4">
                                  We need a few details to recommend the best fit for this {product.mainCategory || 'item'}.
                              </p>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="height">Height (e.g. 175cm, 5'9")</Label>
                                      <Input id="height" value={height} onChange={e => setHeight(e.target.value)} placeholder="175cm" />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="weight">Weight (e.g. 70kg, 150lbs)</Label>
                                      <Input id="weight" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70kg" />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <Label>Body Type</Label>
                                  <Select value={bodyType} onValueChange={setBodyType}>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select body type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="slim">Slim</SelectItem>
                                          <SelectItem value="athletic">Athletic</SelectItem>
                                          <SelectItem value="average">Average</SelectItem>
                                          <SelectItem value="curvy">Curvy</SelectItem>
                                          <SelectItem value="plus">Plus Size</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>

                              <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleSaveProfile} disabled={saving}>
                                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                  Save & Get Recommendation
                              </Button>
                         </div>
                    ) : error ? (
                         <div className="text-center text-red-500 py-8">
                             <p>{error}</p>
                             <Button variant="outline" className="mt-4" onClick={() => fetchRecommendation(true)}>Retry</Button>
                         </div>
                    ) : recommendation ? (
                         <div className="space-y-6 py-4">
                             <div className="flex flex-col items-center text-center space-y-2">
                                 <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Recommended Size</div>
                                 <div className="text-5xl font-black text-yellow-500">{recommendation.recommendedSize}</div>
                                 <div className="text-sm font-medium pt-2">
                                     Confidence: {Math.round(recommendation.confidence * 100)}%
                                 </div>
                             </div>

                             <div className="bg-muted p-4 rounded-xl space-y-2">
                                 <h4 className="font-semibold text-sm">Why this size?</h4>
                                 <p className="text-sm text-muted-foreground leading-relaxed">
                                     {recommendation.explanation}
                                 </p>
                             </div>

                             <div className="flex items-center justify-between pt-2">
                                 <div className="text-xs text-muted-foreground">
                                      Based on: {height || '??'}, {weight || '??'} {bodyType ? `(${bodyType})` : ''}
                                 </div>
                                 <Button variant="link" className="text-xs p-0 h-auto text-yellow-600" onClick={() => setShowForm(true)}>
                                     Update Profile
                                 </Button>
                             </div>
                         </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
