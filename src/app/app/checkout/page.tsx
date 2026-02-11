"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowLeft,
  Wallet,
  Smartphone
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PaymentMethod = "card" | "upi" | "wallet";

const cartSummary = {
  items: 2,
  subtotal: 10498,
  discount: 1050,
  shipping: 0,
  total: 9448
};

export default function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      window.location.href = "/app/orders/success";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/app/cart" className="inline-flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a1a] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-sm">Back to Cart</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#1a1a1a]">
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { id: "shipping", label: "Shipping" },
              { id: "payment", label: "Payment" },
              { id: "review", label: "Review" }
            ].map((s, i, arr) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === s.id
                      ? "bg-[#1a1a1a] text-white shadow-xl shadow-black/20"
                      : arr.findIndex(x => x.id === step) > i
                        ? "bg-emerald-500 text-white"
                        : "bg-white border-2 border-[#e5e5e5] text-[#6b6b6b]"
                  }`}>
                    {arr.findIndex(x => x.id === step) > i ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`font-bold text-sm hidden sm:inline ${
                    step === s.id ? "text-[#1a1a1a]" : "text-[#6b6b6b]"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-4 ${
                    arr.findIndex(x => x.id === step) > i ? "bg-emerald-500" : "bg-[#e5e5e5]"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-sm space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Shipping Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#6b6b6b]" />
                      <textarea
                        placeholder="Street address, apartment/unit number"
                        rows={3}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Bangalore"
                      className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="560001"
                      className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep("payment")}
                  className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Payment Method */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-sm space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Payment Method</h2>

                {/* Payment Options */}
                <div className="space-y-3">
                  {[
                    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
                    { id: "upi", label: "UPI", icon: Smartphone },
                    { id: "wallet", label: "Digital Wallet", icon: Wallet }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? "border-[#1a1a1a] bg-[#fafafa]"
                          : "border-[#e5e5e5] hover:border-[#c4c4c4]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          paymentMethod === method.id ? "bg-[#1a1a1a] text-white" : "bg-[#f5f5f5] text-[#6b6b6b]"
                        }`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold">{method.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id
                          ? "border-[#1a1a1a]"
                          : "border-[#e5e5e5]"
                      }`}>
                        {paymentMethod === method.id && (
                          <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI */}
                {paymentMethod === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-4"
                  >
                    <label className="text-xs font-bold text-[#c4c4c4] uppercase tracking-wider mb-2 block">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="username@upi"
                      className="w-full px-4 py-4 rounded-xl bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#1a1a1a] transition-all outline-none font-medium"
                    />
                  </motion.div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="flex-1 py-4 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] font-bold hover:bg-[#e5e5e5] transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    className="flex-1 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review */}
            {step === "review" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-sm space-y-6">
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">Review Your Order</h2>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {[
                      {
                        title: "Summer Minimalist Dress",
                        designer: "Studio Épure",
                        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=250&fit=crop",
                        price: 4999,
                        qty: 1
                      },
                      {
                        title: "Handcrafted Leather Boots",
                        designer: "WalkFree",
                        image: "https://images.unsplash.com/photo-1520639889313-727216be3b37?w=200&h=250&fit=crop",
                        price: 5499,
                        qty: 1
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#fafafa]">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-white">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1a1a1a]">{item.title}</h4>
                          <p className="text-sm text-[#6b6b6b]">{item.designer}</p>
                          <p className="text-sm font-bold text-[#1a1a1a] mt-2">Qty: {item.qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("payment")}
                      className="flex-1 py-4 rounded-2xl bg-[#f5f5f5] text-[#1a1a1a] font-bold hover:bg-[#e5e5e5] transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex-1 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] p-8 border border-[#e5e5e5] shadow-xl shadow-black/[0.02] sticky top-8 space-y-6">
              <h3 className="text-xl font-bold text-[#1a1a1a]">Order Summary</h3>

              <div className="space-y-4 py-6 border-y border-[#f5f5f5]">
                <div className="flex justify-between text-[#6b6b6b]">
                  <span>Subtotal ({cartSummary.items} items)</span>
                  <span className="font-bold">₹{cartSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-bold">-₹{cartSummary.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6b6b6b]">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#1a1a1a]">Total</span>
                <span className="text-2xl font-bold text-[#1a1a1a]">₹{cartSummary.total.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#6b6b6b] pt-4">
                <Lock className="w-3 h-3" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
