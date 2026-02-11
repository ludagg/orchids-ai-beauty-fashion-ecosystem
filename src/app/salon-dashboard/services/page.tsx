"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  IndianRupee,
  Eye,
  EyeOff,
  Image as ImageIcon
} from "lucide-react";
import { useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  image: string;
  bookings: number;
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "Premium Haircut & Styling",
    description: "Expert haircut with wash and styling",
    price: 1500,
    duration: 60,
    isActive: true,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    bookings: 45
  },
  {
    id: "2",
    name: "Hydra Facial Treatment",
    description: "Deep cleansing and hydrating facial",
    price: 3500,
    duration: 90,
    isActive: true,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    bookings: 32
  },
  {
    id: "3",
    name: "Full Body Massage",
    description: "Relaxing Swedish massage therapy",
    price: 2800,
    duration: 75,
    isActive: true,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    bookings: 28
  },
  {
    id: "4",
    name: "Beard Trim & Styling",
    description: "Professional beard grooming",
    price: 800,
    duration: 30,
    isActive: false,
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=300&fit=crop",
    bookings: 18
  }
];

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const deleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Services Management</h1>
          <p className="text-[#6b6b6b] mt-1">Manage your salon services and pricing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-lg shadow-black/10"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Services", value: services.length },
          { label: "Active", value: services.filter(s => s.isActive).length },
          { label: "Inactive", value: services.filter(s => !s.isActive).length },
          { label: "Total Bookings", value: services.reduce((sum, s) => sum + s.bookings, 0) }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 bg-white rounded-2xl border border-[#e5e5e5] shadow-sm"
          >
            <p className="text-sm font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-[#1a1a1a]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all ${
              service.isActive ? "border-[#e5e5e5]" : "border-[#f5f5f5] opacity-60"
            }`}
          >
            {/* Image */}
            <div className="relative h-48 bg-[#f5f5f5]">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className="p-2 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white transition-all shadow-lg"
                  title={service.isActive ? "Deactivate" : "Activate"}
                >
                  {service.isActive ? (
                    <Eye className="w-4 h-4 text-[#1a1a1a]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[#6b6b6b]" />
                  )}
                </button>
              </div>
              {!service.isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
                    Inactive
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-[#1a1a1a] mb-1">{service.name}</h3>
                <p className="text-sm text-[#6b6b6b] line-clamp-2">{service.description}</p>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-[#f5f5f5]">
                <div>
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-1">Price</p>
                  <p className="font-bold text-lg text-[#1a1a1a] flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {service.price}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-1">Duration</p>
                  <p className="font-bold text-lg text-[#1a1a1a] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}m
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">Bookings</p>
                  <p className="font-bold text-[#1a1a1a] mt-1">{service.bookings} this month</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 py-3 rounded-xl bg-[#f5f5f5] text-[#1a1a1a] font-bold hover:bg-[#e5e5e5] transition-all flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Service Modal (Simple Placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Add New Service</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                  Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Premium Haircut"
                  className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the service"
                  rows={3}
                  className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="1500"
                    className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                  Service Image
                </label>
                <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-[#e5e5e5] rounded-2xl hover:border-[#1a1a1a] transition-all cursor-pointer">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-[#c4c4c4] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#6b6b6b]">Click to upload image</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] font-bold hover:bg-[#e5e5e5] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add service logic here
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10"
                >
                  Add Service
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
