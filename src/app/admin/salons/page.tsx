"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Star,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  BarChart3
} from "lucide-react";
import { useState } from "react";

const salons = [
  { id: 1, name: "Aura Luxury Spa", owner: "Sonia Gupta", location: "Bangalore", rating: 4.9, revenue: "₹1.4M", status: "Active", image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=200&h=200&fit=crop" },
  { id: 2, name: "The Grooming Co.", owner: "Vikram Singh", location: "Mumbai", rating: 4.8, revenue: "₹850k", status: "Active", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop" },
  { id: 3, name: "Elite Beauty Hub", owner: "Anita Desai", location: "Delhi", rating: 4.7, revenue: "₹2.1M", status: "Pending", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop" },
  { id: 4, name: "Nature's Touch", owner: "Rahul Sharma", location: "Bangalore", rating: 4.9, revenue: "₹1.2M", status: "Active", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop" },
];

export default function AdminSalonsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partner Salons</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage salon partner performance.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Onboard New Salon
        </button>
      </div>

      {/* Salon Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Partners", value: "842", sub: "+12 this month", color: "text-blue-600" },
          { label: "Total Revenue (MoM)", value: "₹42.5M", sub: "+18.4% growth", color: "text-emerald-600" },
          { label: "Avg. Partner Rating", value: "4.85", sub: "Based on 12k reviews", color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="p-6 bg-card rounded-2xl border border-border shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by salon name or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border focus:border-indigo-500 rounded-lg text-sm transition-all outline-none shadow-sm text-foreground"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-bold text-muted-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <select className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-bold text-muted-foreground outline-none">
            <option>All Locations</option>
            <option>Bangalore</option>
            <option>Mumbai</option>
            <option>Delhi</option>
          </select>
        </div>
      </div>

      {/* Salons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salons.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card p-6 rounded-3xl border border-border hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all"
          >
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg truncate">{s.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {s.location}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {s.rating}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="text-xs font-bold text-muted-foreground">
                    Owner: <span className="text-foreground">{s.owner}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Revenue</p>
                <p className="text-xl font-bold text-foreground mt-1">{s.revenue}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 transition-all">
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                  Partner Dashboard <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
