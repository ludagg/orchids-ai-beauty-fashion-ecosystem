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
  Settings,
  AlertCircle,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Booking {
  id: string;
  user: {
    name: string;
    image: string | null;
    email: string;
  };
  service: {
    name: string;
  };
  startTime: Date;
  status: string;
}

interface DashboardStatsProps {
  stats: {
    revenue: number;
    pending: number;
    upcoming: number;
    customers: number;
  };
  upcomingBookings: Booking[];
  salonName: string;
}

export default function BusinessDashboardStats({ stats, upcomingBookings, salonName }: DashboardStatsProps) {

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Pending Requests",
      value: stats.pending.toString(),
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-500/10"
    },
    {
      label: "Upcoming Bookings",
      value: stats.upcoming.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-500/10"
    },
    {
      label: "Total Customers",
      value: stats.customers.toString(),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10"
    },
  ];

  return (
    <div className="space-y-8 bg-background p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good Morning, {salonName}</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening at your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground">Accepting Bookings</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
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
            <Link href="/business/appointments" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-2xl">
                    <p className="text-muted-foreground">No upcoming appointments.</p>
                </div>
            ) : (
                upcomingBookings.map((booking, i) => (
                <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                     {booking.user.image ? (
                        <img src={booking.user.image} alt={booking.user.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                            {booking.user.name.charAt(0)}
                        </div>
                     )}
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{booking.user.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{booking.service.name}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {format(new Date(booking.startTime), 'h:mm a')}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "confirmed" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                        {booking.status}
                    </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors hidden sm:block" />
                </motion.div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-card text-foreground space-y-6 border border-border shadow-sm">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Service", icon: Scissors, href: "/business/services" },
                { label: "Settings", icon: Settings, href: "/business/settings" },
                { label: "Customers", icon: Users, href: "/business/customers" },
                { label: "New Offer", icon: Star, href: "/business/marketing" }, // Placeholder
              ].map((action) => (
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
              Adding real photos of your latest work can increase booking rates by up to 40%. Try updating your gallery today!
            </p>
            <Link href="/business/settings?tab=photos" className="block w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 text-center">
              Update Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
