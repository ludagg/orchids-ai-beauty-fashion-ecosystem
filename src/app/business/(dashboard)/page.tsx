"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Scissors,
  IndianRupee,
  Clock,
  ChevronRight,
  Star,
  Settings
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Today's Bookings", value: "12", change: "+4", icon: Calendar },
  { label: "Total Customers", value: "842", change: "+24", icon: Users },
  { label: "Monthly Revenue", value: "₹1.4M", change: "+15%", icon: IndianRupee },
  { label: "Avg. Rating", value: "4.9", change: "0.1", icon: Star },
];

export default function SalonDashboard() {
  return (
    <div className="space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good Morning, Aura Spa</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening at your salon today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground">Accepting Bookings</span>
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
            className="p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-muted text-foreground">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-lg">
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-lg">Upcoming Appointments</h3>
            <Link href="/business/appointments" className="text-sm font-bold text-primary hover:underline">View Calendar</Link>
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
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <img src={`https://i.pravatar.cc/100?u=${app.image}`} alt={app.customer} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground truncate">{app.customer}</h4>
                  <p className="text-sm text-muted-foreground truncate">{app.service}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {app.time}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    app.status === "Confirmed" ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {app.status}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-card text-foreground space-y-6 border border-border shadow-sm">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Service", icon: Scissors, href: "/business/services" },
                { label: "New Offer", icon: Star, href: "/business/services" },
                { label: "Customers", icon: Users, href: "/business/customers" },
                { label: "Settings", icon: Settings, href: "/business/settings" },
              ].map((action) => (
                <Link
                  href={action.href}
                  key={action.label}
                  className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-all flex flex-col items-center gap-2 text-center"
                >
                  <action.icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Star className="w-5 h-5 fill-current" />
              <h3 className="font-bold">Partner Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adding real photos of your latest work can increase booking rates by up to 40%. Try updating your gallery today!
            </p>
            <button className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-foreground/10">
              Update Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
