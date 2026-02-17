"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const subtotal = cartTotal;
  const shipping = items.length > 0 && subtotal < 500000 ? 15000 : 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const handlePlaceOrder = async () => {
    if (!session) {
        toast.error("Please login to checkout");
        router.push("/auth?mode=signin");
        return;
    }

    setIsProcessing(true);
    try {
        const payload = {
            items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            setOrderId(data.orderId);
            clearCart();
            setIsSuccess(true);
            toast.success("Order placed successfully!");
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to place order");
        }
    } catch (e) {
        console.error(e);
        toast.error("Something went wrong");
    } finally {
        setIsProcessing(false);
    }
  };

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
              Your order #{orderId || "unknown"} has been successfully placed and is being processed.
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
                  <input type="text" placeholder="John Doe" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Phone Number</label>
                  <input type="text" placeholder="+91 98765 43210" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Address</label>
                  <input type="text" placeholder="House No, Street, Landmark" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">City</label>
                  <input type="text" placeholder="Bangalore" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Pincode</label>
                  <input type="text" placeholder="560001" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                </div>
                <div className="sm:col-span-2 pt-4">
                  <button onClick={() => setStep(2)} className="w-full py-4 rounded-2xl bg-foreground text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-foreground/10">
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Indiranagar, Bangalore, 560038</span>
              </div>
            )}
          </section>

          {/* Step 2: Payment */}
          <section className={`p-8 rounded-[40px] border transition-all ${step === 2 ? "bg-card border-foreground shadow-xl" : "bg-background border-border opacity-60"}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step === 2 ? "bg-foreground text-white" : "bg-muted text-muted-foreground/50"}`}>2</div>
              <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
            </div>

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-2xl border-2 border-foreground bg-foreground/5 flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-bold">Card</span>
                  </button>
                  <button className="p-4 rounded-2xl border-2 border-border hover:border-foreground transition-all flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-xs font-bold">UPI</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">CVV</label>
                      <input type="text" placeholder="xxx" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border outline-none text-sm transition-all" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-5 rounded-2xl bg-foreground text-white font-bold text-lg hover:bg-[#333] transition-all shadow-xl shadow-foreground/10 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <div className="p-8 rounded-[40px] bg-card border border-border space-y-6 shadow-sm">
            <h3 className="font-bold text-foreground">Review Bag</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-sm font-bold text-foreground line-clamp-1">{item.name}</p>
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
                <span className="font-bold text-emerald-600">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
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
