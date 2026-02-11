"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Star,
  Tag,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Package
} from "lucide-react";
import { useState } from "react";

const products = [
  { id: 1, name: "Summer Minimalist Dress", designer: "Studio Épure", price: "₹4,999", sales: 124, status: "Active", stock: 85, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop" },
  { id: 2, name: "Artisan Silk Scarf", designer: "Kalyan Heritage", price: "₹1,299", sales: 52, status: "Active", stock: 12, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop" },
  { id: 3, name: "Urban Techwear Jacket", designer: "Neo-Tokyo", price: "₹7,299", sales: 8, status: "Review", stock: 4, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=200&fit=crop" },
  { id: 4, name: "Linen Lounge Set", designer: "Eco-Luxe", price: "₹3,499", sales: 156, status: "Active", stock: 0, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop" },
];

export default function AdminMarketplacePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace Management</h1>
          <p className="text-slate-500 mt-1">Manage products, vendors, and inventory across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            Vendor Portal
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
            Add Collection
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Total Products", value: "12,482", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Vendors", value: "324", icon: ShoppingBag, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active Orders", value: "842", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Flagged Items", value: "7", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s, i) => (
          <div key={s.label} className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or vendor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-lg text-sm transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <select className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-slate-50 border-transparent text-sm font-bold text-slate-600 outline-none">
            <option>All Categories</option>
            <option>Fashion</option>
            <option>Beauty</option>
            <option>Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Sales</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg bg-slate-100 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 max-w-[150px] truncate">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-indigo-600">{p.designer}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs font-medium text-slate-700">{p.sales}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${p.stock === 0 ? 'text-rose-500' : p.stock < 15 ? 'text-amber-500' : 'text-slate-500'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      p.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-indigo-600 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
