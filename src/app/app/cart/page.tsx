"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialCartItems = [
  {
    id: 1,
    title: "Eco-Linen Summer Set",
    designer: "Studio Épure",
    price: 3499,
    size: "M",
    color: "Natural",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop",
    quantity: 1
  },
  {
    id: 2,
    title: "Artisan Silk Scarf",
    designer: "Kalyan Heritage",
    price: 1299,
    size: "One Size",
    color: "Indigo",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop",
    quantity: 2
  }
];

export default function CartPage() {
  const [items, setItems] = useState(initialCartItems);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Free for now
  const tax = subtotal * 0.12; // 12% GST
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#1a1a1a]">Shopping Bag</h1>
        <p className="text-[#6b6b6b] mt-1 text-base">You have {items.length} items in your bag.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="xl:col-span-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-[#e5e5e5] rounded-[32px] shadow-sm relative group"
              >
                <div className="w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#1a1a1a]">{item.title}</h3>
                        <p className="text-sm font-bold text-rose-600">{item.designer}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#c4c4c4] hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="px-3 py-1.5 rounded-xl bg-[#f5f5f5] text-xs font-bold text-[#6b6b6b] uppercase tracking-wider">
                        Size: {item.size}
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-[#f5f5f5] text-xs font-bold text-[#6b6b6b] uppercase tracking-wider">
                        Color: {item.color}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                    <div className="flex items-center gap-4 bg-[#f5f5f5] p-1.5 rounded-2xl w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1a1a1a] shadow-sm hover:bg-[#1a1a1a] hover:text-white transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-[#1a1a1a]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1a1a1a] shadow-sm hover:bg-[#1a1a1a] hover:text-white transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-[#1a1a1a]">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-24 h-24 rounded-[40px] bg-[#f5f5f5] flex items-center justify-center mx-auto text-[#c4c4c4]">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Your bag is empty</h2>
                <p className="text-[#6b6b6b] mt-2">Looks like you haven't added anything yet.</p>
              </div>
              <Link href="/app/marketplace">
                <button className="px-10 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all">
                  Browse Marketplace
                </button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <aside className="xl:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 bg-white border border-[#e5e5e5] rounded-[40px] shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-[#1a1a1a]">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-[#6b6b6b]">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-[#1a1a1a]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6b6b6b]">
                  <span className="font-medium">Estimated Tax (GST 12%)</span>
                  <span className="font-bold text-[#1a1a1a]">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="pt-4 border-t border-[#f5f5f5] flex justify-between items-end">
                  <span className="font-bold text-[#1a1a1a]">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#1a1a1a]">₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]" />
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="w-full pl-12 pr-20 py-4 bg-[#f5f5f5] border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#e5e5e5] transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#333] transition-all">
                    Apply
                  </button>
                </div>
              </div>

              <Link href="/app/checkout" className="block w-full">
                <button
                  className="w-full py-5 rounded-[24px] bg-[#1a1a1a] text-white font-bold hover:bg-rose-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 disabled:opacity-50 group"
                  disabled={items.length === 0}
                >
                  Checkout Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 text-xs text-[#6b6b6b] font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Secure checkout powered by Priisme Pay
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6b6b6b] font-medium">
                  <Truck className="w-4 h-4 text-blue-500" />
                  Free express delivery on all orders
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6b6b6b] font-medium">
                  <RotateCcw className="w-4 h-4 text-rose-500" />
                  30-day hassle-free returns
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
