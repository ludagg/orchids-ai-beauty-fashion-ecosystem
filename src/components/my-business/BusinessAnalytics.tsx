"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, CalendarCheck, Star } from "lucide-react";

const revenueData = [
  { month: "Aug", revenue: 18000 },
  { month: "Sep", revenue: 22000 },
  { month: "Oct", revenue: 19500 },
  { month: "Nov", revenue: 28000 },
  { month: "Dec", revenue: 32000 },
  { month: "Jan", revenue: 26000 },
  { month: "Feb", revenue: 31000 },
];

const bookingsData = [
  { day: "Mon", bookings: 4 },
  { day: "Tue", bookings: 7 },
  { day: "Wed", bookings: 5 },
  { day: "Thu", bookings: 9 },
  { day: "Fri", bookings: 12 },
  { day: "Sat", bookings: 15 },
  { day: "Sun", bookings: 8 },
];

const stats = [
  { label: "Total Revenue", value: "₹31,000", change: "+18%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Total Bookings", value: "60", change: "+12%", icon: CalendarCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "New Clients", value: "24", change: "+8%", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  { label: "Avg. Rating", value: "4.8", change: "+0.2", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
];

interface Props {
  salonName: string;
}

export function BusinessAnalytics({ salonName }: Props) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{salonName} — performance overview</p>
        </div>
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                period === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue (Last 7 Months)</CardTitle>
            <CardDescription className="text-xs">Monthly revenue in ₹</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bookings This Week</CardTitle>
            <CardDescription className="text-xs">Daily booking volume</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bookingsData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [v, "Bookings"]}
                />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
