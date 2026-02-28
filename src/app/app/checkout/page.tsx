"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Wallet, CreditCard, Banknote, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PROMO_CODES: Record<string, number> = {
  "RARE10": 10,
  "WELCOME20": 20,
  "BEAUTY15": 15,
};

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // Fetch cart total
  useEffect(() => {
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
            if (data && data.items) {
                 const total = data.items.reduce((sum: number, item: any) => {
                    const price = item.product.salePrice || item.product.originalPrice;
                    return sum + (price * item.quantity);
                  }, 0);
                  setCartTotal(total);
            }
        });
  }, []);

  const handleApplyPromo = () => {
    const upper = promoCode.trim().toUpperCase();
    if (!upper) return;
    if (appliedPromo?.code === upper) { toast.error("Promo code already applied"); return; }
    if (PROMO_CODES[upper]) {
      setAppliedPromo({ code: upper, discount: PROMO_CODES[upper] });
      toast.success(`Promo code applied — ${PROMO_CODES[upper]}% off!`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.info("Promo code removed");
  };

  const handlePayment = async () => {
    setLoading(true);
    // Mock payment processing
    setTimeout(() => {
        setLoading(false);
        setStep(2);
        toast.success("Payment successful!");
    }, 1500);
  };

  const discountAmount = appliedPromo ? Math.round(cartTotal * appliedPromo.discount / 100) : 0;
  const finalTotal = cartTotal - discountAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  if (step === 2) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4 text-center">
            <div className="rounded-full bg-green-100 p-6">
                <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground max-w-sm">
                Your order has been placed successfully. You can pick it up at the partner salon.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
                <Button className="w-full" onClick={() => router.push('/app/orders')}>View Booking</Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/app/shop')}>Continue Shopping</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup defaultValue="upi" value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                                <Wallet className="h-5 w-5 text-blue-500" />
                                <span>UPI (Google Pay, PhonePe)</span>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                                <CreditCard className="h-5 w-5 text-purple-500" />
                                <span>Credit / Debit Card</span>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted/50">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                                <Banknote className="h-5 w-5 text-green-500" />
                                <span>Pay at Salon</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Pickup Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please show your booking ID at the salon reception to collect your items.
                    </p>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Items Total</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>

                    {/* Promo Code */}
                    {appliedPromo ? (
                      <div className="flex items-center justify-between rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                          <Tag className="w-4 h-4" />
                          <span className="font-mono font-bold">{appliedPromo.code}</span>
                          <span>— {appliedPromo.discount}% off</span>
                        </div>
                        <button onClick={removePromo} className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo code (e.g. RARE10)"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === "Enter" && handleApplyPromo()}
                          className="bg-background font-mono uppercase text-sm"
                        />
                        <Button variant="outline" onClick={handleApplyPromo} className="shrink-0">Apply</Button>
                      </div>
                    )}

                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                        <span>Discount ({appliedPromo.discount}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total to Pay</span>
                        <span>{formatPrice(finalTotal)}</span>
                    </div>
                </CardContent>
            </Card>
             <Button
                className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-bold h-12"
                onClick={handlePayment}
                disabled={loading}
            >
                {loading ? "Processing..." : `Confirm & Pay ${appliedPromo ? formatPrice(finalTotal) : ''}`}
            </Button>
        </div>
      </div>
    </div>
  );
}
