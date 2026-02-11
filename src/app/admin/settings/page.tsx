"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Database,
  Lock,
  ChevronRight,
  LogOut,
  User,
  Smartphone
} from "lucide-react";
import { useState } from "react";

const sections = [
  { id: "general", label: "General Settings", icon: Settings },
  { id: "security", label: "Security & Auth", icon: Lock },
  { id: "notifications", label: "System Notifications", icon: Bell },
  { id: "api", label: "API & Integrations", icon: Database },
  { id: "compliance", label: "Compliance & Legal", icon: Shield }
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
        <p className="text-slate-500 text-sm">Configure system-wide parameters and administrative preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{section.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeSection === section.id ? "translate-x-1" : "opacity-0"
                }`} />
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >
            {activeSection === "general" && (
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="Priisme"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Email</label>
                    <input
                      type="email"
                      defaultValue="admin@priisme.com"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button className="px-6 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-all">
                    Reset
                  </button>
                  <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection !== "general" && (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)!.icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activeSection} Content Coming Soon</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">We're finalizing the administrative controls for this section.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
