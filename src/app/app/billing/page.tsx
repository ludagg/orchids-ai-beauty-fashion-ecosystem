"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, History, Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const INVOICES = [
  { id: "INV-001", date: "Oct 24, 2024", plan: "Pro Plan (Monthly)", amount: "₹499.00", status: "Paid" },
  { id: "INV-002", date: "Sep 24, 2024", plan: "Pro Plan (Monthly)", amount: "₹499.00", status: "Paid" },
  { id: "INV-003", date: "Aug 24, 2024", plan: "Pro Plan (Monthly)", amount: "₹499.00", status: "Paid" },
];

export default function BillingPage() {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCancelling(false);
    toast.success("Subscription cancellation request received. You will have access until the end of your billing cycle.");
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
          className="md:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-violet-200 text-sm font-medium mb-1">Current Plan</p>
                <h2 className="text-3xl font-bold">Pro Member</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/10">
                Active
              </span>
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
              <button
                className="px-5 py-2.5 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-colors"
                aria-label="Upgrade subscription plan"
              >
                Upgrade Plan
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={isCancelling}
                    className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    aria-label="Cancel subscription"
                  >
                    {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cancel Subscription
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      Cancel Subscription?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your Pro membership? You will lose access to unlimited AI queries and priority bookings at the end of your current period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep My Plan</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
          <button
            className="w-full mt-4 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            aria-label="Update payment card details"
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                          aria-label={`Download invoice ${invoice.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download Invoice</p>
                      </TooltipContent>
                    </Tooltip>
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
