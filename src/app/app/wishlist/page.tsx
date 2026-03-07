"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ChevronRight,
  Star,
  ArrowRight,
  Share2,
  Plus,
  Loader2,
  Bell,
  BellOff,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

const PRICE_ALERTS_KEY = "wishlist-price-alerts";

function loadAlerts(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PRICE_ALERTS_KEY) || "{}"); } catch { return {}; }
}

function saveAlerts(alerts: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
}

interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    images: string[];
    category: string;
    salon?: {
        name: string;
    };
    city?: never;
}

interface Salon {
    id: string;
    name: string;
    image: string | null;
    city: string;
    rating: number;
    price?: never;
    category?: never;
}

interface Favorite {
    id: string;
    productId: string | null;
    salonId: string | null;
    product?: Product;
    salon?: Salon;
}

export default function WishlistPage() {
  const [items, setItems] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPriceAlerts(loadAlerts());
    async function fetchFavorites() {
        try {
            const res = await fetch('/api/favorites');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        } finally {
            setLoading(false);
        }
    }
    fetchFavorites();
  }, []);

  const toggleAlert = (itemId: string) => {
    const next = { ...priceAlerts, [itemId]: !priceAlerts[itemId] };
    setPriceAlerts(next);
    saveAlerts(next);
    toast.success(next[itemId] ? "Price alert enabled — we'll notify you!" : "Price alert disabled");
  };

  const shareWishlist = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "My Wishlist on Rare", url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Wishlist link copied to clipboard!");
    }
  };


  const removeItem = async (id: string) => {
    // Optimistic update
    const originalItems = [...items];
    setItems(items.filter(item => item.id !== id));

    try {
        const res = await fetch(`/api/favorites?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Removed from wishlist");
    } catch (error) {
        setItems(originalItems);
        toast.error("Failed to remove item");
    }
  };

  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )
  }

  // Filter out invalid items (e.g. deleted products)
  const validItems = items.filter(item => item.product || item.salon);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full min-h-screen">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">Wishlist</h1>
          <p className="text-muted-foreground mt-1 text-base">You have {validItems.length} items saved in your collection.</p>
        </div>

        {validItems.length > 0 && (
            <div className="flex items-center gap-3">
            <button
              onClick={shareWishlist}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-border text-sm font-bold hover:bg-muted transition-all"
              aria-label="Share Wishlist"
            >
                <Link2 className="w-4 h-4" />
                Share List
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-white text-sm font-bold hover:bg-[#333] transition-all shadow-xl shadow-foreground/10"
              aria-label="Add all items to bag"
            >
                <ShoppingBag className="w-4 h-4" />
                Add All to Bag
            </button>
            </div>
        )}
      </section>

      {/* Wishlist Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {validItems.map((item, i) => {
            const isProduct = !!item.product;

            // Safe access using discriminated types or optional chaining with fallback
            const title = isProduct ? item.product?.name : item.salon?.name;
            const subtitle = isProduct ? item.product?.salon?.name : item.salon?.city;
            const image = isProduct ? item.product?.images?.[0] : item.salon?.image;
            const price = isProduct && item.product ? (item.product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : null;
            const link = isProduct ? `/app/marketplace/${item.product?.id}` : `/app/salons/${item.salon?.id}`;
            const rating = 4.8;

            return (
                <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="group"
                >
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-4 shadow-sm border border-border bg-muted">
                    <img
                    src={image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"}
                    alt={title || "Item"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-3 rounded-2xl bg-card/90 backdrop-blur-md text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                            aria-label={`Remove ${title} from wishlist`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Remove from wishlist</TooltipContent>
                    </Tooltip>

                    {isProduct && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => toggleAlert(item.id)}
                            className={`p-3 rounded-2xl bg-card/90 backdrop-blur-md shadow-lg transition-all ${
                              priceAlerts[item.id]
                                ? "text-amber-500 hover:bg-amber-500 hover:text-white"
                                : "text-foreground hover:bg-foreground hover:text-white"
                            }`}
                            aria-label={priceAlerts[item.id] ? `Disable price alert for ${title}` : `Enable price alert for ${title}`}
                          >
                            {priceAlerts[item.id] ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          {priceAlerts[item.id] ? "Disable price alert" : "Enable price alert"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                    </div>

                    {isProduct && (
                    <button
                      className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-foreground text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl flex items-center justify-between cursor-pointer hover:bg-rose-600 w-[calc(100%-2rem)]"
                      aria-label={`Add ${title} to bag`}
                    >
                        <p className="text-xs font-bold uppercase tracking-widest pl-2 text-left">Add to Bag</p>
                        <Plus className="w-5 h-5" />
                    </button>
                    )}
                </div>

                <div className="px-1">
                    <div className="flex items-center justify-between mb-1">
                    <Link href={link}>
                        <h3 className="font-semibold text-[15px] truncate text-foreground hover:text-rose-600 transition-colors cursor-pointer">{title}</h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs font-bold bg-muted px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {rating}
                    </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 font-medium">{subtitle}</p>
                    <div className="flex items-center justify-between">
                    {price && <p className="font-bold text-lg text-rose-600">{price}</p>}
                    <Link href={link} className="text-[11px] font-bold text-foreground uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-1">
                        Details <ChevronRight className="w-3 h-3" />
                    </Link>
                    </div>
                </div>
                </motion.div>
            );
          })}
        </AnimatePresence>

        {validItems.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center relative overflow-hidden rounded-[40px] border border-dashed bg-card/50 backdrop-blur-sm">
             {/* Decorative Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#262626_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500 rounded-full blur-[100px] -z-10"
            />

            <Empty className="border-none bg-transparent shadow-none">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-rose-500/10 text-rose-500">
                  <Heart className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle className="text-2xl font-bold">Your wishlist is empty</EmptyTitle>
                <EmptyDescription className="max-w-xs mx-auto font-medium">
                  Save items you love and they'll show up here for you to shop later.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-4 rounded-2xl bg-foreground text-white font-bold hover:bg-[#333] transition-all shadow-xl shadow-foreground/10 flex items-center gap-2"
                >
                  <Link href="/app/marketplace">
                    Explore Marketplace <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </section>
    </div>
  );
}
