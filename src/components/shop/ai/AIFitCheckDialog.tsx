"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ruler, ChevronRight, AlertCircle, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AIFitCheckDialogProps {
  productId: string;
}

export function AIFitCheckDialog({ productId }: AIFitCheckDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [measurements, setMeasurements] = useState({ height: '', weight: '', bodyType: '' });
  const [fitData, setFitData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchMeasurements = async () => {
    try {
      const res = await fetch('/api/users/profile/measurements');
      if (res.ok) {
        const data = await res.json();
        setMeasurements({
          height: data.height || '',
          weight: data.weight || '',
          bodyType: data.bodyType || ''
        });
        // If we have some data, trigger fit analysis immediately
        if (data.height || data.weight || data.bodyType) {
            analyzeFit(data);
        } else {
            setIsEditing(true); // Prompt to fill
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const analyzeFit = async (dataToUse = measurements) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId,
            height: dataToUse.height,
            weight: dataToUse.weight,
            bodyType: dataToUse.bodyType
        })
      });
      if (res.ok) {
        const json = await res.json();
        setFitData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeasurements = async () => {
      setSaving(true);
      try {
        const res = await fetch('/api/users/profile/measurements', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurements)
        });
        if (res.ok) {
            setIsEditing(false);
            analyzeFit();
        }
      } catch (err) {
          console.error(err);
      } finally {
          setSaving(false);
      }
  };

  useEffect(() => {
    if (open && !fitData && !loading) {
        fetchMeasurements();
    }
  }, [open]);

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
                        Will it fit me?
                    </div>
                    <div className="text-xs text-muted-foreground">Tap for AI Fit Check</div>
                </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-yellow-500" />
            AI Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            We analyze your measurements and the brand's sizing to find your perfect fit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
            {/* Profile Section */}
            <div className="bg-muted/30 p-4 rounded-xl border space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Your Measurements</h3>
                    {!isEditing && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Height</Label>
                                <Input
                                    placeholder="e.g. 5'8 or 170cm"
                                    className="h-8 text-sm"
                                    value={measurements.height}
                                    onChange={e => setMeasurements({...measurements, height: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Weight</Label>
                                <Input
                                    placeholder="e.g. 140lbs or 65kg"
                                    className="h-8 text-sm"
                                    value={measurements.weight}
                                    onChange={e => setMeasurements({...measurements, weight: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Body Type</Label>
                            <Input
                                placeholder="e.g. Athletic, Curvy, Slim"
                                className="h-8 text-sm"
                                value={measurements.bodyType}
                                onChange={e => setMeasurements({...measurements, bodyType: e.target.value})}
                            />
                        </div>
                        <Button
                            className="w-full h-8 text-sm bg-yellow-500 hover:bg-yellow-600 text-black"
                            onClick={handleSaveMeasurements}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save & Analyze Fit"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block text-xs">Height</span>
                            <span className="font-medium">{measurements.height || '--'}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs">Weight</span>
                            <span className="font-medium">{measurements.weight || '--'}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs">Body Type</span>
                            <span className="font-medium">{measurements.bodyType || '--'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Section */}
            {!isEditing && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-3">
                            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Calculating perfect size...</p>
                        </div>
                    ) : fitData ? (
                        <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-6 text-center space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/20">
                                <div
                                    className="h-full bg-yellow-500"
                                    style={{ width: `${fitData.matchScore || 80}%` }}
                                />
                            </div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Recommended Size</p>
                            <div className="text-5xl font-black text-foreground">
                                {fitData.recommendedSize}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed px-4">
                                {fitData.explanation}
                            </p>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border text-xs font-medium mt-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {fitData.matchScore || 80}% Match Confidence
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 text-muted-foreground">
                            <AlertCircle className="w-8 h-8 opacity-50" />
                            <p className="text-sm">Unable to load fit data</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
