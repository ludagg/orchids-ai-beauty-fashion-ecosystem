"use client";

import { motion } from "framer-motion";
import {
  Store,
  Clock,
  Bell,
  Lock,
  CreditCard,
  Users,
  Camera,
  ChevronRight,
  Globe,
  MapPin,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { useState } from "react";

const sections = [
  { id: "salon", label: "Salon Profile", icon: Store },
  { id: "hours", label: "Business Hours", icon: Clock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team Members", icon: Users },
  { id: "payouts", label: "Payout Settings", icon: CreditCard },
  { id: "security", label: "Security", icon: ShieldCheck }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("salon");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Settings</h1>
        <p className="text-[#6b6b6b] mt-1">Manage your salon business settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                  activeSection === section.id
                    ? "bg-white text-[#1a1a1a] shadow-xl shadow-black/5 border border-[#e5e5e5]"
                    : "text-[#6b6b6b] hover:bg-white hover:text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeSection === section.id ? "bg-blue-600 text-white" : "bg-[#f5f5f5] group-hover:bg-[#e5e5e5]"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-widest">{section.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeSection === section.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
                }`} />
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] border border-[#e5e5e5] shadow-sm overflow-hidden"
          >
            {activeSection === "salon" && (
              <div className="p-8 sm:p-12 space-y-10">
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-[#f5f5f5]">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] bg-[#f5f5f5] p-1 border-2 border-dashed border-[#e5e5e5]">
                      <div className="w-full h-full rounded-[36px] bg-white p-1 overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop"
                          alt="Salon"
                          className="w-full h-full object-cover rounded-[32px]"
                        />
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-[#1a1a1a] text-white shadow-xl hover:scale-110 transition-all">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">Aura Luxury Spa</h3>
                    <p className="text-[#6b6b6b] font-medium">Premium Salon in Koramangala, Bangalore</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Partner
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Salon Name</label>
                    <input
                      type="text"
                      defaultValue="Aura Luxury Spa"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-blue-600 transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="hello@auraspa.in"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-blue-600 transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91 80 4567 8900"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-blue-600 transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Website</label>
                    <input
                      type="url"
                      defaultValue="https://auraspa.in"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-blue-600 transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Full Address</label>
                    <textarea
                      rows={3}
                      defaultValue="123, 4th Block, Koramangala, Bangalore, Karnataka 560034"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-blue-600 transition-all outline-none font-bold resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#f5f5f5] flex justify-end gap-4">
                  <button className="px-8 py-4 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] font-bold hover:bg-[#e5e5e5] transition-all">
                    Discard Changes
                  </button>
                  <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                    Save Profile
                  </button>
                </div>
              </div>
            )}

            {activeSection !== "salon" && (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto text-[#c4c4c4]">
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)!.icon;
                    return <Icon className="w-10 h-10" />;
                  })()}
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] uppercase tracking-widest">{activeSection} Settings Coming Soon</h3>
                <p className="text-[#6b6b6b] max-w-xs mx-auto text-sm font-medium">We're working on making these settings available for you. Stay tuned!</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
