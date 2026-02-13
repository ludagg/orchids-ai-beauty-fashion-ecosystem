"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  XCircle,
  Truck,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { bookings, orders } from "../data";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const booking = bookings.find((b) => b.id === id);
  const order = orders.find((o) => o.id === id);

  const item = booking || order;

  if (!item) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Item not found</p>
      </div>
    );
  }

  // Render logic for Booking
  if (booking) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto w-full bg-background">
        <Link href="/app/bookings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>

        <div className="space-y-6">
           {/* Detailed View */}
           <div className="bg-card rounded-[40px] border border-border p-8 shadow-sm">
             {/* Header */}
             <div className="flex flex-col md:flex-row gap-8">
               <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden bg-muted">
                 <img src={booking.image} alt={booking.salon} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 space-y-6">
                 <div>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {booking.status}
                   </span>
                   <h1 className="text-3xl font-bold text-foreground mt-4 mb-2">{booking.salon}</h1>
                   <p className="text-rose-600 font-bold uppercase tracking-widest">{booking.service}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {/* Date/Time */}
                    <div className="p-4 rounded-2xl bg-muted">
                      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">Date</p>
                      <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-foreground" />
                         <span className="font-bold text-foreground">{booking.date}</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted">
                      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">Time</p>
                      <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-foreground" />
                         <span className="font-bold text-foreground">{booking.time}</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground font-medium">{booking.address}</p>
                 </div>
               </div>
             </div>

             {/* Actions */}
             <div className="mt-8 flex flex-wrap gap-4">
                <button className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
                <button className="flex-1 py-4 rounded-2xl border border-border hover:bg-muted transition-all font-bold">
                  Reschedule
                </button>
                <button className="py-4 px-6 rounded-2xl border border-border hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Render logic for Order
  if (order) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto w-full bg-background">
        <Link href="/app/bookings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>

        <div className="bg-card rounded-[40px] border border-border p-8 shadow-sm">
             <div className="flex flex-col md:flex-row gap-8">
               <div className="w-full md:w-1/3 aspect-[3/4] rounded-[32px] overflow-hidden bg-muted">
                 <img src={order.image} alt={order.item} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 space-y-6">
                 <div className="flex justify-between items-start">
                   <div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">{order.item}</h1>
                     <p className="text-rose-600 font-bold uppercase tracking-widest">{order.designer}</p>
                     <p className="text-xs font-bold text-muted-foreground mt-2">{order.id}</p>
                   </div>
                   <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                      {order.status}
                   </span>
                 </div>

                 <div className="p-6 rounded-3xl bg-muted flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-blue-500 shadow-sm border border-border">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{order.delivery}</p>
                      <p className="text-xs text-muted-foreground font-medium">Your package is on its way to the delivery center.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                       <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">Order Date</p>
                       <p className="font-bold text-foreground">{order.date}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                       <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">Payment</p>
                       <p className="font-bold text-foreground">Visa •••• 4242</p>
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-4 pt-4">
                    <button className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all">
                      Track Package
                    </button>
                    <button className="flex-1 py-4 rounded-2xl border border-border hover:bg-muted transition-all font-bold">
                      Download Invoice
                    </button>
                    <button className="py-4 px-6 rounded-2xl border border-border hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Return
                    </button>
                 </div>
               </div>
             </div>
        </div>
      </div>
    );
  }

  return null;
}
