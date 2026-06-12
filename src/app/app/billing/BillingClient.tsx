"use client";

import { motion } from "framer-motion";
import { CreditCard, History, Download, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BillingClientProps {
  subscription: any;
  invoices: any[];
}

export function BillingClient({ subscription, invoices }: BillingClientProps) {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const isPro = subscription?.status === "active";

  const handleUpgrade = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "dummy_price_id" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleManage = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to open portal");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription plan and payment methods.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:col-span-2 rounded-2xl p-6 text-white relative overflow-hidden ${
            isPro ? "bg-gradient-to-br from-violet-600 to-indigo-700" : "bg-zinc-800"
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className={`${isPro ? "text-violet-200" : "text-zinc-400"} text-sm font-medium mb-1`}>Current Plan</p>
                <h2 className="text-3xl font-bold">{isPro ? "Pro Member" : "Free Plan"}</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isPro ? "bg-white/20 backdrop-blur-md border-white/10" : "bg-zinc-700 border-zinc-600"
              }`}>
                {isPro ? "Active" : "Basic"}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className={`flex items-center gap-2 text-sm ${isPro ? "text-violet-100" : "text-zinc-300"}`}>
                <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-white" : "text-zinc-500"}`} /> Unlimited AI Stylist queries
              </div>
              <div className={`flex items-center gap-2 text-sm ${isPro ? "text-violet-100" : "text-zinc-300"}`}>
                <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-white" : "text-zinc-500"}`} /> Priority Salon Booking
              </div>
              <div className={`flex items-center gap-2 text-sm ${isPro ? "text-violet-100" : "text-zinc-300"}`}>
                <CheckCircle2 className={`w-4 h-4 ${isPro ? "text-white" : "text-zinc-500"}`} /> Exclusive Marketplace Deals
              </div>
            </div>

            <div className="flex gap-4">
              {!isPro ? (
                 <button
                  onClick={handleUpgrade}
                  disabled={loadingCheckout}
                  className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-colors disabled:opacity-50"
                 >
                   {loadingCheckout ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                   Upgrade Plan
                 </button>
              ) : (
                <button
                  onClick={handleManage}
                  disabled={loadingPortal}
                  className="flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/10 disabled:opacity-50"
                >
                  {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Manage Subscription
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h3>
            {isPro ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border">
                  <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center">
                    <div className="w-6 h-4 bg-background/50 rounded-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Managed via Stripe</p>
                    <p className="text-xs text-muted-foreground">Click manage to update</p>
                  </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No payment method on file. Upgrade to add one.</p>
            )}

          </div>
          <button
            onClick={handleManage}
            disabled={!isPro || loadingPortal}
            className="w-full mt-4 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Update Card
          </button>
        </motion.div>
      </div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" /> Billing History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice: any) => (
                <tr key={invoice.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{invoice.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{invoice.date}</td>
                  <td className="px-6 py-4 text-foreground">{invoice.plan}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="inline-block p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                       No invoice history available.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
