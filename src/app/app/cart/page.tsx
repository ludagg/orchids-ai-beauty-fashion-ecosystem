"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Heart,
  CreditCard,
  Lock,
  TrendingUp,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CartItem {
  id: string;
  title: string;
  designer: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    title: "Summer Minimalist Dress",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    price: 4999,
    quantity: 1,
    size: "M",
    color: "Ivory"
  },
  {
    id: "2",
    title: "Handcrafted Leather Boots",
    designer: "WalkFree",
    image: "https://images.unsplash.com/photo-1520639889313-727216be3b37?w=400&h=500&fit=crop",
    price: 5499,
    quantity: 1,
    size: "42",
    color: "Brown"
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 10000 ? 0 : 199;
  const total = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "PRIISME10") {
      setAppliedPromo(promoCode);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#1a1a1a]">
            Shopping Bag
          </h1>
          <p className="text-[#6b6b6b] mt-1">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[32px] p-16 text-center border border-[#e5e5e5] shadow-sm"
                >
                  <div className="w-24 h-24 rounded-[32px] bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-[#c4c4c4]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">Your cart is empty</h3>
                  <p className="text-[#6b6b6b] mb-8">Add items you love to start shopping!</p>
                  <Link href="/app/marketplace">
                    <button className="px-8 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10 inline-flex items-center gap-2">
                      Browse Marketplace <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              ) : (
                cartItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl p-6 border border-[#e5e5e5] shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="w-32 h-40 rounded-2xl overflow-hidden bg-[#f5f5f5] flex-shrink-0 shadow-inner">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-[#1a1a1a] mb-1">{item.title}</h3>
                              <p className="text-sm text-[#6b6b6b] font-medium">{item.designer}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 rounded-xl hover:bg-rose-50 text-[#6b6b6b] hover:text-rose-600 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex gap-6 text-sm mb-4">
                            <div>
                              <span className="text-[#c4c4c4] text-xs font-bold uppercase tracking-wider">Size</span>
                              <p className="font-bold text-[#1a1a1a] mt-0.5">{item.size}</p>
                            </div>
                            <div>
                              <span className="text-[#c4c4c4] text-xs font-bold uppercase tracking-wider">Color</span>
                              <p className="font-bold text-[#1a1a1a] mt-0.5">{item.color}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-[#f5f5f5] rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 rounded-lg hover:bg-white transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 rounded-lg hover:bg-white transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="text-xl font-bold text-[#1a1a1a]">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Recommendations */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8"
              >
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-500" />
                  You May Also Like
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-2 bg-[#f5f5f5] border border-[#e5e5e5]">
                        <img
                          src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&sig=${i+20}`}
                          alt="Suggestion"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <p className="font-bold text-sm text-[#1a1a1a] truncate">Tailored Shirt</p>
                      <p className="text-xs text-rose-600 font-bold">₹2,499</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-xl shadow-black/[0.02] sticky top-8 space-y-6">
                <h3 className="text-xl font-bold text-[#1a1a1a]">Order Summary</h3>

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={!!appliedPromo}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium disabled:opacity-50"
                      />
                    </div>
                    {!appliedPromo ? (
                      <button
                        onClick={applyPromo}
                        className="px-6 py-3 rounded-xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoCode("");
                        }}
                        className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Promo code applied!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 py-6 border-y border-[#f5f5f5]">
                  <div className="flex justify-between text-[#6b6b6b]">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span className="font-bold">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6b6b6b]">
                    <span>Shipping</span>
                    <span className="font-bold">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#1a1a1a]">Total</span>
                  <span className="text-2xl font-bold text-[#1a1a1a]">₹{total.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <Link href="/app/checkout">
                  <button className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-[#6b6b6b] pt-4">
                  <Lock className="w-3 h-3" />
                  <span>Secure checkout powered by Stripe</span>
                </div>

                {/* Benefits */}
                <div className="space-y-3 pt-4 border-t border-[#f5f5f5]">
                  <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">Benefits</p>
                  {[
                    "Free shipping on orders above ₹10,000",
                    "Easy 30-day returns",
                    "Secure payment processing"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#6b6b6b]">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
