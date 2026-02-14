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
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number; // in cents
  duration: number; // in minutes
}

const gallery = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop"
];

export default function SalonDetailsPage() {
  const { id } = useParams();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [salonRes, servicesRes] = await Promise.all([
          fetch(`/api/salons/${id}`),
          fetch(`/api/salons/${id}/services`)
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

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
              {gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border hover:border-foreground transition-colors cursor-pointer group">
                  <img src={img} alt="Interior" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    5.0 (0 reviews)
                  </div>
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold font-display tracking-tight text-foreground">{salon.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  <p className="text-base">{salon.address}, {salon.city}</p>
                </div>
              </div>
              <div className="flex gap-2">
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
                  <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Opening Hours</p>
                  <p className="text-sm font-bold text-foreground">10:00 AM - 09:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Available Slots</p>
                  <p className="text-sm font-bold text-foreground">8 slots left today</p>
                </div>
              </div>
            </div>

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
          </section>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-8 rounded-[40px] bg-card border border-border shadow-2xl shadow-foreground/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold font-display">Book Appointment</h3>
              <p className="text-sm text-muted-foreground">Select your preferred date and time.</p>
            </div>

            {/* Date Selection (Simplified) */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Select Date</p>
              <div className="grid grid-cols-4 gap-2">
                {[12, 13, 14, 15].map((day, i) => (
                  <button
                    key={day}
                    className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
                      i === 0 ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200" : "border-border hover:border-foreground"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-1">{i === 0 ? "Today" : ["Wed", "Thu", "Fri"][i-1]}</span>
                    <span className="text-lg font-bold">{day}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Available Slots</p>
              <div className="grid grid-cols-2 gap-2">
                {["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"].map((time, i) => (
                  <button
                    key={time}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      i === 1 ? "border-foreground bg-foreground text-white" : "border-border hover:border-foreground"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
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
              disabled={!selectedService}
              className={`w-full h-14 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 ${
                selectedService
                  ? "bg-foreground text-white hover:bg-blue-600 shadow-foreground/10"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              Confirm Booking
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
