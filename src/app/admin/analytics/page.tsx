"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  PieChart,
  Activity,
  Globe
} from "lucide-react";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from "recharts";

const performanceData = [
  { name: "Jan", marketplace: 450000, salons: 240000 },
  { name: "Feb", marketplace: 520000, salons: 210000 },
  { name: "Mar", marketplace: 480000, salons: 310000 },
  { name: "Apr", marketplace: 610000, salons: 420000 },
  { name: "May", marketplace: 750000, salons: 380000 },
  { name: "Jun", marketplace: 980000, salons: 540000 },
];

const categoryData = [
  { name: "Fashion", value: 45, color: "#6366f1" },
  { name: "Beauty", value: 25, color: "#ec4899" },
  { name: "Salons", value: 20, color: "#10b981" },
  { name: "Others", value: 10, color: "#f59e0b" },
];

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 6 Months");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into platform growth and revenue metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-card border border-border text-muted-foreground rounded-xl text-sm font-bold hover:bg-secondary transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Dataset
          </button>
        </div>
      </div>

      {/* High-level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "GMV", value: "₹4.2M", change: "+18%", trend: "up", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Active Users", value: "18.5k", change: "+12%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Conversion Rate", value: "3.2%", change: "-0.5%", trend: "down", icon: Activity, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Avg. Order Value", value: "₹4,850", change: "+5%", trend: "up", icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s, i) => (
          <div key={s.label} className="p-6 bg-card rounded-2xl border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${s.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {s.change} {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[32px] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-foreground text-lg">Revenue Growth</h3>
              <p className="text-xs text-muted-foreground mt-1">Comparison between Marketplace & Salon bookings</p>
            </div>
            <select className="px-4 py-2 bg-secondary border-transparent rounded-lg text-xs font-bold text-muted-foreground outline-none">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSalons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="marketplace" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMarket)" />
                <Area type="monotone" dataKey="salons" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSalons)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-8 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-muted-foreground">Marketplace</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-muted-foreground">Salon Bookings</span>
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="p-8 bg-card border border-border rounded-[32px] shadow-sm flex flex-col">
          <h3 className="font-bold text-foreground text-lg mb-8">Sales by Category</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-bold text-muted-foreground">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution Preview */}
      <div className="p-8 rounded-[40px] bg-slate-900 dark:bg-card text-white relative overflow-hidden group border border-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[80px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <Globe className="w-6 h-6" />
              <h3 className="text-xl font-bold font-display">Regional Performance</h3>
            </div>
            <p className="text-slate-300 dark:text-muted-foreground max-w-sm leading-relaxed">
              Your platform is expanding rapidly in Tier-2 cities. Bangalore and Mumbai remain your strongest markets with 64% of total volume.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top City</p>
                <p className="text-lg font-bold">Bangalore</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fastest Growth</p>
                <p className="text-lg font-bold text-emerald-400">Pune</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 aspect-square bg-slate-800 dark:bg-secondary rounded-3xl border border-slate-700 dark:border-border flex items-center justify-center p-8">
             {/* Map Placeholder */}
             <div className="relative w-full h-full opacity-40">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                <div className="w-full h-full border-2 border-indigo-500/20 rounded-full" />
                <div className="absolute inset-4 border border-indigo-500/10 rounded-full" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
