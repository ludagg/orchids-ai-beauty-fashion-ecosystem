"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Navigation, CheckCircle2, XCircle } from "lucide-react";
import { bookings } from "@/app/app/bookings/data";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Booking not found</h2>
        <Link href="/app/bookings" className="text-primary hover:underline">
          Return to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto w-full bg-background">
      <Link href="/app/bookings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Bookings</span>
      </Link>

      <div className="bg-card rounded-[40px] border border-border p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden bg-muted">
                <img src={booking.image} alt={booking.salon} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">{booking.salon}</h1>
                        {booking.status === 'Completed' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                    </div>
                    <p className="text-rose-600 font-bold uppercase tracking-widest text-sm">{booking.service}</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                        booking.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                        {booking.status}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">ID: {booking.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-foreground shadow-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</p>
                            <p className="text-sm font-bold text-foreground">{booking.date}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-foreground shadow-sm">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time</p>
                            <p className="text-sm font-bold text-foreground">{booking.time}</p>
                        </div>
                    </div>
                </div>

                 <div className="pt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Location</p>
                    <p className="text-base font-medium text-foreground">{booking.address}</p>
                 </div>
            </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-wrap items-center gap-3">
            <button className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
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
      </div>
    </div>
  );
}
