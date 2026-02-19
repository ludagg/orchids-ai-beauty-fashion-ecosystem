"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Plus,
  Search,
  MoreVertical,
  Clock,
  IndianRupee,
  Star,
  CheckCircle2,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Eye,
  Settings
} from "lucide-react";
import { useState } from "react";

const services = [
  {
    id: 1,
    name: "Premium Haircut",
    category: "Hair",
    duration: "45 min",
    price: "₹850",
    rating: 4.9,
    reviews: 124,
    status: "Active",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Hydra Facial",
    category: "Skin",
    duration: "60 min",
    price: "₹2,499",
    rating: 4.8,
    reviews: 86,
    status: "Active",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Full Body Massage",
    category: "Spa",
    duration: "90 min",
    price: "₹1,800",
    rating: 5.0,
    reviews: 52,
    status: "Active",
    image: "https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?w=200&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Beard Styling",
    category: "Grooming",
    duration: "30 min",
    price: "₹450",
    rating: 4.7,
    reviews: 94,
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop"
  }
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service menu and pricing.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Categories Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full sm:w-auto">
          {["All", "Hair", "Skin", "Spa", "Grooming", "Nails"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-foreground text-white border-foreground"
                  : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-blue-500 outline-none text-sm transition-all text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 bg-card border border-border rounded-[32px] hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all shadow-sm"
          >
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-[20px] overflow-hidden bg-muted flex-shrink-0 shadow-inner">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-lg truncate">{service.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                        service.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground/50'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                    <p className="text-sm text-blue-500 font-bold uppercase tracking-widest mt-0.5">{service.category}</p>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground/50 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs">{service.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-muted flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price</p>
                <p className="text-2xl font-bold text-foreground mt-1">{service.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-2xl bg-muted text-foreground hover:bg-blue-600 hover:text-white transition-all group/btn">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-3 rounded-2xl bg-muted text-foreground hover:bg-rose-600 hover:text-white transition-all group/btn">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 rounded-2xl bg-foreground text-white text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-foreground/5">
                  View Stats
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Placeholder */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-[32px] border-2 border-dashed border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-4 group shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-foreground">Add New Service</h3>
            <p className="text-sm text-muted-foreground mt-1">Add a new treatment or package</p>
          </div>
        </motion.button>
      </div>

      {/* Pro Tip */}
      <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 blur-[60px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-card/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Settings className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display">Service Optimization</h3>
            <p className="text-white/70 mt-2 max-w-xl leading-relaxed">
              Based on your analytics, your "Hydra Facial" is most popular on weekends. Consider adding a "Weekend Glow Package" to increase revenue.
            </p>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-card text-indigo-700 font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-xl whitespace-nowrap">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
