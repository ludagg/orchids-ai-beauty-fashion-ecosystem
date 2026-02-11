"use client";

import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Smartphone,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  CheckCircle2,
  Lock,
  Eye,
  Trash2
} from "lucide-react";
import { useState } from "react";

const sections = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "preferences", label: "Preferences", icon: Smartphone },
  { id: "support", label: "Support", icon: HelpCircle }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#1a1a1a]">Settings</h1>
        <p className="text-[#6b6b6b] mt-1 text-base">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                  activeSection === section.id
                    ? "bg-white text-[#1a1a1a] shadow-xl shadow-black/5 border border-[#e5e5e5]"
                    : "text-[#6b6b6b] hover:bg-white hover:text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeSection === section.id ? "bg-[#1a1a1a] text-white" : "bg-[#f5f5f5] group-hover:bg-[#e5e5e5]"
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

          <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all mt-8 group">
            <div className="p-2 rounded-xl bg-rose-50 group-hover:bg-rose-100">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest">Sign Out</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-8 xl:col-span-9">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] border border-[#e5e5e5] shadow-xl shadow-black/[0.02] overflow-hidden"
          >
            {/* Account Section Content */}
            {activeSection === "account" && (
              <div className="p-8 sm:p-12 space-y-10">
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-[#f5f5f5]">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-violet-500 to-rose-500 p-1">
                      <div className="w-full h-full rounded-[36px] bg-white p-1 overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/300?u=jd"
                          alt="Profile"
                          className="w-full h-full object-cover rounded-[32px]"
                        />
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-[#1a1a1a] text-white shadow-xl hover:scale-110 transition-all">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">Guest User</h3>
                    <p className="text-[#6b6b6b] font-medium">jd.guest@priisme.com</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Account
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Guest User"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Email Address</label>
                    <input
                      type="email"
                      defaultValue="jd.guest@priisme.com"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-[0.2em]">Location</label>
                    <input
                      type="text"
                      defaultValue="Bangalore, India"
                      className="w-full px-6 py-4 rounded-2xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#f5f5f5] flex justify-end gap-4">
                  <button className="px-8 py-4 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] font-bold hover:bg-[#e5e5e5] transition-all">
                    Discard Changes
                  </button>
                  <button className="px-8 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10">
                    Save Profile
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Section Content */}
            {activeSection === "privacy" && (
              <div className="p-8 sm:p-12 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">Security Settings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-[#f5f5f5] border border-transparent hover:border-[#e5e5e5] transition-all">
                      <div className="flex gap-4">
                        <div className="p-3 rounded-2xl bg-white shadow-sm">
                          <Lock className="w-5 h-5 text-[#1a1a1a]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a1a]">Change Password</p>
                          <p className="text-xs text-[#6b6b6b] mt-0.5 font-medium">Update your account password regularly.</p>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 rounded-xl bg-white border border-[#e5e5e5] text-xs font-bold hover:bg-[#1a1a1a] hover:text-white transition-all shadow-sm">
                        Update
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-3xl bg-[#f5f5f5] border border-transparent hover:border-[#e5e5e5] transition-all">
                      <div className="flex gap-4">
                        <div className="p-3 rounded-2xl bg-white shadow-sm">
                          <Smartphone className="w-5 h-5 text-[#1a1a1a]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a1a]">Two-Factor Authentication</p>
                          <p className="text-xs text-[#6b6b6b] mt-0.5 font-medium">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                        Enabled
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-[#f5f5f5]">
                  <h3 className="text-2xl font-bold text-rose-600">Danger Zone</h3>
                  <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-rose-900">Delete Account</p>
                      <p className="text-xs text-rose-700 mt-0.5 font-medium">Permanently remove your account and all data. This cannot be undone.</p>
                    </div>
                    <button className="p-3 rounded-2xl bg-white text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generic Content for other sections */}
            {!["account", "privacy"].includes(activeSection) && (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto">
                  {sections.find(s => s.id === activeSection)?.icon && (
                    <div className="text-[#6b6b6b]">
                      {(() => {
                        const Icon = sections.find(s => s.id === activeSection)!.icon;
                        return <Icon className="w-10 h-10" />;
                      })()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] uppercase tracking-widest">{activeSection} Content Coming Soon</h3>
                <p className="text-[#6b6b6b] max-w-xs mx-auto text-sm font-medium">We're working on making this setting available for you. Stay tuned for updates!</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
