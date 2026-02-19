"use client";

import { motion } from "framer-motion";
import {
  User,
  Building2,
  Bell,
  Lock,
  CreditCard,
  MapPin,
  Clock,
  Camera,
  ChevronRight,
  Globe,
  Scissors,
  ShieldCheck,
  Smartphone,
  Settings,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useBusiness } from "@/hooks/use-business";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SalonSettingsPage() {
  const { salon, refreshSalon, loading } = useBusiness();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    zipCode: "",
    image: ""
  });

  useEffect(() => {
    if (salon) {
      setFormData({
        name: salon.name || "",
        description: salon.description || "",
        email: salon.email || "",
        phone: salon.phone || "",
        website: salon.website || "",
        address: salon.address || "",
        city: salon.city || "",
        zipCode: salon.zipCode || "",
        image: salon.image || ""
      });
    }
  }, [salon]);

  const handleSave = async () => {
    if (!salon?.id) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/salons/${salon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to update settings");

      toast.success("Settings updated successfully");
      refreshSalon();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "Profile", icon: Building2 },
    { id: "Account", icon: User },
    { id: "Operations", icon: Clock },
    { id: "Notifications", icon: Bell },
    { id: "Security", icon: Lock },
    { id: "Payments", icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-background">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your salon profile and dashboard preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Navigation */}
        <aside className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-white shadow-xl shadow-foreground/10"
                  : "bg-card border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.id}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`} />
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <main className="flex-1 space-y-8 pb-20">
          {activeTab === "Profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Profile Photo */}
              <section className="p-8 bg-card border border-border rounded-[40px] space-y-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground">Salon Profile</h3>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-muted shadow-2xl">
                      {formData.image ? (
                        <img src={formData.image} alt="Salon" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-foreground text-white shadow-xl hover:scale-110 transition-all">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="font-bold text-foreground">Salon Branding</h4>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      This will be displayed on the customer app. Recommended size: 800x800px.
                    </p>
                    <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                      <div className="flex flex-col w-full max-w-xs gap-2">
                        <input
                            type="text"
                            placeholder="Image URL..."
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            className="px-4 py-2 text-xs rounded-xl bg-muted border-transparent focus:bg-background focus:border-border outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Salon Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Description</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all resize-none text-foreground"
                    />
                  </div>
                </div>
              </section>

              <section className="p-8 bg-card border border-border rounded-[40px] space-y-6 shadow-sm">
                <h3 className="text-xl font-bold text-foreground">Location & Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">City</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Zip Code</label>
                    <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all text-foreground"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab !== "Profile" && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-[32px] bg-muted flex items-center justify-center">
                <Settings className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{activeTab} Settings</h2>
                <p className="text-muted-foreground mt-1 max-w-xs">Settings for {activeTab} are coming soon.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
