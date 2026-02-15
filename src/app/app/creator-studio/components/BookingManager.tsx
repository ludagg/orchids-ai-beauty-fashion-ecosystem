import { useState, useEffect } from "react";
import { Loader2, Calendar, Clock, User, CheckCircle2, XCircle, Search, Filter, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  notes: string | null;
}

interface BookingManagerProps {
  salonId: string;
}

export function BookingManager({ salonId }: BookingManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`/api/salons/${salonId}/bookings`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          toast.error("Failed to load bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (salonId) {
      fetchBookings();
    }
  }, [salonId]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 border rounded-3xl border-dashed">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No bookings found</h3>
            <p className="text-muted-foreground text-sm">
              {filterStatus === "all" ? "You haven't received any bookings yet." : `No ${filterStatus} bookings found.`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-6 rounded-3xl bg-card border border-border hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col lg:flex-row gap-6"
            >
              {/* Client Info */}
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {booking.user.image ? (
                        <img src={booking.user.image} alt={booking.user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                            {booking.user.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{booking.user.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Mail className="w-3 h-3" />
                    {booking.user.email}
                  </div>
                   {/* Phone placeholder if available in schema later */}
                </div>
              </div>

              {/* Booking Details */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Service</p>
                    <p className="font-medium text-foreground">{booking.service.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.service.duration} mins</p>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date & Time</p>
                    <p className="font-medium text-foreground">{format(new Date(booking.startTime), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(booking.startTime), 'h:mm a')}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price</p>
                    <p className="font-bold text-primary">{formatPrice(booking.totalPrice)}</p>
                </div>

                <div className="flex justify-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' :
                        booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-rose-500/10 text-rose-500'
                    }`}>
                        {booking.status}
                    </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
