"use client";

import { use } from "react";
import { bookings } from "../data";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  XCircle,
  Phone,
  MessageCircle,
  Star
} from "lucide-react";
import Link from "next/link";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full bg-background">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/app/bookings" className="inline-flex items-center gap-2 p-2 -ml-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm">Back to Bookings</span>
        </Link>
      </div>

      <div className="bg-card rounded-[40px] border border-border p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden bg-muted relative shadow-inner">
                <img src={booking.image} alt={booking.salon} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    <span className="text-[10px] font-bold text-foreground">4.8</span>
                </div>
            </div>

            <div className="flex-1 space-y-8">
                <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">{booking.salon}</h1>
                            <p className="text-rose-600 font-bold uppercase tracking-widest text-xs mt-2">{booking.service}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-muted/50 border border-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-foreground shadow-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Date</span>
                            <p className="text-sm font-bold text-foreground">{booking.date}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-3xl bg-muted/50 border border-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-foreground shadow-sm">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Time</span>
                            <p className="text-sm font-bold text-foreground">{booking.time}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-muted/50 border border-border flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-foreground shadow-sm shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Location</span>
                        <p className="text-sm font-bold text-foreground leading-relaxed">{booking.address}</p>
                        <button className="mt-4 text-xs font-bold text-primary hover:underline">View on Map</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-10 pt-10 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
                <Navigation className="w-4 h-4" />
                Get Directions
            </button>
            <button className="h-14 rounded-2xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <Phone className="w-4 h-4" />
                Call Salon
            </button>
            <button className="h-14 rounded-2xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <MessageCircle className="w-4 h-4" />
                Message
            </button>
            <button className="h-14 rounded-2xl border border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-200 transition-all font-bold text-sm flex items-center justify-center gap-2 hover:-translate-y-1">
                <XCircle className="w-4 h-4" />
                Cancel Booking
            </button>
        </div>
      </div>
    </div>
  );
}
