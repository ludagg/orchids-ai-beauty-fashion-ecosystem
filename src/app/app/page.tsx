"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  Heart,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Bell,
  Search,
  User,
  Package,
  Gift
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock Data for Charts
const spendingData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 2100 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 2400 },
  { month: "May", amount: 1600 },
  { month: "Jun", amount: 3200 },
];

const chartConfig = {
  amount: {
    label: "Spending (₹)",
    color: "var(--primary)",
  },
};

// Mock Data for Tabs
const appointments = [
  { id: 1, salon: "Aura Luxury Spa", service: "Hair Spa & Styling", date: "Today", time: "14:00", status: "Confirmed" },
  { id: 2, salon: "The Grooming Co.", service: "Manicure", date: "Tomorrow", time: "11:00", status: "Pending" },
];

const orders = [
  { id: "#ORD-7721", items: "Silk Evening Gown", date: "2 days ago", status: "Shipped", total: "₹15,999" },
  { id: "#ORD-7720", items: "Velvet Blazer", date: "1 week ago", status: "Delivered", total: "₹6,299" },
];

// Existing Mock Data (Preserved & Enhanced)
const featuredCollections = [
  {
    title: "Summer Minimalist",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    price: "₹4,999"
  },
  {
    title: "Artisan Silk",
    designer: "Kalyan Heritage",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop",
    price: "₹12,499"
  },
  {
    title: "Urban Techwear",
    designer: "Neo-Tokyo",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
    price: "₹7,299"
  }
];

const nearbySalons = [
  {
    name: "Aura Luxury Spa",
    location: "Indiranagar, Bangalore",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop"
  },
  {
    name: "The Grooming Co.",
    location: "Koramangala, Bangalore",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
  }
];

export default function UserDashboard() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">

      {/* 1. Enhanced Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">
            Good Morning, Alex
          </h1>
          <p className="text-muted-foreground mt-1 text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search stylists, salons..."
                    className="pl-9 pr-4 py-2 rounded-full bg-secondary/50 border border-transparent focus:border-primary/20 focus:bg-background outline-none text-sm w-64 transition-all"
                />
            </div>
            <Button variant="outline" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-background"></span>
            </Button>
            <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <AvatarFallback>AL</AvatarFallback>
            </Avatar>
        </div>
      </header>

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-500 to-indigo-600 border-none text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
            <CardHeader className="pb-2">
                <CardDescription className="text-white/70">Total Loyalty Points</CardDescription>
                <CardTitle className="text-4xl font-bold">2,450</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs font-medium bg-white/20 inline-flex items-center px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 mr-1 fill-yellow-300 text-yellow-300" /> Gold Member
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-2">
                <CardDescription>Upcoming Appointment</CardDescription>
                <CardTitle className="text-xl">Today, 14:00</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Hair Spa & Styling</p>
                        <p className="text-xs text-muted-foreground">Aura Luxury Spa</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-2">
                <CardDescription>Active Orders</CardDescription>
                <CardTitle className="text-xl">2 Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Out for Delivery</p>
                        <p className="text-xs text-muted-foreground">Arriving by 6 PM</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="border-dashed border-2 bg-secondary/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full pt-6">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm">
                    <Sparkles className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="font-semibold text-foreground">New Style Quiz</h3>
                <p className="text-xs text-muted-foreground mt-1">Unlock 50 points</p>
            </CardContent>
        </Card>
      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-8">

            {/* Spending Chart Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Spending Overview</CardTitle>
                    <CardDescription>Your spending activity over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={spendingData}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={{fill: 'transparent'}} />
                            <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Management Tabs */}
            <Tabs defaultValue="appointments" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <TabsList>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="appointments" className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/20 text-violet-600 flex items-center justify-center">
                                    <Scissors className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{apt.service}</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <span>{apt.salon}</span> • <span>{apt.date}, {apt.time}</span>
                                    </p>
                                </div>
                            </div>
                            <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"}>
                                {apt.status}
                            </Badge>
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full text-muted-foreground">View All Appointments</Button>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{order.items}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Order {order.id} • {order.date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{order.total}</p>
                                <p className="text-xs text-green-600 font-medium">{order.status}</p>
                            </div>
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full text-muted-foreground">View Order History</Button>
                </TabsContent>

                 <TabsContent value="wishlist">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group relative rounded-xl overflow-hidden border border-border aspect-[3/4]">
                                <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&sig=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button size="sm" variant="secondary">View Item</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Discovery / Marketplace Section */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-rose-500" />
                        Featured Collections
                    </h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">View All <ChevronRight className="w-4 h-4 ml-1" /></Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {featuredCollections.map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3 shadow-sm border border-border">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <Heart className="w-4 h-4 text-foreground" />
                        </button>
                        </div>
                        <h3 className="font-semibold text-sm truncate text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.designer}</p>
                        <p className="font-bold text-sm mt-1 text-rose-600">{item.price}</p>
                    </motion.div>
                    ))}
                </div>
            </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-8">

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
                 {[
                  { title: "Book Salon", icon: Scissors, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                  { title: "AI Stylist", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
                  { title: "Virtual Fit", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
                  { title: "Gift Cards", icon: Gift, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                ].map((action) => (
                    <button key={action.title} className={`flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:shadow-md transition-all ${action.bg}`}>
                        <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
                        <span className="text-sm font-medium text-foreground">{action.title}</span>
                    </button>
                ))}
            </div>

            {/* Promotional Banner (Live Commerce) */}
             <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative rounded-[24px] overflow-hidden bg-foreground text-white p-6 shadow-xl border border-border"
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 font-display leading-tight">Winter Sale Live</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Join top creators & shop instantly.
                  </p>
                  <Button size="sm" variant="secondary" className="w-full rounded-full font-bold">
                    Watch Now <Video className="w-3 h-3 ml-2" />
                  </Button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground via-transparent to-transparent z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
                    alt="Live Commerce"
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
              </motion.div>

            {/* Nearby Salons (Compact) */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">Nearby Salons</h3>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">View Map</Button>
                </div>
                <div className="space-y-4">
                    {nearbySalons.map((salon) => (
                        <div key={salon.name} className="flex gap-3 items-start group cursor-pointer">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-secondary">
                                <img src={salon.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{salon.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3" /> {salon.location}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold mt-1 text-amber-500">
                                    <Star className="w-3 h-3 fill-current" /> {salon.rating}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full rounded-xl">Find More Salons</Button>
            </div>

            {/* Payment Method / Quick Info */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-6 bg-white/20 rounded-md"></div>
                    <CreditCard className="w-5 h-5 text-white/50" />
                </div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Balance</p>
                <h3 className="text-2xl font-mono">₹12,450.00</h3>
            </div>

        </div>
      </div>
    </div>
  );
}
