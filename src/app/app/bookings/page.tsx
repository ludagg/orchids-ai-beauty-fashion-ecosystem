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
  RotateCcw,
  Loader2,
  ShoppingBag
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

interface Booking {
  id: string;
  salonId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  salon: {
    name: string;
    image: string | null;
    address: string;
    city: string;
  };
  service: {
    name: string;
  };
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: {
        quantity: number;
        product: {
            name: string;
            images: string[] | null;
            salon: {
                name: string;
                city: string;
            } | null;
        };
    }[];
}

export default function BookingsAndOrdersPage() {
  const [activeTab, setActiveTab] = useState("Bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [bookingsRes, ordersRes] = await Promise.all([
            fetch('/api/bookings'),
            fetch('/api/orders')
        ]);

        if (bookingsRes.ok) {
          setBookings(await bookingsRes.json());
        }
        if (ordersRes.ok) {
            setOrders(await ordersRes.json());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setProcessingId(bookingId);
    try {
        const res = await fetch(`/api/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' })
        });

        if (res.ok) {
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
            toast.success("Booking cancelled successfully");
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to cancel booking");
        }
    } catch (error) {
        console.error("Cancellation error:", error);
        toast.error("Something went wrong");
    } finally {
        setProcessingId(null);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full bg-background">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Reservations & Orders</h1>
          <p className="text-muted-foreground mt-1">Track your salon bookings and marketplace orders.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-muted p-1.5 rounded-[20px] w-fit border border-border">
          {["Bookings", "Orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab ? "bg-card text-foreground shadow-lg shadow-foreground/5" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
             </div>
        ) : activeTab === "Bookings" ? (
          bookings.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No bookings found.</p>
              <Link href="/app/salons" className="text-primary hover:underline mt-2 inline-block">Book an appointment</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`group bg-card rounded-[40px] border border-border hover:border-foreground p-8 transition-all shadow-sm hover:shadow-xl hover:shadow-foreground/5 ${
                    booking.status === 'cancelled' ? 'opacity-60 grayscale' : ''
                  }`}
                >
                  <div className="flex gap-6 cursor-pointer">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={booking.salon.image || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=200&h=200&fit=crop"}
                        alt={booking.salon.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground truncate">{booking.salon.name}</h3>
                            {booking.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                          <p className="text-rose-600 font-bold uppercase tracking-widest text-[10px] mt-1">{booking.service.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' :
                          booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                          booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-emerald-500/10 text-emerald-500'
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
                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Date</p>
                            <p className="text-xs font-bold text-foreground">{format(new Date(booking.startTime), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Time</p>
                            <p className="text-xs font-bold text-foreground">{format(new Date(booking.startTime), 'h:mm a')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </button>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button className="flex-1 h-14 rounded-2xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-all">
                            Reschedule
                        </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={processingId === booking.id}
                            className="h-14 w-14 rounded-2xl border border-border flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all group/cancel"
                            title="Cancel Booking"
                        >
                            {processingId === booking.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <XCircle className="w-6 h-6" />}
                        </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          orders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
                <p>No orders found.</p>
                <Link href="/app/marketplace" className="text-primary hover:underline mt-2 inline-block">Browse Marketplace</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {orders.map((order, i) => (
                     <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-card rounded-[40px] border border-border hover:border-foreground p-8 transition-all shadow-sm hover:shadow-xl hover:shadow-foreground/5"
                     >
                        <div className="flex gap-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] overflow-hidden bg-muted flex-shrink-0">
                                <img
                                    src={order.items[0]?.product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop"}
                                    alt={order.items[0]?.product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground truncate">{order.items[0]?.product.name}</h3>
                                        <p className="text-rose-600 font-bold uppercase tracking-widest text-[10px] mt-1">
                                            {order.items[0]?.product.salon?.name || "Marketplace"}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                        order.status === 'reserved' ? 'bg-amber-500/10 text-amber-500' :
                                        order.status === 'ready_for_pickup' ? 'bg-emerald-500/10 text-emerald-500' :
                                        'bg-secondary text-muted-foreground'
                                    }`}>
                                        {order.status === 'reserved' ? 'Reserved' : order.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Qty</p>
                                            <p className="text-xs font-bold text-foreground">{order.items[0]?.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Pickup At</p>
                                            <p className="text-xs font-bold text-foreground truncate">{order.items[0]?.product.salon?.city || "Salon"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                             <div>
                                 <p className="text-xs text-muted-foreground">Total to Pay</p>
                                 <p className="text-lg font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                             </div>
                             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                 <Clock className="w-4 h-4" />
                                 Ordered on {format(new Date(order.createdAt), 'MMM d')}
                             </div>
                        </div>
                     </motion.div>
                ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
