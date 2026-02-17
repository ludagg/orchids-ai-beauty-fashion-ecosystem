"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { stripePromise } from "@/lib/stripe-client";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { items, totalAmount, clearCart } = useCart();
  const { data: session } = useSession();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Shipping State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: session?.user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  // Load user data if available
  useEffect(() => {
    if (session?.user) {
        setShippingInfo(prev => ({ ...prev, fullName: session.user.name || "" }));
    }
  }, [session]);


  const handleShippingSubmit = async () => {
    // Validate inputs
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode) {
        toast.error("Please fill in all shipping details");
        return;
    }

    setIsProcessing(true);

    try {
        const res = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: items.map(item => ({ id: item.id, quantity: item.quantity })),
                shippingAddress: shippingInfo
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.error || "Failed to initiate payment");
            setIsProcessing(false);
            return;
        }

        setClientSecret(data.clientSecret);
        setStep(2);
    } catch (error) {
        console.error("Payment initiation error:", error);
        toast.error("Something went wrong");
    } finally {
        setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    clearCart();
  };

  // Helper to format currency
  const formatPrice = (amount: number) => {
    return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  // Calculate totals (assuming items price is in native currency units like mock data, but need consistency)
  // Based on CartPage: context totalAmount is sum(price * qty).
  // Check if we need to convert units.
  // In `create-payment-intent`, we fetch product price from DB (cents).
  // In `CartContext`, we stored price from product (cents).
  // So totalAmount is in cents.

  const subtotal = totalAmount;
  const shipping = subtotal > 500000 ? 0 : 15000;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-12 rounded-[48px] bg-card border border-border text-center shadow-2xl space-y-8"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Order Placed!</h1>
            <p className="text-muted-foreground leading-relaxed">
              Your order has been successfully placed and is being processed.
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <Link href="/app/bookings?tab=Orders" className="block w-full">
              <button className="w-full py-4 rounded-2xl bg-foreground text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-foreground/10">
                Track Order
              </button>
            </Link>
            <Link href="/app" className="block w-full">
              <button className="w-full py-4 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <Link href="/app/cart" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Bag
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-foreground uppercase tracking-widest">Secure Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Shipping */}
          <section className={`p-8 rounded-[40px] border transition-all ${step === 1 ? "bg-card border-foreground shadow-xl" : "bg-background border-border opacity-60"}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step === 1 ? "bg-foreground text-white" : "bg-muted text-muted-foreground/50"}`}>1</div>
                <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
              </div>
              {step > 1 && <button onClick={() => setStep(1)} className="text-sm font-bold text-rose-600 hover:underline">Edit</button>}
            </div>

            {step === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Address</label>
                  <input
                    type="text"
                    placeholder="House No, Street, Landmark"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">City</label>
                  <input
                    type="text"
                    placeholder="Bangalore"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="560001"
                    value={shippingInfo.pincode}
                    onChange={(e) => setShippingInfo({...shippingInfo, pincode: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all"
                  />
                </div>
                <div className="sm:col-span-2 pt-4">
                  <button
                    onClick={handleShippingSubmit}
                    disabled={isProcessing || items.length === 0}
                    className="w-full py-4 rounded-2xl bg-foreground text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Payment"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.pincode}</span>
              </div>
            )}
          </section>

          {/* Step 2: Payment */}
          <section className={`p-8 rounded-[40px] border transition-all ${step === 2 ? "bg-card border-foreground shadow-xl" : "bg-background border-border opacity-60"}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step === 2 ? "bg-foreground text-white" : "bg-muted text-muted-foreground/50"}`}>2</div>
              <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
            </div>

            {step === 2 && clientSecret && (
              <div className="space-y-6">
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <CheckoutForm onSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
            )}

            {step === 2 && !clientSecret && (
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Initializing payment...</p>
                </div>
            )}
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <div className="p-8 rounded-[40px] bg-card border border-border space-y-6 shadow-sm">
            <h3 className="font-bold text-foreground">Review Bag</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.image} alt="item" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-sm font-bold text-foreground line-clamp-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-border my-6" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={`font-bold ${shipping === 0 ? "text-emerald-600" : "text-foreground"}`}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="font-bold">{formatPrice(tax)}</span>
              </div>
              <div className="flex items-center justify-between text-lg pt-4 border-t border-border mt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold text-rose-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-emerald-50 border border-emerald-100 space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold">Rare Protection</h3>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Every order on Rare is protected. If your item is not as described or never arrives, we'll refund your full purchase price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
