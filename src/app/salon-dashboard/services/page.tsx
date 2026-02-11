"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  IndianRupee,
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";

const services = [
  {
    id: 1,
    name: "Premium Haircut",
    category: "Hair",
    duration: "45 min",
    price: "₹800",
    rating: 4.9,
    reviews: 124,
    status: "active",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Hydra Facial",
    category: "Skincare",
    duration: "60 min",
    price: "₹2,500",
    rating: 4.8,
    reviews: 86,
    status: "active",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Hair Coloring",
    category: "Hair",
    duration: "120 min",
    price: "₹4,500",
    rating: 4.7,
    reviews: 52,
    status: "active",
    image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    name: "Full Body Massage",
    category: "Wellness",
    duration: "90 min",
    price: "₹3,500",
    rating: 4.9,
    reviews: 43,
    status: "inactive",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop"
  }
];

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">My Services</h1>
          <p className="text-[#6b6b6b] mt-1">Manage your salon service catalog and pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
            <input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl text-sm outline-none w-64 focus:border-blue-600 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white border border-[#e5e5e5] rounded-[32px] overflow-hidden hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-black/5"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                  service.status === 'active' ? 'bg-emerald-500/80 text-white' : 'bg-slate-500/80 text-white'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <button className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white transition-colors">
                  <MoreVertical className="w-4 h-4 text-[#1a1a1a]" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{service.category}</p>
                  <h3 className="text-xl font-bold text-[#1a1a1a]">{service.name}</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{service.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#6b6b6b]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">Duration</p>
                    <p className="text-xs font-bold text-[#1a1a1a]">{service.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-emerald-600">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">Price</p>
                    <p className="text-xs font-bold text-[#1a1a1a]">{service.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 py-3 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] text-sm font-bold hover:bg-[#e5e5e5] transition-all flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-3 rounded-2xl border border-[#e5e5e5] text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group relative aspect-[16/9] md:aspect-auto rounded-[32px] border-2 border-dashed border-[#e5e5e5] flex flex-col items-center justify-center gap-3 hover:border-blue-200 hover:bg-blue-50/50 transition-all p-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#f5f5f5] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[#1a1a1a]">Add New Service</p>
            <p className="text-sm text-[#c4c4c4] mt-1">Create a new offering for your clients</p>
          </div>
        </motion.button>
      </div>

      {/* AI Suggestions */}
      <section className="mt-12 p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-violet-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              AI Insight
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Optimize your pricing with AI</h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Based on local market trends in Koramangala, increasing your "Premium Haircut" price by 15% during weekends could boost your monthly revenue by ₹12,000.
            </p>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold hover:shadow-xl transition-all whitespace-nowrap">
            View Analysis
          </button>
        </div>
      </section>
    </div>
  );
}
