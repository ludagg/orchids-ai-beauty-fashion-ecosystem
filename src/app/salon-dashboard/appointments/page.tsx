"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Phone,
  MessageCircle,
  Search,
  Filter
} from "lucide-react";
import { useState } from "react";

const appointments = [
  {
    id: 1,
    customer: "Rahul Sharma",
    service: "Premium Haircut",
    time: "10:30 AM",
    date: "Today",
    status: "Confirmed",
    image: "11",
    price: "₹850"
  },
  {
    id: 2,
    customer: "Priya Patel",
    service: "Hydra Facial",
    time: "11:15 AM",
    date: "Today",
    status: "Pending",
    image: "12",
    price: "₹2,499"
  },
  {
    id: 3,
    customer: "Anita Desai",
    service: "Full Body Massage",
    time: "12:00 PM",
    date: "Today",
    status: "Confirmed",
    image: "13",
    price: "₹1,800"
  },
  {
    id: 4,
    customer: "Vikram Singh",
    service: "Beard Styling",
    time: "01:30 PM",
    date: "Today",
    status: "Cancelled",
    image: "14",
    price: "₹450"
  },
  {
    id: 5,
    customer: "Sonia Gupta",
    service: "Hair Coloring",
    time: "10:00 AM",
    date: "Tomorrow",
    status: "Confirmed",
    image: "15",
    price: "₹3,500"
  }
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [apptList, setApptList] = useState(appointments);

  const updateStatus = (id: number, status: string) => {
    setApptList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your schedule and customer bookings.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 w-fit">
          <Calendar className="w-4 h-4" />
          Add Booking
        </button>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today", value: "8", color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Pending", value: "3", color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Confirmed", value: "12", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Revenue Today", value: "₹8.4k", color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-2xl ${s.bg} border border-transparent hover:border-blue-500/20 transition-all`}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-card p-1 rounded-xl border border-border w-full sm:w-auto">
          {["Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search customer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-blue-500 outline-none text-sm transition-all text-foreground"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {apptList.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col md:flex-row md:items-center gap-6 p-6 bg-card border border-border rounded-[32px] hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-600/5 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${app.image}`} alt={app.customer} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground truncate">{app.customer}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    app.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                    app.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium mt-0.5">{app.service}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-blue-500 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {app.time}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <p className="text-xs text-muted-foreground font-medium">{app.date}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-8 border-t border-border md:border-t-0 pt-4 md:pt-0 text-foreground">
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Amount</p>
                <p className="text-lg font-bold text-foreground">{app.price}</p>
              </div>

              <div className="flex items-center gap-2">
                {app.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, 'Confirmed')}
                      className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                      title="Accept"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'Cancelled')}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="w-px h-8 bg-border mx-1" />
                <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calendar Preview Mini Card */}
      <div className="p-8 rounded-[40px] bg-primary text-primary-foreground relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-display">Weekly Overview</h3>
            <p className="text-background/60 max-w-sm">
              You have 24 appointments scheduled for this week. Your busiest day will be Saturday.
            </p>
            <div className="flex gap-2">
              {[1,2,3,4,5,6,7].map(d => (
                <div key={d} className={`flex-1 h-12 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${d === 6 ? 'bg-blue-500' : 'bg-background/10'}`}>
                  {['M','T','W','T','F','S','S'][d-1]}
                </div>
              ))}
            </div>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-background text-foreground font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl">
            View Full Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
