"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
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

interface AdminPaymentsClientProps {
  data: {
    data: Order[];
    total: number;
    totalPages: number;
  };
}

export default function AdminPaymentsClient({ data }: AdminPaymentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Transactions</h1>
          <p className="text-muted-foreground mt-1">View all successful payments.</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.data.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No transactions found.</td>
                 </tr>
              ) : (
                data.data.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {order.id}
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
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                        ₹{(order.totalAmount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                        Paid
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
