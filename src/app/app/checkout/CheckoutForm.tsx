"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";

export default function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the user is redirected after the payment
        return_url: `${window.location.origin}/app/bookings?success=true`,
      },
      redirect: "if_required", // Handle redirect manually if not required (e.g. for card) or let Stripe handle it
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      toast.error(error.message || "Payment failed");
      setIsLoading(false);
    } else {
      // Payment succeeded (if redirect didn't happen)
      // Clear cart
      clearCart();
      onSuccess();
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      {message && <div id="payment-message" className="text-red-500 text-sm">{message}</div>}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-5 rounded-2xl bg-foreground text-white font-bold text-lg hover:bg-[#333] transition-all shadow-xl shadow-foreground/10 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            Pay Now
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
