"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Search,
  Filter,
  MoreVertical,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const salons = [
  {
    id: 1,
    name: "Aura Luxury Spa",
    owner: "Jane Smith",
    location: "Koramangala, Bangalore",
    rating: 4.9,
    status: "Verified",
    totalBookings: 1245,
    revenue: "₹1.4M",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Luxe Beauty Lounge",
    owner: "Michael Ross",
    location: "Indiranagar, Bangalore",
    rating: 4.7,
    status: "Verified",
    totalBookings: 856,
    revenue: "₹920k",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Urban Style Studio",
    owner: "Anita Sharma",
    location: "HSR Layout, Bangalore",
    rating: 4.5,
    status: "Pending",
    totalBookings: 0,
    revenue: "₹0",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop"
  }
];

export default function SalonsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Salon Partners</h1>
          <p className="text-slate-500 text-sm">Manage salon onboardings, verifications, and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Verify New Salon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Salons</p>
          <h3 className="text-2xl font-bold text-slate-900">542</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Now</p>
          <h3 className="text-2xl font-bold text-slate-900">480</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Approval</p>
          <h3 className="text-2xl font-bold text-amber-600">12</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-emerald-600">₹24.8M</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by salon name, owner or location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-slate-200 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salons.map((salon) => (
                <tr key={salon.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{salon.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {salon.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{salon.owner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {salon.rating}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {salon.totalBookings} bookings • {salon.revenue} rev.
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      salon.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {salon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
