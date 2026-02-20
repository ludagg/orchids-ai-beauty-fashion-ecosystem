"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OpeningHour {
  dayOfWeek: number;
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  isClosed: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface SalonHoursManagerProps {
  salonId: string;
}

export function SalonHoursManager({ salonId }: SalonHoursManagerProps) {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, [salonId]);

  const fetchHours = async () => {
    try {
      const res = await fetch(`/api/salons/${salonId}/hours`);
      if (res.ok) {
        const data = await res.json();
        let initializedHours;

        if (Array.isArray(data) && data.length > 0) {
            initializedHours = DAYS.map((_, i) => {
                const found = data.find((h: any) => h.dayOfWeek === i);
                return found ? {
                    dayOfWeek: i,
                    openTime: found.openTime || "09:00",
                    closeTime: found.closeTime || "18:00",
                    isClosed: found.isClosed
                } : { dayOfWeek: i, openTime: "09:00", closeTime: "18:00", isClosed: true };
            });
        } else {
             // Default: Mon-Fri open, Sat-Sun closed
            initializedHours = DAYS.map((_, i) => ({
                dayOfWeek: i,
                openTime: "09:00",
                closeTime: "18:00",
                isClosed: i === 0 || i === 6
            }));
        }
        setHours(initializedHours);
      }
    } catch (error) {
      console.error("Failed to fetch hours", error);
      toast.error("Failed to load hours");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/salons/${salonId}/hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hours),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Hours updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hours");
    } finally {
      setSaving(false);
    }
  };

  const updateDay = (dayIndex: number, field: keyof OpeningHour, value: any) => {
    setHours(prev => prev.map(h => h.dayOfWeek === dayIndex ? { ...h, [field]: value } : h));
  };

  if (loading) return <div>Loading hours...</div>;

  // Sort for display: Mon (1) -> Sun (0)
  const sortedHours = [...hours].sort((a, b) => {
    const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return dayA - dayB;
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {sortedHours.map((day) => (
          <div key={day.dayOfWeek} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="w-24 font-medium">{DAYS[day.dayOfWeek]}</div>

            <div className="flex-1 flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        id={`closed-${day.dayOfWeek}`}
                        checked={!day.isClosed}
                        onCheckedChange={(checked) => updateDay(day.dayOfWeek, "isClosed", !checked)}
                    />
                    <Label htmlFor={`closed-${day.dayOfWeek}`} className="text-sm text-muted-foreground w-16">
                        {day.isClosed ? "Closed" : "Open"}
                    </Label>
                </div>

                {!day.isClosed && (
                    <div className="flex items-center gap-2">
                        <Input
                            type="time"
                            value={day.openTime}
                            onChange={(e) => updateDay(day.dayOfWeek, "openTime", e.target.value)}
                            className="w-32"
                        />
                        <span>to</span>
                        <Input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => updateDay(day.dayOfWeek, "closeTime", e.target.value)}
                            className="w-32"
                        />
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </div>
    </div>
  );
}
