"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Download,
  Plus,
  ArrowUpRight,
  Circle
} from "lucide-react";
import { useState } from "react";

const users = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "Customer", status: "Active", joined: "2 days ago", avatar: "11" },
  { id: 2, name: "Priya Patel", email: "priya@example.com", role: "Customer", status: "Active", joined: "5 days ago", avatar: "12" },
  { id: 3, name: "Anita Desai", email: "anita@example.com", role: "Vendor", status: "Active", joined: "1 week ago", avatar: "13" },
  { id: 4, name: "Vikram Singh", email: "vikram@example.com", role: "Customer", status: "Suspended", joined: "2 weeks ago", avatar: "14" },
  { id: 5, name: "Sonia Gupta", email: "sonia@example.com", role: "Vendor", status: "Active", joined: "1 month ago", avatar: "15" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage all platform users, roles, and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Users
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: "24.8k", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Now", value: "1,240", change: "+84", icon: Circle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Vendors", value: "842", change: "+15", icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Suspended", value: "12", change: "-2", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s, i) => (
          <div key={s.label} className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <span className="text-[10px] font-bold text-emerald-600">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-lg text-sm transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block" />
          <select className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-slate-50 border-transparent text-sm font-bold text-slate-600 outline-none">
            <option>All Roles</option>
            <option>Customer</option>
            <option>Vendor</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${u.avatar}`} alt={u.name} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      u.role === 'Vendor' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-xs font-medium text-slate-700">{u.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{u.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-600 transition-all">
                      <MoreVertical className="w-4 h-4" />
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
