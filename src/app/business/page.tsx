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
  Settings,
  Package
} from "lucide-react";
import { useBusiness } from "@/hooks/use-business";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stats = [
  { label: "Today's Bookings", value: "0", change: "+0", icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10" },
  { label: "Total Customers", value: "0", change: "+0", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  { label: "Monthly Revenue", value: "₹0", change: "+0%", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { label: "Avg. Rating", value: "0.0", change: "0.0", icon: Star, color: "text-amber-600", bg: "bg-amber-500/10" },
];

export default function SalonDashboard() {
  const { salon, loading } = useBusiness();
  const router = useRouter();

  if (loading) return null; // or skeleton

  const quickActions = [
    { label: "Add Service", icon: Scissors, href: "/business/services", show: salon?.type !== "BOUTIQUE" },
    { label: "Add Product", icon: Package, href: "/business/products", show: salon?.type === "BOUTIQUE" || salon?.type === "BOTH" },
    { label: "Customers", icon: Users, href: "/business/customers", show: true },
    { label: "Settings", icon: Settings, href: "/business/settings", show: true },
  ].filter(a => a.show);

  return (
    <div className="space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good Morning, {salon?.name || "Partner"}</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening at your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground">Open for Business</span>
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
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
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
            <h3 className="font-bold text-foreground text-lg">Activity Feed</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>

          <div className="space-y-4">
             <div className="p-8 text-center bg-card border border-border rounded-2xl text-muted-foreground">
                <p>No activity yet.</p>
             </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-card text-foreground space-y-6 border border-border shadow-sm">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-all flex flex-col items-center gap-2 text-center"
                >
                  <action.icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Star className="w-5 h-5 fill-current" />
              <h3 className="font-bold">Partner Tip</h3>
            </div>
            <p className="text-sm text-blue-900/80 dark:text-blue-100/80 leading-relaxed">
              Complete your profile and add all your services to attract more customers.
            </p>
            <Link href="/business/settings" className="block w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 text-center">
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
