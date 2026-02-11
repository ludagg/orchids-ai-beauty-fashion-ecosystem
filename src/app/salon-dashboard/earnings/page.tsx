"use client";

import { motion } from "framer-motion";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  ArrowRight,
  CheckCircle2
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
  Cell
} from "recharts";

const data = [
  { name: "Mon", revenue: 4500, bookings: 12 },
  { name: "Tue", revenue: 5200, bookings: 15 },
  { name: "Wed", revenue: 4800, bookings: 14 },
  { name: "Thu", revenue: 6100, bookings: 18 },
  { name: "Fri", revenue: 7500, bookings: 22 },
  { name: "Sat", revenue: 9800, bookings: 28 },
  { name: "Sun", revenue: 8400, bookings: 25 },
];

const transactions = [
  { id: "TX-9021", customer: "Rahul Sharma", service: "Premium Haircut", amount: "₹850", status: "Success", time: "2 hours ago" },
  { id: "TX-9022", customer: "Priya Patel", service: "Hydra Facial", amount: "₹2,499", status: "Success", time: "5 hours ago" },
  { id: "TX-9023", customer: "Anita Desai", service: "Full Body Massage", amount: "₹1,800", status: "Pending", time: "7 hours ago" },
  { id: "TX-9024", customer: "Vikram Singh", service: "Beard Styling", amount: "₹450", status: "Success", time: "Yesterday" },
];

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState("Weekly");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Earnings & Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your revenue and business growth metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-border bg-card text-foreground rounded-xl text-sm font-bold hover:bg-muted transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Report
          </button>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-black/10 dark:shadow-white/5">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 rounded-[40px] bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Balance</p>
                <p className="text-5xl font-bold font-display tracking-tight">₹1,24,500</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Last 30 Days</p>
                  <p className="text-lg font-bold flex items-center gap-1.5 text-emerald-400">
                    <ArrowUpRight className="w-4 h-4" />
                    +18.4%
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Bookings</p>
                  <p className="text-lg font-bold">482</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="w-full h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-card border border-border flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>
              <button className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground">Details</button>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Pending Payout</p>
              <p className="text-3xl font-bold text-foreground mt-1">₹14,200</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Expected payout date: <span className="text-foreground font-bold">March 24, 2026</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-[40px] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Revenue Insights
            </h3>
            <div className="flex bg-muted p-1 rounded-xl border border-border">
              {["Weekly", "Monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }} className="text-muted-foreground/40" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }} className="text-muted-foreground/40" />
                <Tooltip
                  cursor={{ fill: 'currentColor', className: 'text-muted/20' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="revenue" fill="currentColor" className="text-foreground" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-[40px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-border">
            <h3 className="font-bold text-foreground text-lg">Recent Transactions</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-muted/30 transition-all rounded-3xl border border-transparent hover:border-border group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{tx.id}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    tx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{tx.customer}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{tx.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{tx.amount}</p>
                    <p className="text-[10px] text-muted-foreground/60 font-bold mt-0.5">{tx.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="p-6 text-center text-sm font-bold text-blue-500 hover:bg-blue-500/10 transition-all border-t border-border">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
