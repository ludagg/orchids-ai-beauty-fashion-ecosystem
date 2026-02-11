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
  Info
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

const services = [
  { id: 1, name: "Signature Haircut", duration: "45 min", price: "₹800", description: "Precision cut, wash, and style tailored to your face shape." },
  { id: 2, name: "Hair Coloring (Global)", duration: "120 min", price: "₹3,500", description: "Full head color using premium ammonia-free products." },
  { id: 3, name: "Deep Conditioning Spa", duration: "60 min", price: "₹1,800", description: "Intense hydration treatment for damaged or dry hair." },
  { id: 4, name: "Beard Grooming & Styling", duration: "30 min", price: "₹500", description: "Trim, shape, and hot towel finish for a sharp look." }
];

const gallery = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop"
];

export default function SalonDetailsPage() {
  const { id } = useParams();
  const [selectedService, setSelectedService] = useState(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <Link
        href="/app/salons"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Salons
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover and Gallery */}
          <section className="space-y-4">
            <div className="aspect-[21/9] rounded-[40px] overflow-hidden bg-[#f5f5f5] border border-[#e5e5e5] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1200&h=600&fit=crop"
                alt="Salon Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-[#1a1a1a] transition-colors cursor-pointer group">
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
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                    Verified Partner
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    4.9 (420 reviews)
                  </div>
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold font-display tracking-tight text-[#1a1a1a]">Aura Luxury Spa</h1>
                <div className="flex items-center gap-2 text-[#6b6b6b] mt-2">
                  <MapPin className="w-4 h-4" />
                  <p className="text-base">123, 100 Feet Rd, Indiranagar, Bangalore</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-2xl border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all">
                  <Phone className="w-5 h-5 text-[#6b6b6b]" />
                </button>
                <button className="p-3 rounded-2xl border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all">
                  <Globe className="w-5 h-5 text-[#6b6b6b]" />
                </button>
                <button className="p-3 rounded-2xl border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-all">
                  <Instagram className="w-5 h-5 text-[#6b6b6b]" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8 py-6 border-y border-[#e5e5e5]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Opening Hours</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">10:00 AM - 09:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Available Slots</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">8 slots left today</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold font-display">About the Salon</h3>
              <p className="text-[#6b6b6b] leading-relaxed text-lg">
                Aura Luxury Spa offers a premium grooming experience in the heart of Indiranagar.
                Our team of expert stylists and therapists use only the finest international products
                to ensure you look and feel your best. We specialize in contemporary haircuts,
                rejuvenating spa treatments, and professional grooming for all genders.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Free Wi-Fi", "Valet Parking", "Air Conditioned", "Loyalty Program"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#1a1a1a] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-2xl font-semibold font-display">Services</h3>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                      selectedService === service.id
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-[#e5e5e5] bg-white hover:border-blue-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-[#1a1a1a]">{service.name}</h4>
                        <p className="text-sm text-[#6b6b6b] mt-1">{service.description}</p>
                      </div>
                      <p className="font-bold text-xl text-blue-600">{service.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#6b6b6b] uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedService === service.id ? "border-blue-600 bg-blue-600" : "border-[#e5e5e5]"
                      }`}>
                        {selectedService === service.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-8 rounded-[40px] bg-white border border-[#e5e5e5] shadow-2xl shadow-black/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold font-display">Book Appointment</h3>
              <p className="text-sm text-[#6b6b6b]">Select your preferred date and time.</p>
            </div>

            {/* Date Selection (Simplified) */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Select Date</p>
              <div className="grid grid-cols-4 gap-2">
                {[12, 13, 14, 15].map((day, i) => (
                  <button
                    key={day}
                    className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
                      i === 0 ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200" : "border-[#e5e5e5] hover:border-[#1a1a1a]"
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
              <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Available Slots</p>
              <div className="grid grid-cols-2 gap-2">
                {["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"].map((time, i) => (
                  <button
                    key={time}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      i === 1 ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-[#e5e5e5] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#f5f5f5] space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[#6b6b6b]">Service Total</p>
                <p className="font-bold">{services.find(s => s.id === selectedService)?.price}</p>
              </div>
              <div className="flex items-center justify-between text-emerald-600">
                <p className="text-sm">Booking Fee</p>
                <p className="font-bold">₹0 (Free)</p>
              </div>
              <div className="flex items-center justify-between text-lg font-bold pt-2">
                <p>Total</p>
                <p>{services.find(s => s.id === selectedService)?.price || "₹800"}</p>
              </div>
            </div>

            <button className="w-full h-14 rounded-2xl bg-[#1a1a1a] text-white font-bold text-lg hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3">
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
