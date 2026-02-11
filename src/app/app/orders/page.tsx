"use client";

import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Download,
  MapPin,
  Calendar,
  IndianRupee
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: Array<{
    id: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: string;
  trackingNumber?: string;
}

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-02-10",
    status: "delivered",
    total: 9448,
    items: [
      {
        id: "1",
        title: "Summer Minimalist Dress",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=250&fit=crop",
        price: 4999,
        quantity: 1
      },
      {
        id: "2",
        title: "Handcrafted Leather Boots",
        image: "https://images.unsplash.com/photo-1520639889313-727216be3b37?w=200&h=250&fit=crop",
        price: 5499,
        quantity: 1
      }
    ],
    shippingAddress: "123, 100 Feet Road, Indiranagar, Bangalore - 560038",
    trackingNumber: "TRK123456789"
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-02-08",
    status: "shipped",
    total: 3299,
    items: [
      {
        id: "3",
        title: "Artisan Silk Scarf",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=250&fit=crop",
        price: 3299,
        quantity: 1
      }
    ],
    shippingAddress: "456, MG Road, Bangalore - 560001",
    trackingNumber: "TRK987654321"
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-02-05",
    status: "confirmed",
    total: 12499,
    items: [
      {
        id: "4",
        title: "Celestial Gold Necklace",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=250&fit=crop",
        price: 12499,
        quantity: 1
      }
    ],
    shippingAddress: "789, HSR Layout, Bangalore - 560102"
  }
];

const statusConfig = {
  pending: { color: "amber", icon: Clock, label: "Order Pending" },
  confirmed: { color: "blue", icon: CheckCircle2, label: "Confirmed" },
  shipped: { color: "violet", icon: Package, label: "Shipped" },
  delivered: { color: "emerald", icon: CheckCircle2, label: "Delivered" },
  cancelled: { color: "rose", icon: X, label: "Cancelled" }
};

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "delivered">("all");

  const filteredOrders = orders.filter(order => {
    if (selectedTab === "all") return true;
    if (selectedTab === "active") return ["pending", "confirmed", "shipped"].includes(order.status);
    if (selectedTab === "delivered") return order.status === "delivered";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#1a1a1a]">
            My Orders
          </h1>
          <p className="text-[#6b6b6b] mt-1">Track and manage your orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e5e5e5]">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "active", label: "Active", count: orders.filter(o => ["pending", "confirmed", "shipped"].includes(o.status)).length },
            { id: "delivered", label: "Delivered", count: orders.filter(o => o.status === "delivered").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${
                selectedTab === tab.id
                  ? "text-[#1a1a1a] border-[#1a1a1a]"
                  : "text-[#6b6b6b] border-transparent hover:text-[#1a1a1a]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[32px] p-16 text-center border border-[#e5e5e5] shadow-sm">
              <div className="w-24 h-24 rounded-[32px] bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-[#c4c4c4]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">No orders yet</h3>
              <p className="text-[#6b6b6b] mb-8">Start shopping to see your orders here!</p>
              <Link href="/app/marketplace">
                <button className="px-8 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10 inline-flex items-center gap-2">
                  Browse Marketplace <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order, i) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[32px] border border-[#e5e5e5] shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-[#f5f5f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-[#1a1a1a]">{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-${statusInfo.color}-50 text-${statusInfo.color}-700 border border-${statusInfo.color}-100 flex items-center gap-1.5`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b6b6b]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="w-4 h-4" />
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <p className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-1">
                        <IndianRupee className="w-5 h-5" />
                        {order.total.toLocaleString()}
                      </p>
                      {order.trackingNumber && (
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          Track Order <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1a1a1a] mb-1">{item.title}</h4>
                          <p className="text-sm text-[#6b6b6b] mb-2">Quantity: {item.quantity}</p>
                          <p className="font-bold text-[#1a1a1a] flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="p-6 bg-[#fafafa] border-t border-[#f5f5f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <MapPin className="w-4 h-4 text-[#6b6b6b]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-1">
                          Shipping Address
                        </p>
                        <p className="text-sm text-[#1a1a1a]">{order.shippingAddress}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "delivered" && (
                        <button className="px-4 py-2.5 rounded-xl bg-white border border-[#e5e5e5] text-sm font-bold hover:bg-[#f5f5f5] transition-all flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      )}
                      <Link href={`/app/orders/${order.id}`}>
                        <button className="px-4 py-2.5 rounded-xl bg-[#1a1a1a] text-white text-sm font-bold hover:bg-[#333] transition-all flex items-center gap-2">
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
