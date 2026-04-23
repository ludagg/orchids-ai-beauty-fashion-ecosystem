"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  History,
  Star,
  ChevronRight,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: string;
  image: string;
  status: string;
}

interface CustomersClientProps {
    initialCustomers: Customer[];
    stats: {
        totalCustomers: number;
        vipCount: number;
        growthPercentage: number;
    }
}

export default function CustomersClient({ initialCustomers, stats }: CustomersClientProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage and track your customer base.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-border bg-card text-foreground rounded-xl text-sm font-bold hover:bg-muted transition-all flex items-center gap-2">
            Export CRM
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Customers", value: stats.totalCustomers.toString(), change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "VIP Members", value: stats.vipCount.toString(), change: "+5", icon: Star, color: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Customer Growth", value: `${stats.growthPercentage}%`, change: "+4%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card rounded-3xl border border-border flex items-center gap-6 shadow-sm"
          >
            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  {s.change} <ArrowUpRight className="w-2 h-2" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-blue-500 outline-none text-sm transition-all shadow-sm text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-card border border-border text-sm font-bold text-muted-foreground flex items-center justify-center gap-2 hover:border-foreground hover:text-foreground transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-foreground text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-foreground/10">
            Apply Marketing
          </button>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted bg-muted/50">
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Visits</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Visit</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredCustomers.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-muted-foreground">
                          No customers found.
                      </td>
                  </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted border-2 border-card shadow-sm flex items-center justify-center font-bold text-primary">
                          {c.image ? (
                            <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        c.status === 'VIP' ? 'bg-amber-500/10 text-amber-600' :
                        c.status === 'New' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{c.totalVisits}</p>
                        <span className="text-xs text-muted-foreground/50 font-medium">visits</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1">{c.totalSpent} total spent</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                        <History className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {c.lastVisit}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-all border border-border">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
