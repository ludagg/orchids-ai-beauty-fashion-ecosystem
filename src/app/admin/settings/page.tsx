"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Lock,
  Globe,
  Database,
  Cpu,
  ShieldCheck,
  Smartphone,
  Mail,
  Users,
  Building2,
  ChevronRight,
  Save,
  Trash2,
  Zap
} from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("System");

  const tabs = [
    { id: "System", icon: Cpu },
    { id: "Access", icon: Lock },
    { id: "Platform", icon: Globe },
    { id: "Notifications", icon: Bell },
    { id: "Database", icon: Database },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform-wide parameters and infrastructure settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Navigation */}
        <aside className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                  : "bg-card border border-border text-muted-foreground hover:border-indigo-400 hover:text-indigo-600"
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
          {activeTab === "System" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* API Configuration */}
              <section className="p-8 bg-card border border-border rounded-[32px] space-y-8 shadow-sm">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-bold">API & Infrastructure</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Environment</label>
                    <select className="w-full px-5 py-3.5 rounded-xl bg-secondary border-transparent focus:bg-card focus:border-border outline-none text-sm font-bold text-foreground transition-all">
                      <option>Production (Stable)</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">AI Engine Region</label>
                    <select className="w-full px-5 py-3.5 rounded-xl bg-secondary border-transparent focus:bg-card focus:border-border outline-none text-sm font-bold text-foreground transition-all">
                      <option>Asia South 1 (Mumbai)</option>
                      <option>US East 1 (N. Virginia)</option>
                      <option>Europe West 1 (Belgium)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Global API Key</label>
                    <div className="relative">
                      <input type="password" readOnly value="********************************" className="w-full px-5 py-3.5 rounded-xl bg-secondary border-transparent outline-none text-sm font-medium transition-all text-foreground" />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:underline">Reveal</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Policy */}
              <section className="p-8 bg-card border border-border rounded-[32px] space-y-6 shadow-sm">
                <div className="flex items-center gap-3 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Security & Compliance</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Two-Factor Authentication", desc: "Require 2FA for all administrator accounts.", active: true },
                    { label: "Automatic Backups", desc: "Backup database and assets every 24 hours.", active: true },
                    { label: "IP Whitelisting", desc: "Restrict admin access to specific IP ranges.", active: false },
                    { label: "Maintenance Mode", desc: "Put the entire platform into maintenance mode.", active: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-secondary border border-border">
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative transition-colors ${item.active ? 'bg-indigo-600' : 'bg-secondary-foreground/20'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-card rounded-full transition-all ${item.active ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-end gap-4">
                <button className="px-8 py-4 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary transition-all">Reset to Defaults</button>
                <button className="px-8 py-4 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Apply System Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab !== "System" && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-[32px] bg-secondary flex items-center justify-center">
                <Settings className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{activeTab} Configuration</h2>
                <p className="text-muted-foreground mt-1 max-w-xs">Settings for {activeTab} are currently being migrated to the new core.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
