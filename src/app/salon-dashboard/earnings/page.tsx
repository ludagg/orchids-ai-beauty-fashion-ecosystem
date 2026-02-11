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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Earnings & Analytics</h1>
          <p className="text-[#6b6b6b] mt-1">Track your revenue and business growth metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-[#e5e5e5] bg-white text-[#1a1a1a] rounded-xl text-sm font-bold hover:bg-[#f5f5f5] transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Report
          </button>
          <button className="px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-bold hover:bg-[#333] transition-all shadow-lg shadow-black/10">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 rounded-[40px] bg-[#1a1a1a] text-white relative overflow-hidden">
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

        <div className="p-8 rounded-[40px] bg-white border border-[#e5e5e5] flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>
              <button className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest hover:text-[#1a1a1a]">Details</button>
            </div>
            <div>
              <p className="text-[#6b6b6b] text-sm font-medium">Pending Payout</p>
              <p className="text-3xl font-bold text-[#1a1a1a] mt-1">₹14,200</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#f5f5f5]">
            <p className="text-xs text-[#6b6b6b] leading-relaxed">
              Expected payout date: <span className="text-[#1a1a1a] font-bold">March 24, 2026</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-8 bg-white border border-[#e5e5e5] rounded-[40px] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Revenue Insights
            </h3>
            <div className="flex bg-[#f5f5f5] p-1 rounded-xl border border-[#e5e5e5]">
              {["Weekly", "Monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === t ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#c4c4c4] hover:text-[#6b6b6b]"
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#c4c4c4' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#c4c4c4' }} />
                <Tooltip
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#1a1a1a" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-[#e5e5e5] rounded-[40px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-[#f5f5f5]">
            <h3 className="font-bold text-[#1a1a1a] text-lg">Recent Transactions</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-[#fafafa] transition-all rounded-3xl border border-transparent hover:border-[#f5f5f5] group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">{tx.id}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">{tx.customer}</p>
                    <p className="text-[10px] text-[#6b6b6b] font-medium mt-0.5">{tx.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1a1a1a]">{tx.amount}</p>
                    <p className="text-[10px] text-[#c4c4c4] font-bold mt-0.5">{tx.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="p-6 text-center text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all border-t border-[#f5f5f5]">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
