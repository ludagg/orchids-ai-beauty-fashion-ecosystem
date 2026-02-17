"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Scissors,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalSalons: number;
    pendingSalons: number;
    totalRevenue: number;
    recentTransactions: any[];
  }
}

export default function AdminDashboardClient({ stats: data }: AdminDashboardClientProps) {
  const statsItems = [
    { label: "Total Users", value: data.totalUsers.toLocaleString(), change: "Verified", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, change: "All time", trend: "up", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Partner Salons", value: data.totalSalons.toLocaleString(), change: `${data.pendingSalons} pending`, trend: "neutral", icon: Scissors, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Marketplace Orders", value: "-", change: "See details", trend: "neutral", icon: ShoppingBag, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your ecosystem's performance and growth.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                stat.trend === "up" ? "text-emerald-600" : "text-slate-600"
              }`}>
                {stat.change}
                {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
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
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Recent Transactions</h3>
            <Link href="/admin/marketplace" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentTransactions.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">No recent transactions found.</td>
                    </tr>
                ) : (
                    data.recentTransactions.map((order, i) => (
                    <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                                {order.user?.image ? (
                                    <img src={order.user.image} alt={order.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        {order.user?.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-foreground">{order.user?.name || "Unknown User"}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground">
                            ₹{(order.totalAmount / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === "paid" || order.status === "completed" || order.status === "delivered" ? "bg-emerald-50 text-emerald-700" :
                            order.status === "pending" ? "bg-amber-50 text-amber-700" :
                            "bg-slate-50 text-slate-700"
                        }`}>
                            {order.status}
                        </span>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-6">System Health</h3>
          <div className="space-y-6">
            {[
              { label: "API Gateway", status: "Healthy", color: "bg-emerald-500" },
              { label: "Database (Postgres)", status: "Healthy", color: "bg-emerald-500" },
              { label: "AI Engine", status: "Optimal", color: "bg-indigo-500" },
              { label: "Storage (CDN)", status: "Warning", color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm shadow-foreground/10`} />
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-secondary border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Latest Alert</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Storage usage exceeding 85% on AP-South region. Consider upgrading capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
