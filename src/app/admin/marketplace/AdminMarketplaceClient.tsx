"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  BarChart3,
  Package
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    user: {
        name: string;
        email: string;
        image: string | null;
    };
    items: {
        quantity: number;
        product: {
            name: string;
            price: number;
        };
    }[];
}

interface AdminMarketplaceClientProps {
  data: {
    data: Order[];
    total: number;
    totalPages: number;
  };
}

export default function AdminMarketplaceClient({ data }: AdminMarketplaceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All Status");

  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "All Status");
  }, [searchParams]);

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus && newStatus !== "All Status") params.set("status", newStatus);
    else params.delete("status");

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    updateFilters(newStatus);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Placeholder for future search */}
        <div className="relative w-full md:w-96"></div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-bold text-muted-foreground outline-none cursor-pointer hover:bg-secondary"
          >
            <option>All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.data.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td>
                 </tr>
              ) : (
                data.data.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                            {order.user?.image ? (
                                <img src={order.user.image} alt={order.user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-xs">
                                    {order.user?.name?.[0]}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-foreground">{order.user?.name || "Unknown"}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                        ₹{(order.totalAmount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'paid' || order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-50 text-slate-700'
                        }`}>
                        {order.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
       {/* Pagination Controls */}
       <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
              Showing page {searchParams.get("page") || 1} of {data.totalPages}
          </div>
          <div className="flex gap-2">
              <button
                disabled={Number(searchParams.get("page") || 1) <= 1}
                onClick={() => {
                    const p = Number(searchParams.get("page") || 1);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", (p - 1).toString());
                    router.push(`?${params.toString()}`);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium disabled:opacity-50 hover:bg-secondary"
              >
                  Previous
              </button>
              <button
                disabled={Number(searchParams.get("page") || 1) >= data.totalPages}
                onClick={() => {
                    const p = Number(searchParams.get("page") || 1);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", (p + 1).toString());
                    router.push(`?${params.toString()}`);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium disabled:opacity-50 hover:bg-secondary"
              >
                  Next
              </button>
          </div>
      </div>
    </div>
  );
}
