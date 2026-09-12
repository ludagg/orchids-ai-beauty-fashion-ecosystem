"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ruler, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIFitCheckDialogProps {
  product: any;
}

export default function AIFitCheckDialog({ product }: AIFitCheckDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Profile state
  const [profile, setProfile] = useState({
      height: "",
      weight: "",
      bodyType: ""
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
      if (isOpen && !profile.height && !profile.weight) {
          fetchProfile();
      }
  }, [isOpen]);

  const fetchProfile = async () => {
      try {
          const res = await fetch("/api/users/profile/measurements");
          if (res.ok) {
              const data = await res.json();
              setProfile({
                  height: data.height || "",
                  weight: data.weight || "",
                  bodyType: data.bodyType || ""
              });
              if (!data.height && !data.weight) {
                  setIsEditingProfile(true);
              } else {
                  analyzeFit(data);
              }
          }
      } catch (error) {
          console.error("Failed to fetch profile", error);
      }
  };

  const saveProfile = async () => {
      setSavingProfile(true);
      try {
          const res = await fetch("/api/users/profile/measurements", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profile)
          });
          if (res.ok) {
              setIsEditingProfile(false);
              analyzeFit(profile);
          }
      } catch (error) {
          console.error("Failed to save profile", error);
      } finally {
          setSavingProfile(false);
      }
  };

  const analyzeFit = async (currentProfile = profile) => {
      setLoading(true);
      try {
          const res = await fetch("/api/ai-fit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  ...currentProfile,
                  product: {
                      name: product.name,
                      category: product.mainCategory,
                      brand: product.brand,
                      sizes: product.sizes
                  }
              })
          });

          if (res.ok) {
              const data = await res.json();
              setResult(data);
          }
      } catch (error) {
          console.error("Fit analysis failed", error);
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
                          <Ruler className="h-4 w-4" />
                      </div>
                      <div>
                          <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                              AI Fit Check <Sparkles className="w-3 h-3" />
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
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Virtual Fit Intelligence
                  </DialogTitle>
                  <DialogDescription>
                      We analyze your measurements and this brand's typical sizing to recommend the perfect fit.
                  </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                  {isEditingProfile ? (
                      <div className="space-y-4">
                          <h3 className="font-medium text-sm">Your Measurements</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-xs text-muted-foreground">Height (cm)</label>
                                  <input
                                      type="number"
                                      className="w-full p-2 border rounded-md bg-background text-sm"
                                      placeholder="170"
                                      value={profile.height}
                                      onChange={(e) => setProfile({...profile, height: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs text-muted-foreground">Weight (kg)</label>
                                  <input
                                      type="number"
                                      className="w-full p-2 border rounded-md bg-background text-sm"
                                      placeholder="65"
                                      value={profile.weight}
                                      onChange={(e) => setProfile({...profile, weight: e.target.value})}
                                  />
                              </div>
                              <div className="col-span-2 space-y-2">
                                  <label className="text-xs text-muted-foreground">Body Type (Optional)</label>
                                  <select
                                      className="w-full p-2 border rounded-md bg-background text-sm"
                                      value={profile.bodyType}
                                      onChange={(e) => setProfile({...profile, bodyType: e.target.value})}
                                  >
                                      <option value="">Select...</option>
                                      <option value="slim">Slim</option>
                                      <option value="athletic">Athletic</option>
                                      <option value="average">Average</option>
                                      <option value="broad">Broad</option>
                                      <option value="curvy">Curvy</option>
                                  </select>
                              </div>
                          </div>
                          <Button
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                              onClick={saveProfile}
                              disabled={savingProfile || !profile.height || !profile.weight}
                          >
                              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Analyze"}
                          </Button>
                      </div>
                  ) : loading ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <div className="w-16 h-16 relative">
                              <div className="absolute inset-0 border-4 border-yellow-200 rounded-full animate-ping opacity-75"></div>
                              <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 rounded-full text-yellow-600">
                                  <Ruler className="w-6 h-6 animate-pulse" />
                              </div>
                          </div>
                          <p className="text-sm text-muted-foreground animate-pulse">Analyzing fit...</p>
                      </div>
                  ) : result ? (
                      <div className="space-y-4">
                          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-6 text-center space-y-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-2">
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                      {result.confidence}% Match
                                  </span>
                              </div>
                              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Recommended Size</p>
                              <div className="text-5xl font-black text-yellow-600 dark:text-yellow-500">
                                  {result.recommendedSize}
                              </div>
                              <p className="text-sm font-medium text-foreground">{result.fitPrediction}</p>
                          </div>

                          <div className="bg-muted p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                  <strong className="text-foreground">Why?</strong> {result.reasoning}
                              </p>
                          </div>

                          <Button
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => setIsEditingProfile(true)}
                          >
                              Update my measurements
                          </Button>
                      </div>
                  ) : null}
              </div>
          </DialogContent>
      </Dialog>
  );
}
