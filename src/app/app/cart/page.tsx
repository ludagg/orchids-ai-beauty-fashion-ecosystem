"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);

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

  const removeItem = (itemId: string, itemName: string) => {
    setItemToRemove({ id: itemId, name: itemName });
  };

  const confirmRemove = async () => {
    if (!itemToRemove || updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/cart/${itemToRemove.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCart((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter((item: any) => item.id !== itemToRemove.id),
          };
        });
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(false);
      setItemToRemove(null);
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
      <div className="min-h-[70vh] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#262626_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500 rounded-full blur-[100px]"
        />

        <Empty className="relative z-10 bg-card/50 backdrop-blur-sm border-none shadow-xl max-w-md w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-rose-500/10 text-rose-500">
              <ShoppingCart className="w-6 h-6" />
            </EmptyMedia>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyDescription>
              Looks like you haven't added anything to your cart yet. Discover curated fashion and beauty products from our partners.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 font-semibold"
              onClick={() => router.push('/app/marketplace')}
            >
              Start Shopping
            </Button>
          </EmptyContent>
        </Empty>
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
                                        <div className="flex items-center border rounded-md overflow-hidden">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 rounded-none border-r"
                                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                              disabled={updating}
                                              aria-label={`Decrease quantity of ${item.product.name}`}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm font-medium" aria-label={`Quantity: ${item.quantity}`}>
                                              {item.quantity}
                                            </span>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 rounded-none border-l"
                                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                              disabled={updating}
                                              aria-label={`Increase quantity of ${item.product.name}`}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                                              onClick={() => removeItem(item.id, item.product.name)}
                                              disabled={updating}
                                              aria-label={`Remove ${item.product.name} from cart`}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">Remove item</TooltipContent>
                                        </Tooltip>
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

      <AlertDialog open={!!itemToRemove} onOpenChange={(open: boolean) => !open && setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{itemToRemove?.name}</span> from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              disabled={updating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {updating ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
