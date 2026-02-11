"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ChevronLeft,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Smartphone,
  Banknote
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const steps = ["Shipping", "Payment", "Confirm"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/app/cart">
          <button className="flex items-center gap-2 text-sm font-bold text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to Bag
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= i ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#e5e5e5] text-[#c4c4c4]"
                  }`}>
                    {currentStep > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${
                    currentStep >= i ? "text-[#1a1a1a]" : "text-[#c4c4c4]"
                  }`}>
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="h-px bg-[#e5e5e5] flex-1 mx-4 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">First Name</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-white border border-[#e5e5e5] rounded-2xl outline-none focus:border-[#1a1a1a] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">Last Name</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-white border border-[#e5e5e5] rounded-2xl outline-none focus:border-[#1a1a1a] transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">Address</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-white border border-[#e5e5e5] rounded-2xl outline-none focus:border-[#1a1a1a] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">City</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-white border border-[#e5e5e5] rounded-2xl outline-none focus:border-[#1a1a1a] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#c4c4c4] uppercase tracking-wider">PIN Code</label>
                      <input type="text" className="w-full px-5 py-3.5 bg-white border border-[#e5e5e5] rounded-2xl outline-none focus:border-[#1a1a1a] transition-all" />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">Delivery Method</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <label className="relative flex items-center justify-between p-6 bg-white border-2 border-[#1a1a1a] rounded-[24px] cursor-pointer shadow-xl shadow-black/5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a1a]">Express Delivery</p>
                          <p className="text-xs text-[#6b6b6b] mt-0.5">Delivery by Friday, Sep 18</p>
                        </div>
                      </div>
                      <p className="font-bold text-emerald-600 uppercase tracking-widest text-[10px]">Free</p>
                    </label>
                  </div>
                </section>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Payment Method</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI Payment', icon: Smartphone },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                  ].map((method) => (
                    <button
                      key={method.id}
                      className="w-full p-6 bg-white border border-[#e5e5e5] rounded-[24px] flex items-center justify-between hover:border-[#1a1a1a] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                          <method.icon className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-[#1a1a1a]">{method.label}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-[#e5e5e5] group-hover:border-[#1a1a1a] transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="pt-8 border-t border-[#e5e5e5] flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-[#f5f5f5] text-[#6b6b6b]"
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                className="px-12 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-rose-500 transition-all flex items-center gap-2 shadow-xl shadow-black/10 group"
              >
                {currentStep === 2 ? "Place Order" : "Continue"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="p-8 bg-white border border-[#e5e5e5] rounded-[40px] shadow-sm space-y-8">
                <h3 className="text-xl font-bold text-[#1a1a1a]">Order Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-[#6b6b6b]">
                    <span className="font-medium">Subtotal (2 items)</span>
                    <span className="font-bold text-[#1a1a1a]">₹4,798</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b6b6b]">
                    <span className="font-medium">Shipping</span>
                    <span className="font-bold text-emerald-600 uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b6b6b]">
                    <span className="font-medium">GST (12%)</span>
                    <span className="font-bold text-[#1a1a1a]">₹575.76</span>
                  </div>
                  <div className="pt-4 border-t border-[#f5f5f5] flex justify-between items-end">
                    <span className="font-bold text-[#1a1a1a]">Total</span>
                    <span className="text-2xl font-bold text-[#1a1a1a]">₹5,373.76</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-xs text-[#6b6b6b] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Guaranteed Safe Checkout
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6b6b6b] font-medium">
                    <Lock className="w-4 h-4 text-blue-500" />
                    256-bit SSL Encryption
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
