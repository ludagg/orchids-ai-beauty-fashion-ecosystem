"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  MoreVertical,
  MessageCircle,
  Phone,
  Navigation,
  XCircle,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw
} from "lucide-react";
import { useState } from "react";

const bookings = [
  {
    id: "BK-1024",
    salon: "Aura Luxury Spa",
    service: "Premium Haircut",
    date: "Sunday, Oct 26",
    time: "10:30 AM",
    status: "Confirmed",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=200&h=200&fit=crop",
    address: "12th Main, Indiranagar, Bangalore"
  },
  {
    id: "BK-1025",
    salon: "The Grooming Co.",
    service: "Beard Styling",
    date: "Wednesday, Oct 22",
    time: "02:15 PM",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop",
    address: "Koramangala 4th Block, Bangalore"
  }
];

const orders = [
  {
    id: "ORD-9042",
    item: "Summer Minimalist Dress",
    designer: "Studio Épure",
    status: "In Transit",
    date: "Ordered Oct 21",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop",
    delivery: "Expected by Oct 25"
  }
];

export default function BookingsAndOrdersPage() {
  const [activeTab, setActiveTab] = useState("Bookings");

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Reservations & Orders</h1>
          <p className="text-muted-foreground mt-1">Track your salon bookings and marketplace orders.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-muted/50 p-1.5 rounded-[20px] w-fit border border-border">
          {["Bookings", "Orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab ? "bg-card text-foreground shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Bookings" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-[40px] border border-border hover:border-primary p-8 transition-all shadow-sm hover:shadow-xl hover:shadow-black/5 dark:shadow-white/5"
              >
                <div className="flex gap-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] overflow-hidden bg-muted flex-shrink-0">
                    <img src={booking.image} alt={booking.salon} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground truncate">{booking.salon}</h3>
                          {booking.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className="text-rose-600 font-bold uppercase tracking-widest text-[10px] mt-1">{booking.service}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Date</p>
                          <p className="text-xs font-bold text-foreground">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Time</p>
                          <p className="text-xs font-bold text-foreground">{booking.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                  <button className="flex-1 h-14 rounded-2xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-all">
                    Reschedule
                  </button>
                  <button className="h-14 w-14 rounded-2xl border border-border flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all group/cancel">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-[40px] border border-border p-8 flex flex-col md:flex-row gap-8 hover:border-primary transition-all"
              >
                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={order.image} alt={order.item} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-foreground">{order.item}</h3>
                        <span className="text-xs font-bold text-muted-foreground/60">{order.id}</span>
                      </div>
                      <p className="text-sm text-rose-600 font-bold uppercase tracking-widest">{order.designer}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                        {order.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">{order.date}</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-muted flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-blue-500 shadow-sm">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{order.delivery}</p>
                      <p className="text-xs text-muted-foreground font-medium">Your package is on its way to the delivery center.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <button className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all">Track Order</button>
                    <button className="px-8 py-4 rounded-2xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-all">Order Details</button>
                    <button className="px-8 py-4 rounded-2xl border border-border text-foreground font-bold text-sm hover:bg-rose-500/10 hover:text-rose-600 transition-all flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Return
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
