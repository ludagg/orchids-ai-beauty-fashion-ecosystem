"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Calendar,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle2,
  IndianRupee,
  Users,
  Award
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const salonData = {
  id: "1",
  name: "Aura Luxury Spa",
  location: "Indiranagar, Bangalore",
  address: "123, 100 Feet Road, Indiranagar, Bangalore - 560038",
  rating: 4.9,
  reviews: 420,
  phone: "+91 98765 43210",
  website: "www.auraluxuryspa.com",
  hours: "9:00 AM - 9:00 PM",
  images: [
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=600&fit=crop"
  ],
  tags: ["Spa", "Facial", "Massage", "Hair Treatment"],
  isVerified: true
};

const services = [
  {
    id: "1",
    name: "Premium Haircut & Styling",
    description: "Expert haircut with wash and styling",
    price: 1500,
    duration: 60,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Hydra Facial Treatment",
    description: "Deep cleansing and hydrating facial",
    price: 3500,
    duration: 90,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Full Body Massage",
    description: "Relaxing Swedish massage therapy",
    price: 2800,
    duration: 75,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Manicure & Pedicure",
    description: "Complete nail care treatment",
    price: 1200,
    duration: 45,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
  }
];

const reviews = [
  {
    id: "1",
    user: "Priya Sharma",
    avatar: "https://i.pravatar.cc/100?u=1",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely loved the ambiance and service quality. The staff is very professional and courteous."
  },
  {
    id: "2",
    user: "Rahul Kapoor",
    avatar: "https://i.pravatar.cc/100?u=2",
    rating: 5,
    date: "1 week ago",
    comment: "Best salon experience in Bangalore. Highly recommend their hair treatment services!"
  },
  {
    id: "3",
    user: "Anjali Desai",
    avatar: "https://i.pravatar.cc/100?u=3",
    rating: 4,
    date: "2 weeks ago",
    comment: "Great service and clean facility. The massage was incredibly relaxing."
  }
];

export default function SalonDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      {/* Image Gallery */}
      <div className="relative h-[60vh] bg-black">
        <img
          src={salonData.images[selectedImage]}
          alt={salonData.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Image Thumbnails */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {salonData.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === i ? "border-white scale-110" : "border-white/40 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="p-3 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white transition-all shadow-xl">
            <Heart className="w-5 h-5 text-[#1a1a1a]" />
          </button>
          <button className="p-3 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white transition-all shadow-xl">
            <Share2 className="w-5 h-5 text-[#1a1a1a]" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Salon Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">{salonData.name}</h1>
                    {salonData.isVerified && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-100" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[#6b6b6b] mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{salonData.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{salonData.rating}</span>
                      <span className="text-xs">({salonData.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Award className="w-4 h-4" />
                      <span className="font-bold text-xs">Top Rated</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {salonData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg bg-[#f5f5f5] text-[11px] font-bold text-[#6b6b6b] uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-[#f5f5f5]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c4c4c4] font-bold uppercase tracking-wider">Hours</p>
                    <p className="text-sm font-bold text-[#1a1a1a]">{salonData.hours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c4c4c4] font-bold uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-bold text-[#1a1a1a]">{salonData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c4c4c4] font-bold uppercase tracking-wider">Website</p>
                    <p className="text-sm font-bold text-[#1a1a1a] truncate">{salonData.website}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-[#6b6b6b] leading-relaxed">
                  Experience luxury and relaxation at Aura Luxury Spa, where we combine traditional wellness
                  techniques with modern spa treatments. Our expert therapists are dedicated to providing you
                  with the ultimate pampering experience in a serene and tranquil environment.
                </p>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedService === service.id
                        ? "border-[#1a1a1a] bg-[#fafafa]"
                        : "border-[#e5e5e5] hover:border-[#c4c4c4]"
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#1a1a1a] mb-1">{service.name}</h3>
                        <p className="text-xs text-[#6b6b6b] mb-2">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1a1a1a] flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {service.price}
                          </span>
                          <span className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Customer Reviews</h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-[#f5f5f5] last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f5f5f5]">
                        <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-[#1a1a1a]">{review.user}</h4>
                            <p className="text-xs text-[#6b6b6b]">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#6b6b6b] leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-xl sticky top-8 space-y-6"
            >
              <h3 className="text-xl font-bold text-[#1a1a1a]">Book Appointment</h3>

              {/* Selected Service */}
              {selectedService && (
                <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e5e5e5]">
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-1">
                    Selected Service
                  </p>
                  <p className="font-bold text-[#1a1a1a]">
                    {services.find(s => s.id === selectedService)?.name}
                  </p>
                  <p className="text-sm font-bold text-[#1a1a1a] mt-2 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {services.find(s => s.id === selectedService)?.price}
                  </p>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((time) => (
                    <button
                      key={time}
                      className="px-3 py-2.5 rounded-xl border-2 border-[#e5e5e5] hover:border-[#1a1a1a] text-sm font-bold transition-all"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Link href="/app/salons/booking">
                <button
                  disabled={!selectedService}
                  className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Book Appointment
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>

              <div className="pt-4 border-t border-[#f5f5f5] space-y-3">
                <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
                  Why Book With Us
                </p>
                {[
                  "Instant confirmation",
                  "Easy rescheduling",
                  "Secure payment"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#6b6b6b]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
