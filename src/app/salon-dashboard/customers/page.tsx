"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Star,
  MessageSquare
} from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    totalVisits: 12,
    lastVisit: "2 days ago",
    spending: "₹18,500",
    rating: 4.9,
    image: "11"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    totalVisits: 8,
    lastVisit: "1 week ago",
    spending: "₹12,200",
    rating: 4.8,
    image: "12"
  },
  {
    id: 3,
    name: "Anita Desai",
    email: "anita@example.com",
    phone: "+91 98765 43212",
    totalVisits: 5,
    lastVisit: "3 weeks ago",
    spending: "₹8,900",
    rating: 4.5,
    image: "13"
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 43213",
    totalVisits: 22,
    lastVisit: "Yesterday",
    spending: "₹34,000",
    rating: 5.0,
    image: "14"
  }
];

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Customers</h1>
          <p className="text-[#6b6b6b] mt-1">Manage your customer relationships and history.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl text-sm outline-none w-64 focus:border-blue-600 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#e5e5e5] bg-white text-sm font-bold hover:bg-[#f5f5f5] transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f5f5f5]">
                <th className="px-6 py-5 text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest text-center">Visits</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">Last Visit</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest">Total Spend</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#c4c4c4] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f5]">
              {customers.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-[#fcfcfc] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f5f5]">
                        <img src={`https://i.pravatar.cc/100?u=${customer.image}`} alt={customer.name} />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1a1a]">{customer.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-[#6b6b6b]">{customer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-lg bg-[#f5f5f5] text-xs font-bold text-[#1a1a1a]">
                      {customer.totalVisits}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {customer.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-emerald-600">{customer.spending}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-[#f5f5f5] text-[#1a1a1a] transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-[#6b6b6b]">Showing <span className="font-bold text-[#1a1a1a]">4</span> of <span className="font-bold text-[#1a1a1a]">842</span> customers</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl border border-[#e5e5e5] text-sm font-bold disabled:opacity-50" disabled>Previous</button>
          <button className="px-4 py-2 rounded-xl border border-[#e5e5e5] text-sm font-bold hover:bg-[#f5f5f5]">Next</button>
        </div>
      </div>
    </div>
  );
}
