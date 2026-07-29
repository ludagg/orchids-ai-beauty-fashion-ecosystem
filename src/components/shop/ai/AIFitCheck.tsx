"use client";

import { useState, useEffect } from "react";
import { Ruler, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

export function AIFitCheck({ product }: { product: any }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bodyType: "",
  });

  useEffect(() => {
    if (session?.user) {
      setMeasurements({
        height: session.user.height || "",
        weight: session.user.weight || "",
        bodyType: session.user.bodyType || "",
      });
    }
  }, [session]);

  const handleUpdateMeasurements = async () => {
    try {
      await fetch("/api/users/profile/measurements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });
    } catch (e) {
      console.error("Failed to update measurements", e);
    }
  };

  const handleFitCheck = async () => {
    if (!measurements.height || !measurements.weight || !measurements.bodyType) {
      toast.error("Veuillez remplir toutes vos mensurations pour une estimation précise.");
      return;
    }

    setLoading(true);
    try {
      if (session?.user) {
         await handleUpdateMeasurements();
      }

      const res = await fetch("/api/ai-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, measurements }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'analyse");

      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      toast.error("Impossible de calculer la taille recommandée.");
    } finally {
      setLoading(false);
    }
  };

  if (!product || product.productType !== "PHYSICAL") return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Ruler className="w-4 h-4" />
          <span>AI Fit Check - Trouver ma taille</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            AI Fit Intelligence
          </DialogTitle>
          <DialogDescription>
            Renseignez vos mensurations pour obtenir une recommandation de taille ultra-précise basée sur la coupe de ce produit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              type="number"
              value={measurements.height}
              onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
              placeholder="ex: 175"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={measurements.weight}
              onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
              placeholder="ex: 65"
            />
          </div>
          <div className="grid gap-2">
            <Label>Morphologie</Label>
            <Select
              value={measurements.bodyType}
              onValueChange={(value) => setMeasurements({ ...measurements, bodyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slim">Mince (Slim)</SelectItem>
                <SelectItem value="athletic">Athlétique (Athletic)</SelectItem>
                <SelectItem value="average">Moyenne (Average)</SelectItem>
                <SelectItem value="curvy">Généreuse (Curvy/Stocky)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleFitCheck} disabled={loading} className="w-full mt-2">
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              "Calculer ma taille idéale"
            )}
          </Button>

          {recommendation && (
            <div className="mt-4 p-4 rounded-xl border bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    Taille Recommandée : {recommendation.size}
                    <Badge variant={recommendation.confidence > 80 ? "default" : "secondary"}>
                      {recommendation.confidence}% de confiance
                    </Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {recommendation.reasoning}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs flex items-center gap-1 text-muted-foreground">
                <AlertCircle className="w-3 h-3" />
                Rendu estimé : <span className="font-medium text-foreground">{recommendation.fitEstimate}</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
