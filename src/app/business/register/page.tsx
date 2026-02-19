"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Scissors, ShoppingBag, ArrowRight, Check, Loader2, Store, ArrowLeft } from "lucide-react";
import Link from "next/link";

type BusinessType = "SALON" | "BOUTIQUE";

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "details">("type");
  const [selectedType, setSelectedType] = useState<BusinessType | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    website: "",
  });

  const handleTypeSelect = (type: BusinessType) => {
    setSelectedType(type);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setLoading(true);

    try {
      const endpoint = selectedType === "BOUTIQUE" ? "/api/shops" : "/api/salons";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.businessName,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          // phone and website might need schema update or ignored for now
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
            toast.error("Please sign in to continue.");
            router.push("/auth/sign-in?callbackUrl=/business/register");
            return;
        }
        const data = await res.json();
        throw new Error(data.error || "Failed to register business");
      }

      const data = await res.json();
      toast.success("Business registered successfully!");

      // Redirect to the dashboard
      let redirectUrl = `/app/creator-studio/partner-dashboard?type=${selectedType}&businessName=${encodeURIComponent(formData.businessName)}`;
      if (selectedType === "SALON") {
          redirectUrl += `&salonId=${data.id}`;
      } else {
          redirectUrl += `&shopId=${data.id}`;
      }

      router.push(redirectUrl);

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-10">
        <Link href="/business" className="text-2xl font-script text-foreground">Rare Business</Link>
        <Link href="/business">
          <Button variant="ghost" size="sm">Cancel</Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === "type" ? (
            <motion.div
              key="type-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full text-center space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold font-display">Choose your business type</h1>
                <p className="text-muted-foreground text-lg">Select the category that best describes your services.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                <button
                  onClick={() => handleTypeSelect("SALON")}
                  className="group relative flex flex-col items-center p-8 rounded-3xl border-2 border-border hover:border-primary/50 bg-card hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <Scissors className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Service Provider</h3>
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    For salons, spas, stylists, and wellness centers offering appointments.
                  </p>
                  <div className="mt-auto px-4 py-2 rounded-full bg-secondary text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Select Salon
                  </div>
                </button>

                <button
                  onClick={() => handleTypeSelect("BOUTIQUE")}
                  className="group relative flex flex-col items-center p-8 rounded-3xl border-2 border-border hover:border-primary/50 bg-card hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Retailer</h3>
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    For boutiques, brands, and shops selling fashion or beauty products.
                  </p>
                  <div className="mt-auto px-4 py-2 rounded-full bg-secondary text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Select Shop
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-xl bg-card border rounded-3xl p-8 shadow-sm"
            >
              <button
                onClick={() => setStep("type")}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to type selection
              </button>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4">
                  {selectedType === "SALON" ? <Scissors className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                  {selectedType === "SALON" ? "Service Provider" : "Retailer"}
                </div>
                <h2 className="text-2xl font-bold">Business Details</h2>
                <p className="text-muted-foreground">Tell us about your establishment.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder={selectedType === "SALON" ? "e.g. Luxe Beauty Lounge" : "e.g. Urban Chic Boutique"}
                    required
                    minLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Briefly describe your services or products..."
                    required
                    minLength={10}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            placeholder="e.g. New York"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            placeholder="e.g. 10001"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="e.g. 123 Fashion Ave, Suite 404"
                    required
                    minLength={5}
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
