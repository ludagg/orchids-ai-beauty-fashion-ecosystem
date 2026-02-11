"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Scissors,
  IndianRupee,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Star,
  Settings
} from "lucide-react";

const stats = [
  { label: "Today's Bookings", value: "12", change: "+4", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Customers", value: "842", change: "+24", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Monthly Revenue", value: "₹1.4M", change: "+15%", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg. Rating", value: "4.9", change: "0.1", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
];

export default function SalonDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Good Morning, Aura Spa</h1>
          <p className="text-[#6b6b6b] mt-1">Here&apos;s what&apos;s happening at your salon today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#e5e5e5] rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium">Accepting Bookings</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-[#6b6b6b]">{stat.label}</p>
              <p className="text-2xl font-bold text-[#1a1a1a] mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1a1a1a] text-lg">Upcoming Appointments</h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">View Calendar</button>
          </div>

          <div className="space-y-4">
            {[
              { customer: "Rahul Sharma", service: "Premium Haircut", time: "10:30 AM", status: "Confirmed", image: "11" },
              { customer: "Priya Patel", service: "Hydra Facial", time: "11:15 AM", status: "Confirmed", image: "12" },
              { customer: "Anita Desai", service: "Full Body Massage", time: "12:00 PM", status: "Waiting", image: "13" },
              { customer: "Vikram Singh", service: "Beard Styling", time: "01:30 PM", status: "Confirmed", image: "14" },
            ].map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white border border-[#e5e5e5] rounded-2xl hover:border-blue-200 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f5f5f5]">
                  <img src={`https://i.pravatar.cc/100?u=${app.image}`} alt={app.customer} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#1a1a1a] truncate">{app.customer}</h4>
                  <p className="text-sm text-[#6b6b6b] truncate">{app.service}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#1a1a1a]">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {app.time}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    app.status === "Confirmed" ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {app.status}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#c4c4c4] group-hover:text-blue-600 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-[#1a1a1a] text-white space-y-6">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Service", icon: Scissors },
                { label: "New Offer", icon: Star },
                { label: "Customers", icon: Users },
                { label: "Settings", icon: Settings },
              ].map((action) => (
                <button
                  key={action.label}
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex flex-col items-center gap-2 text-center"
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Star className="w-5 h-5 fill-current" />
              <h3 className="font-bold">Partner Tip</h3>
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              Adding real photos of your latest work can increase booking rates by up to 40%. Try updating your gallery today!
            </p>
            <button className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
              Update Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
