"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Scissors,
  ArrowUpRight,
  PieChart,
  LineChart,
  Calendar,
  Download
} from "lucide-react";

export default function AnalyticsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time insights across the Priisme ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" />
            Last Quarter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross GMV", value: "₹42.5M", change: "+15.2%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Active Users", value: "84.2k", change: "+5.4%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Marketplace Sales", value: "₹18.2M", change: "+12.8%", icon: ShoppingBag, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Salon Bookings", value: "12,450", change: "+8.9%", icon: Scissors, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-xs font-bold ${stat.color}`}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Growth Projection</h3>
            <LineChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-medium italic">
            Chart Visualization Area
          </div>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Revenue Distribution</h3>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-medium italic">
            Chart Visualization Area
          </div>
        </div>
      </div>
    </div>
  );
}
