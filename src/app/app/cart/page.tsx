"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialCartItems = [
  {
    id: 1,
    title: "Summer Minimalist Dress",
    designer: "Studio Épure",
    price: 4999,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    size: "M",
    color: "Cream",
    quantity: 1
  },
  {
    id: 2,
    title: "Eco-Linen Summer Set",
    designer: "Studio Épure",
    price: 3499,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop",
    size: "S",
    color: "Olive",
    quantity: 1
  }
];

export default function CartPage() {
  const [items, setItems] = useState(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-[2] space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground font-display tracking-tight flex items-center gap-3">
              Your Bag
              <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">{items.length} items</span>
            </h1>
            <Link href="/app/marketplace" className="text-sm font-bold text-rose-600 hover:underline flex items-center gap-1 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-6 p-6 rounded-[32px] bg-card border border-border hover:border-foreground transition-all group"
                >
                  <div className="w-24 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-inner">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{item.title}</h3>
                        <p className="text-sm text-rose-600 font-bold uppercase tracking-widest">{item.designer}</p>
                        <div className="flex gap-4 mt-2">
                          <p className="text-xs text-muted-foreground font-medium">Size: <span className="text-foreground font-bold">{item.size}</span></p>
                          <p className="text-xs text-muted-foreground font-medium">Color: <span className="text-foreground font-bold">{item.color}</span></p>
                        </div>
                      </div>
                      <p className="font-bold text-lg text-foreground">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center h-10 rounded-xl border border-border bg-muted/30 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-full flex items-center justify-center hover:bg-card transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-full flex items-center justify-center hover:bg-card transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="p-2 text-muted-foreground/50 hover:text-rose-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground/50 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="py-20 text-center space-y-6 bg-background rounded-[40px] border border-dashed border-border">
                <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mx-auto shadow-sm">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Your bag is empty</h2>
                  <p className="text-muted-foreground mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <Link href="/app/marketplace">
                  <button className="px-8 py-3.5 rounded-2xl bg-foreground text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-foreground/10">
                    Explore Marketplace
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex-1">
          <div className="sticky top-24 space-y-8">
            <div className="p-8 rounded-[40px] bg-muted border border-border space-y-6">
              <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="text-foreground font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? "text-emerald-600" : "text-foreground"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Estimated Tax (18%)</span>
                  <span className="text-foreground font-bold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between text-lg">
                  <span className="text-foreground font-bold">Total</span>
                  <span className="text-foreground font-bold">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/app/checkout" className="block w-full">
                <button
                  disabled={items.length === 0}
                  className="w-full py-5 rounded-2xl bg-foreground text-white font-bold text-lg hover:bg-[#333] transition-all shadow-xl shadow-foreground/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  Checkout Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <p className="text-xs font-bold text-foreground">Secure Payment Guaranteed</p>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <p className="text-xs font-bold text-foreground">Fast Delivery in 3-5 days</p>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-rose-600" />
                  <p className="text-xs font-bold text-foreground">Easy 15-day Returns</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-card border border-border space-y-4">
              <h3 className="font-bold text-foreground">Apply Promo Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm font-medium transition-all"
                />
                <button className="px-6 py-3 rounded-xl bg-foreground text-white font-bold text-sm hover:bg-[#333] transition-all">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
