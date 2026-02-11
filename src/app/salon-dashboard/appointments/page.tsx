"use client";

import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Scissors
} from "lucide-react";
import { useState } from "react";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const appointments = [
  {
    id: 1,
    customer: "Rahul Sharma",
    service: "Premium Haircut",
    time: "10:00 AM",
    duration: "45 min",
    status: "confirmed",
    image: "11",
    price: "₹800"
  },
  {
    id: 2,
    customer: "Priya Patel",
    service: "Hydra Facial",
    time: "11:00 AM",
    duration: "60 min",
    status: "confirmed",
    image: "12",
    price: "₹2,500"
  },
  {
    id: 3,
    customer: "Anita Desai",
    service: "Hair Coloring",
    time: "02:00 PM",
    duration: "120 min",
    status: "pending",
    image: "13",
    price: "₹4,500"
  },
  {
    id: 4,
    customer: "Vikram Singh",
    service: "Beard Styling",
    time: "04:00 PM",
    duration: "30 min",
    status: "confirmed",
    image: "14",
    price: "₹500"
  }
];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Appointments</h1>
          <p className="text-[#6b6b6b] mt-1">Manage and schedule your salon bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e5e5] bg-white text-sm font-bold hover:bg-[#f5f5f5] transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white rounded-[32px] border border-[#e5e5e5] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#1a1a1a]">September 2026</h3>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <button
                  key={i}
                  className={`aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all ${
                    i + 1 === 15
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "hover:bg-blue-50 hover:text-blue-600 text-[#1a1a1a]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-blue-600 rounded-[32px] text-white">
            <h3 className="font-bold text-lg mb-2">Daily Summary</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">Total Bookings</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-80">Estimated Revenue</span>
                <span className="font-bold">₹18,500</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full mt-4">
                <div className="w-3/4 h-full bg-white rounded-full" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">75% Capacity Reached</p>
            </div>
          </div>
        </div>

        {/* Schedule View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-[#e5e5e5]">
            <div className="flex">
              <button className="px-6 py-2.5 rounded-xl bg-[#1a1a1a] text-white text-sm font-bold">List View</button>
              <button className="px-6 py-2.5 rounded-xl text-[#6b6b6b] text-sm font-bold hover:bg-[#f5f5f5]">Calendar View</button>
            </div>
            <div className="relative mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 bg-[#f5f5f5] border-transparent rounded-xl text-sm outline-none w-48 focus:w-64 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {appointments.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex items-center gap-4 p-5 bg-white border border-[#e5e5e5] rounded-[24px] hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-black/5"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                  <img src={`https://i.pravatar.cc/150?u=${app.image}`} alt={app.customer} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[#1a1a1a] text-lg">{app.customer}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#6b6b6b]">
                    <div className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-blue-600" />
                      {app.service}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {app.duration}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-[#1a1a1a]">{app.time}</div>
                  <div className="text-sm font-bold text-blue-600">{app.price}</div>
                </div>

                <div className="ml-4 flex items-center gap-1">
                  <button className="p-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-[#f5f5f5] transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#c4c4c4]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full py-4 rounded-[24px] border-2 border-dashed border-[#e5e5e5] text-[#c4c4c4] font-bold hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Custom Slot
          </button>
        </div>
      </div>
    </div>
  );
}
