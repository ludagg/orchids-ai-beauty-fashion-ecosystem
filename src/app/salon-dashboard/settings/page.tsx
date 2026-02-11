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
  Smartphone
} from "lucide-react";
import { useState } from "react";

export default function SalonSettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    { id: "Profile", icon: Building2 },
    { id: "Account", icon: User },
    { id: "Operations", icon: Clock },
    { id: "Notifications", icon: Bell },
    { id: "Security", icon: Lock },
    { id: "Payments", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Settings</h1>
        <p className="text-[#6b6b6b] mt-1">Manage your salon profile and dashboard preferences.</p>
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
                  ? "bg-[#1a1a1a] text-white shadow-xl shadow-black/10"
                  : "bg-white border border-[#e5e5e5] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
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
              <section className="p-8 bg-white border border-[#e5e5e5] rounded-[40px] space-y-8">
                <h3 className="text-xl font-bold text-[#1a1a1a]">Salon Profile</h3>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-[#f5f5f5] shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=200&h=200&fit=crop" alt="Salon" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-[#1a1a1a] text-white shadow-xl hover:scale-110 transition-all">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="font-bold text-[#1a1a1a]">Salon Branding</h4>
                    <p className="text-sm text-[#6b6b6b] max-w-xs">
                      This will be displayed on the customer app. Recommended size: 800x800px.
                    </p>
                    <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                      <button className="px-5 py-2.5 rounded-xl bg-[#f5f5f5] text-[#1a1a1a] text-xs font-bold hover:bg-[#e5e5e5] transition-all">Replace</button>
                      <button className="px-5 py-2.5 rounded-xl text-rose-600 text-xs font-bold hover:bg-rose-50 transition-all">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest px-1">Salon Name</label>
                    <input type="text" defaultValue="Aura Luxury Spa" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] outline-none text-sm font-medium transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest px-1">Email Address</label>
                    <input type="email" defaultValue="hello@auraspa.com" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] outline-none text-sm font-medium transition-all" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest px-1">Description</label>
                    <textarea rows={4} className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] outline-none text-sm font-medium transition-all resize-none" defaultValue="Premium luxury spa and salon experience in the heart of Bangalore. Specializing in organic skin treatments and high-end grooming." />
                  </div>
                </div>
              </section>

              <section className="p-8 bg-white border border-[#e5e5e5] rounded-[40px] space-y-6">
                <h3 className="text-xl font-bold text-[#1a1a1a]">Location & Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest px-1">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
                      <input type="text" defaultValue="+91 98765 43210" className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] outline-none text-sm font-medium transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest px-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
                      <input type="text" defaultValue="www.auraspa.com" className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] outline-none text-sm font-medium transition-all" />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-[#6b6b6b] uppercase tracking-widest px-1">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
                      <input type="text" defaultValue="12th Main, Indiranagar, Bangalore, 560038" className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] outline-none text-sm font-medium transition-all" />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-4">
                <button className="px-8 py-4 rounded-2xl text-sm font-bold text-[#6b6b6b] hover:bg-[#f5f5f5] transition-all">Cancel</button>
                <button className="px-8 py-4 rounded-2xl bg-[#1a1a1a] text-white text-sm font-bold hover:bg-[#333] shadow-xl shadow-black/10 transition-all">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeTab !== "Profile" && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-[32px] bg-[#f5f5f5] flex items-center justify-center">
                <Settings className="w-8 h-8 text-[#c4c4c4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1a1a1a]">{activeTab} Settings</h2>
                <p className="text-[#6b6b6b] mt-1 max-w-xs">Settings for {activeTab} are coming soon.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
