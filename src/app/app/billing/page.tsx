"use client";

import { motion } from "framer-motion";
import { CreditCard, History, Download, CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const INVOICES = [
  { id: "INV-001", date: "Oct 24, 2024", plan: "Pro Plan (Monthly)", amount: "₹499.00", status: "Paid" },
  { id: "INV-002", date: "Sep 24, 2024", plan: "Pro Plan (Monthly)", amount: "₹499.00", status: "Paid" },
  { id: "INV-003", date: "Aug 24, 2024", plan: "Pro Plan (Monthly)", amount: "₹499.00", status: "Paid" },
];

export default function BillingPage() {
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isSubscribed = session?.user?.stripeSubscriptionId && session?.user?.stripePriceId;

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID }), // Requires env variable
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;

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
          className="md:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-violet-200 text-sm font-medium mb-1">Current Plan</p>
                <h2 className="text-3xl font-bold">{isSubscribed ? "Pro Member" : "Free Plan"}</h2>
              </div>
              {isSubscribed && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/10">
                  Active
                </span>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-violet-100">
                <CheckCircle2 className="w-4 h-4" /> Unlimited AI Stylist queries
              </div>
              <div className="flex items-center gap-2 text-sm text-violet-100">
                <CheckCircle2 className="w-4 h-4" /> Priority Salon Booking
              </div>
              <div className="flex items-center gap-2 text-sm text-violet-100">
                <CheckCircle2 className="w-4 h-4" /> Exclusive Marketplace Deals
              </div>
            </div>

            <div className="flex gap-4">
              {!isSubscribed ? (
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Upgrade Plan
                </button>
              ) : (
                <button
                  onClick={handleManage}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border">
              <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center">
                <div className="w-6 h-4 bg-background/50 rounded-sm" />
              </div>
              <div>
                <p className="font-medium text-sm">•••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/28</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
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
              {INVOICES.map((invoice) => (
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
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
