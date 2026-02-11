"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Tag,
  Store,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Package,
  CheckCircle2
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Summer Minimalist Dress",
    brand: "Studio Épure",
    price: "₹4,999",
    stock: 45,
    sales: 124,
    status: "Active",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Artisan Silk Saree",
    brand: "Kalyan Heritage",
    price: "₹12,499",
    stock: 12,
    sales: 56,
    status: "Active",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Neo-Tokyo Tech Jacket",
    brand: "Neo-Tokyo",
    price: "₹7,299",
    stock: 0,
    sales: 210,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=200&fit=crop"
  }
];

export default function MarketplaceAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace Management</h1>
          <p className="text-slate-500 text-sm">Manage products, sellers, and inventory across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Add New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
          <h3 className="text-2xl font-bold text-slate-900">2,450</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Sellers</p>
          <h3 className="text-2xl font-bold text-slate-900">124</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock Alerts</p>
          <h3 className="text-2xl font-bold text-rose-600">8</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Platform Revenue</p>
          <h3 className="text-2xl font-bold text-emerald-600">₹1.2M</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or brands..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-slate-200 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-indigo-600 font-bold">{product.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{product.brand}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.stock === 0 ? 'bg-rose-50 text-rose-700' :
                      product.stock < 15 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-bold">{product.sales}</td>
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
