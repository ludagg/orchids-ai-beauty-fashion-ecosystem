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
  ArrowRight
} from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹4.8M", change: "+12.5%", trend: "up" },
  { label: "Net Profit", value: "₹2.2M", change: "+8.2%", trend: "up" },
  { label: "Pending Payouts", value: "₹145,000", change: "-2.4%", trend: "down" },
  { label: "Avg. Ticket Size", value: "₹1,450", change: "+4.1%", trend: "up" },
];

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Earnings</h1>
          <p className="text-[#6b6b6b] mt-1">Track your revenue and financial performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e5e5] bg-white text-sm font-bold hover:bg-[#f5f5f5] transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] text-white text-sm font-bold hover:bg-[#333] transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white border border-[#e5e5e5] rounded-[32px] shadow-sm"
          >
            <p className="text-sm font-bold text-[#6b6b6b] uppercase tracking-widest mb-4">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-[#1a1a1a]">{stat.value}</h3>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-white border border-[#e5e5e5] rounded-[40px] shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Revenue Overview</h3>
              <p className="text-sm text-[#6b6b6b] mt-1">Daily revenue performance</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-[#f5f5f5] text-[#1a1a1a]">
                <BarChart3 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl hover:bg-[#f5f5f5] text-[#6b6b6b]">
                <PieChart className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 60, 40, 75, 55, 90, 65, 80, 50, 70, 85, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 1 }}
                  className="w-full max-w-[40px] bg-blue-600/10 hover:bg-blue-600 rounded-t-xl transition-colors cursor-pointer group relative"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(val * 1000).toLocaleString()}
                  </div>
                </motion.div>
                <span className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-tighter">Sep {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-[#1a1a1a] text-white rounded-[40px] shadow-xl">
            <h3 className="text-xl font-bold mb-6">Payout Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Next Payout</p>
                  <p className="text-lg font-bold mt-1">₹45,200</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">In Progress</p>
                  <p className="text-xs mt-1 font-medium">Scheduled for Oct 1st</p>
                </div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-white text-[#1a1a1a] font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                Request Instant Payout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[40px]">
            <h3 className="text-lg font-bold text-emerald-900 mb-4">Earnings Tip</h3>
            <p className="text-sm text-emerald-700 leading-relaxed mb-6">
              Clients who purchase a "Membership Package" visit 2.5x more often. Try creating a combo offer to boost recurring revenue.
            </p>
            <button className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all text-sm">
              Create Combo Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
