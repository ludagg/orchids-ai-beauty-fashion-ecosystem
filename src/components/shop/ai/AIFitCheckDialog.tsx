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
import { Ruler, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface AIFitCheckDialogProps {
  product: any;
}

export default function AIFitCheckDialog({ product }: AIFitCheckDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
      // Fetch user profile if measurements are saved
      const fetchProfile = async () => {
          if (!user) return;
          try {
              const res = await fetch('/api/users/profile/measurements');
              if (res.ok) {
                  const data = await res.json();
                  if (data.height) setHeight(data.height);
                  if (data.weight) setWeight(data.weight);
                  if (data.bodyType) setBodyType(data.bodyType);
              }
          } catch (e) {
              console.error("Failed to fetch profile measurements", e);
          }
      };
      if (isOpen) {
          fetchProfile();
      }
  }, [isOpen, user]);

  const handleAnalyze = async () => {
      if (!height || !weight || !bodyType) {
          toast.error("Please fill in all measurements");
          return;
      }
      setLoading(true);
      try {
          const res = await fetch('/api/ai-fit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  productId: product.id,
                  productName: product.name,
                  category: product.category,
                  description: product.description,
                  height,
                  weight,
                  bodyType
              })
          });
          const data = await res.json();
          if (res.ok) {
              setResult(data);
          } else {
              toast.error(data.error || "Failed to analyze fit");
          }
      } catch (e) {
          toast.error("An error occurred");
      } finally {
          setLoading(false);
      }
  };

  const handleSaveMeasurements = async () => {
        try {
            const res = await fetch('/api/users/profile/measurements', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ height, weight, bodyType })
            });
            if (res.ok) {
                toast.success("Measurements saved!");
            } else {
                 toast.error("Failed to save measurements");
            }
        } catch (e) {
             toast.error("An error occurred");
        }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer hover:bg-yellow-500/20 transition-colors mt-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                        <Ruler className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                            Check AI Fit Size
                        </div>
                        <div className="text-xs text-muted-foreground">Personalized sizing recommendation</div>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>AI Fit Analysis</DialogTitle>
                <DialogDescription>
                    Enter your measurements for a personalized size recommendation.
                </DialogDescription>
            </DialogHeader>

            {!result ? (
                <div className="space-y-4 py-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Height (cm)</Label>
                            <Input placeholder="e.g. 175" value={height} onChange={e => setHeight(e.target.value)} type="number" />
                        </div>
                        <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input placeholder="e.g. 70" value={weight} onChange={e => setWeight(e.target.value)} type="number" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Body Type</Label>
                        <Select value={bodyType} onValueChange={setBodyType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select body type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="slim">Slim / Ectomorph</SelectItem>
                                <SelectItem value="athletic">Athletic / Mesomorph</SelectItem>
                                <SelectItem value="curvy">Curvy</SelectItem>
                                <SelectItem value="broad">Broad / Endomorph</SelectItem>
                                <SelectItem value="average">Average</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="flex gap-2">
                         <Button onClick={handleSaveMeasurements} variant="outline" className="w-full flex gap-2">
                             <Save className="h-4 w-4" /> Save
                         </Button>
                         <Button onClick={handleAnalyze} disabled={loading} className="w-full bg-yellow-500 text-black hover:bg-yellow-600">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze Fit'}
                         </Button>
                     </div>
                </div>
            ) : (
                <div className="space-y-4 py-4">
                     <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                         <div className="text-sm font-medium text-yellow-800 mb-1">Recommended Size</div>
                         <div className="text-4xl font-bold text-yellow-600 mb-2">{result.recommendedSize}</div>
                         <div className="text-sm text-yellow-700/80 text-center">{result.confidence} Confidence</div>
                     </div>

                     <div className="space-y-3">
                         <h4 className="text-sm font-semibold">Fit Details</h4>
                         <p className="text-sm text-muted-foreground leading-relaxed">
                             {result.reasoning}
                         </p>

                         <div className="mt-4 p-3 bg-muted/50 rounded-md">
                             <div className="text-xs font-medium mb-2">Expected Fit</div>
                             <div className="flex justify-between text-xs text-muted-foreground">
                                 <span>Tight</span>
                                 <span>Perfect</span>
                                 <span>Loose</span>
                             </div>
                             <div className="w-full h-2 bg-gray-200 rounded-full mt-1 relative overflow-hidden">
                                  <div
                                    className="absolute top-0 h-full bg-yellow-500 rounded-full"
                                    style={{
                                        left: result.fitType === 'tight' ? '10%' : result.fitType === 'loose' ? '80%' : '45%',
                                        width: '10%'
                                    }}
                                  />
                             </div>
                         </div>
                     </div>
                     <Button onClick={() => setResult(null)} variant="outline" className="w-full mt-4">
                         Recalculate
                     </Button>
                </div>
            )}
        </DialogContent>
    </Dialog>
  );
}
