'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, History, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

const INVOICES = [
  { id: 'INV-001', date: 'Oct 24, 2024', plan: 'Pro Plan (Monthly)', amount: '₹499.00', status: 'Paid' },
  { id: 'INV-002', date: 'Sep 24, 2024', plan: 'Pro Plan (Monthly)', amount: '₹499.00', status: 'Paid' },
  { id: 'INV-003', date: 'Aug 24, 2024', plan: 'Pro Plan (Monthly)', amount: '₹499.00', status: 'Paid' },
];

export default function BillingPage() {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      setIsUpgrading(false);
      toast.success('Redirecting to plan options...');
    }, 1000);
  };

  const handleUpdateCard = () => {
    setIsUpdatingCard(true);
    setTimeout(() => {
      setIsUpdatingCard(false);
      toast.success('Card update form loaded!');
    }, 1000);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setDownloadingId(invoiceId);
    setTimeout(() => {
      setDownloadingId(null);
      toast.success(`Invoice ${invoiceId} downloaded successfully!`);
    }, 1200);
  };

  const handleCancelSubscription = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setIsCancelDialogOpen(false);
      toast.success('Your subscription has been cancelled.');
    }, 1500);
  };

  return (
    <TooltipProvider>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Billing & Subscription</h1>
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
                  onClick={handleUpgrade}
                  disabled={isUpgrading || isCancelling}
                  className="px-5 py-2.5 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-colors inline-flex items-center justify-center min-w-[120px] disabled:opacity-50"
                >
                  {isUpgrading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-700" />
                  ) : (
                    'Upgrade Plan'
                  )}
                </button>
                <button
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={isUpgrading || isCancelling}
                  className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/10 inline-flex items-center justify-center min-w-[150px] disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
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
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border">
                <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center">
                  <div className="w-6 h-4 bg-background/50 rounded-sm" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">•••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/28</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleUpdateCard}
              disabled={isUpdatingCard}
              className="w-full mt-4 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center justify-center h-10 disabled:opacity-50"
            >
              {isUpdatingCard ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                'Update Card'
              )}
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
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
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
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            disabled={downloadingId !== null}
                            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground inline-flex items-center justify-center w-8 h-8 disabled:opacity-50"
                            aria-label={`Download invoice ${invoice.id}`}
                          >
                            {downloadingId === invoice.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download Invoice {invoice.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Cancel Subscription AlertDialog */}
        <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                We are sad to see you go! Cancelling means you will lose access to unlimited AI Stylist queries, priority bookings, and exclusive deals at the end of your billing cycle.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCancelling}>Keep Plan</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelSubscription();
                }}
                disabled={isCancelling}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
