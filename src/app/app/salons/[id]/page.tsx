"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  MapPin,
  Star,
  ChevronLeft,
  Clock,
  Phone,
  Globe,
  Instagram,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronRight,
  Info,
  Loader2,
  Store,
  User,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDays, format, parse } from "date-fns";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/ui/Map"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full rounded-2xl bg-muted animate-pulse flex items-center justify-center text-muted-foreground">Loading Map...</div>
});

interface Salon {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image: string | null;
  isVerified: boolean;
  type: "SALON" | "BOUTIQUE";
  images: { id: string; url: string; caption: string | null }[];
  openingHours: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[];
  latitude?: string | number | null;
  longitude?: string | number | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number; // in cents
  duration: number; // in minutes
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

const defaultGallery = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop"
];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SalonDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (salon) {
      if (salon.latitude && salon.longitude) {
        setCoordinates({
          lat: Number(salon.latitude),
          lng: Number(salon.longitude)
        });
      } else if (salon.address && salon.city) {
        // Fallback geocoding
        const query = encodeURIComponent(`${salon.address}, ${salon.city}`);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.length > 0) {
              setCoordinates({
                lat: Number(data[0].lat),
                lng: Number(data[0].lon)
              });
            }
          })
          .catch(err => console.error("Geocoding error:", err));
      }
    }
  }, [salon]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [salonRes, servicesRes, reviewsRes] = await Promise.all([
          fetch(`/api/salons/${id}`),
          fetch(`/api/salons/${id}/services`),
          fetch(`/api/salons/${id}/reviews`)
        ]);

        if (salonRes.ok) {
          const salonData = await salonRes.json();
          setSalon(salonData);
        }

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
          if (servicesData.length > 0) {
            setSelectedServiceId(servicesData[0].id);
          }
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchAvailability() {
      if (!id || !selectedServiceId || !selectedDate) return;

      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedTimeSlot(null);

      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/bookings/availability?salonId=${id}&serviceId=${selectedServiceId}&date=${dateStr}`);
        if (res.ok) {
          const slots = await res.json();
          setAvailableSlots(slots);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchAvailability();
  }, [id, selectedServiceId, selectedDate]);


  const handleBooking = async () => {
    if (!session) {
      toast.error("Please login to book an appointment");
      router.push("/auth?mode=signin");
      return;
    }

    if (!selectedServiceId || !selectedDate || !selectedTimeSlot) {
        toast.error("Please select a service, date, and time");
        return;
    }

    setBookingLoading(true);

    try {
        const timeParts = parse(selectedTimeSlot, 'hh:mm a', new Date());
        const startTime = new Date(selectedDate);
        startTime.setHours(timeParts.getHours(), timeParts.getMinutes(), 0, 0);

        const selectedService = services.find(s => s.id === selectedServiceId);
        const duration = selectedService?.duration || 30;
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                salonId: id,
                serviceId: selectedServiceId,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                notes: ''
            })
        });

        if (res.ok) {
            toast.success("Booking confirmed successfully!");
            router.push('/app/bookings');
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to create booking");
        }
    } catch (error) {
        console.error("Booking error:", error);
        toast.error("Something went wrong");
    } finally {
        setBookingLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!session) {
      toast.error("Please login to message the salon");
      router.push("/auth?mode=signin");
      return;
    }

    setMessageLoading(true);

    try {
        const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salonId: id })
        });

        if (res.ok) {
            const data = await res.json();
            router.push(`/app/conversations/${data.id}`);
        } else {
            toast.error("Failed to start conversation");
        }
    } catch (error) {
        console.error("Message error:", error);
        toast.error("Something went wrong");
    } finally {
        setMessageLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!session) {
      toast.error("Please login to submit a review");
      router.push("/auth?mode=signin");
      return;
    }

    if (!reviewRating) {
        toast.error("Please select a rating");
        return;
    }

    setSubmittingReview(true);

    try {
        const res = await fetch(`/api/salons/${id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: reviewRating,
                comment: reviewComment
            })
        });

        if (res.ok) {
            const newReview = await res.json();
            // Optimistically add review or refetch.
            // Since the response structure might slightly differ (e.g. user object is not fully populated immediately if not joined),
            // we'll manually construct it for display or just reload reviews.
            // For now, let's just refetch reviews to be safe.
            const reviewsRes = await fetch(`/api/salons/${id}/reviews`);
            if (reviewsRes.ok) {
                setReviews(await reviewsRes.json());
            }

            toast.success("Review submitted successfully!");
            setReviewComment("");
            setReviewRating(5);
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to submit review");
        }
    } catch (error) {
        console.error("Review error:", error);
        toast.error("Something went wrong");
    } finally {
        setSubmittingReview(false);
    }
  };


  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Helper to get formatted hours for today
  const getTodayHours = () => {
    if (!salon?.openingHours) return "10:00 AM - 09:00 PM";
    const todayIndex = new Date().getDay();
    const todayHours = salon.openingHours.find(h => h.dayOfWeek === todayIndex);
    if (!todayHours || todayHours.isClosed) return "Closed Today";
    return `${todayHours.openTime} - ${todayHours.closeTime}`;
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Salon not found</h1>
        <Link href="/app/salons" className="text-primary hover:underline mt-4 block">
          Back to Salons
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <Link
        href="/app/salons"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Salons
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover and Gallery */}
          <section className="space-y-4">
            <div className="aspect-[21/9] rounded-[40px] overflow-hidden bg-muted border border-border shadow-sm">
              <img
                src={salon.image || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1200&h=600&fit=crop"}
                alt="Salon Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {(salon.images && salon.images.length > 0 ? salon.images : defaultGallery).slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border hover:border-foreground transition-colors cursor-pointer group">
                  <img
                    src={typeof img === 'string' ? img : img.url}
                    alt="Interior"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Details */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {salon.isVerified && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                      Verified Partner
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest border border-border">
                    {salon.type}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    {averageRating} ({reviews.length} reviews)
                  </div>
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold font-display tracking-tight text-foreground">{salon.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  <p className="text-base">{salon.address}, {salon.city}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleMessage}
                  disabled={messageLoading}
                  className="p-3 rounded-2xl border border-border hover:bg-muted transition-all disabled:opacity-50"
                  title="Message Salon"
                >
                  {messageLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5 text-muted-foreground" />}
                </button>
                <button className="p-3 rounded-2xl border border-border hover:bg-muted transition-all">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-3 rounded-2xl border border-border hover:bg-muted transition-all">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-3 rounded-2xl border border-border hover:bg-muted transition-all">
                  <Instagram className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Today's Hours</p>
                  <p className="text-sm font-bold text-foreground">{getTodayHours()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Available Slots</p>
                  <p className="text-sm font-bold text-foreground">Check Availability</p>
                </div>
              </div>
            </div>

             {/* Expanded Opening Hours */}
             {salon.openingHours && salon.openingHours.length > 0 && (
                <div className="py-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Weekly Schedule</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {salon.openingHours.map((hours) => (
                      <div key={hours.dayOfWeek} className="p-3 rounded-xl bg-secondary/30 border border-border text-xs">
                        <p className="font-bold text-muted-foreground mb-1">{daysOfWeek[hours.dayOfWeek]}</p>
                        <p className="font-medium text-foreground">
                          {hours.isClosed ? "Closed" : `${hours.openTime} - ${hours.closeTime}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Map Section */}
            {coordinates && (
               <div className="py-4 space-y-3">
                 <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Location</h4>
                 <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border z-0 relative">
                    <Map key={`${coordinates.lat}-${coordinates.lng}`} lat={coordinates.lat} lng={coordinates.lng} popupText={salon.name} />
                 </div>
               </div>
            )}

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold font-display">About the Salon</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {salon.description}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Free Wi-Fi", "Valet Parking", "Air Conditioned", "Loyalty Program"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-2xl font-semibold font-display">Services</h3>
              {services.length === 0 ? (
                <p className="text-muted-foreground">No services available.</p>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                        selectedServiceId === service.id
                          ? "border-blue-600 bg-blue-50/30"
                          : "border-border bg-card hover:border-blue-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        </div>
                        <p className="font-bold text-xl text-blue-600">{formatPrice(service.price)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            {service.duration} min
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedServiceId === service.id ? "border-blue-600 bg-blue-600" : "border-border"
                        }`}>
                          {selectedServiceId === service.id && <div className="w-2 h-2 rounded-full bg-card" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

             {/* Reviews Section */}
             <div className="space-y-8 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold font-display">Reviews</h3>
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30">
                        <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        <span className="font-bold text-amber-700 dark:text-amber-400">{averageRating}</span>
                        <span className="text-sm text-amber-600/80 dark:text-amber-500/80">({reviews.length})</span>
                    </div>
                </div>

                {/* Review Form */}
                {session ? (
                    <div className="p-6 rounded-3xl bg-secondary/30 border border-border space-y-4">
                        <h4 className="font-bold text-lg">Write a Review</h4>
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className="focus:outline-none transition-transform active:scale-90"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            star <= reviewRating
                                            ? "fill-amber-500 text-amber-500"
                                            : "text-muted-foreground"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <Textarea
                            placeholder="Share your experience..."
                            className="bg-card min-h-[100px]"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                             <button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all disabled:opacity-50"
                              >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 rounded-3xl bg-secondary/30 border border-border text-center">
                        <p className="text-muted-foreground mb-4">Log in to leave a review.</p>
                        <Link href="/auth?mode=signin" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-blue-600 transition-all inline-block">
                            Login
                        </Link>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="p-6 rounded-3xl bg-card border border-border">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center text-muted-foreground">
                                            {review.user.image ? (
                                                <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{review.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                    ? "fill-amber-500 text-amber-500"
                                                    : "text-muted-foreground/30"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
             </div>

          </section>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-8 rounded-[40px] bg-card border border-border shadow-2xl shadow-foreground/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold font-display">Book Appointment</h3>
              <p className="text-sm text-muted-foreground">Select your preferred date and time.</p>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Select Date</p>
              <div className="grid grid-cols-4 gap-2">
                {days.map((day, i) => {
                    const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(day)}
                            className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
                            isSelected ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200" : "border-border hover:border-foreground"
                            }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest mb-1">{format(day, 'EEE')}</span>
                            <span className="text-lg font-bold">{format(day, 'd')}</span>
                        </button>
                    )
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Available Slots</p>
              {loadingSlots ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No slots available for this date.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 h-48 overflow-y-auto pr-2 no-scrollbar">
                    {availableSlots.map((time) => (
                    <button
                        key={time}
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedTimeSlot === time ? "border-foreground bg-foreground text-white" : "border-border hover:border-foreground"
                        }`}
                    >
                        {time}
                    </button>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-muted space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Service Total</p>
                <p className="font-bold">{selectedService ? formatPrice(selectedService.price) : "—"}</p>
              </div>
              <div className="flex items-center justify-between text-emerald-600">
                <p className="text-sm">Booking Fee</p>
                <p className="font-bold">₹0 (Free)</p>
              </div>
              <div className="flex items-center justify-between text-lg font-bold pt-2">
                <p>Total</p>
                <p>{selectedService ? formatPrice(selectedService.price) : "—"}</p>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedService || !selectedTimeSlot || bookingLoading}
              className={`w-full h-14 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 ${
                selectedService && selectedTimeSlot && !bookingLoading
                  ? "bg-foreground text-white hover:bg-blue-600 shadow-foreground/10"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CalendarIcon className="w-5 h-5" />}
              {bookingLoading ? "Processing..." : "Confirm Booking"}
            </button>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                You can cancel or reschedule up to 4 hours before the appointment for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
