"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCart = () => {
    setLoading(true);
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
        const res = await fetch(`/api/cart/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        });
        if (res.ok) {
            // Optimistic update or refetch
            setCart((prev: any) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((item: any) =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    )
                };
            });
        }
    } catch (error) {
        toast.error("Failed to update quantity");
    } finally {
        setUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm("Remove this item?")) return;
    setUpdating(true);
    try {
        const res = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
             setCart((prev: any) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.filter((item: any) => item.id !== itemId)
                };
            });
            toast.success("Item removed");
        }
    } catch (error) {
        toast.error("Failed to remove item");
    } finally {
        setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-4 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
    </div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-4">
            <h2 className="text-xl font-bold">Your cart is empty</h2>
            <Button onClick={() => router.push('/app/shop')}>Start Shopping</Button>
        </div>
    );
  }

  // Group items by salon
  const groupedItems = cart.items.reduce((acc: any, item: any) => {
    const salonId = item.product.salon?.id || 'unknown';
    if (!acc[salonId]) {
        acc[salonId] = {
            salon: item.product.salon,
            items: []
        };
    }
    acc[salonId].items.push(item);
    return acc;
  }, {});

  const subtotal = cart.items.reduce((sum: number, item: any) => {
    const price = item.product.salePrice || item.product.originalPrice;
    return sum + (price * item.quantity);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24 container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cart.items.length})</h1>

      <div className="space-y-6">
        {Object.values(groupedItems).map((group: any) => (
            <Card key={group.salon?.id || 'unknown'} className="overflow-hidden">
                <CardHeader className="bg-muted/30 py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        Selling Partner: <span className="text-primary">{group.salon?.name || "Unknown Salon"}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="divide-y p-0">
                    {group.items.map((item: any) => {
                        const price = item.product.salePrice || item.product.originalPrice;
                        return (
                            <div key={item.id} className="flex gap-4 p-4">
                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                    {item.product.mainImageUrl ? (
                                        <Image src={item.product.mainImageUrl} alt={item.product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.selectedOptions?.color && `Color: ${item.selectedOptions.color.name} `}
                                                {item.selectedOptions?.size && `Size: ${item.selectedOptions.size.name}`}
                                            </p>
                                        </div>
                                        <p className="font-semibold">{formatPrice(price * item.quantity)}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border rounded-md">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={updating}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={updating}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)} disabled={updating}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 space-y-4 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex gap-2">
            <Input placeholder="Enter promo code" className="bg-background" />
            <Button variant="outline">Apply</Button>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
        </div>
        <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-bold h-12" onClick={() => router.push('/app/checkout')}>
            Proceed to Booking <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
