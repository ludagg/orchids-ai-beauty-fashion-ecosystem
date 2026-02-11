"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ChevronRight,
  Star,
  ArrowRight,
  TrendingUp,
  Share2,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialWishlistItems = [
  {
    id: "1",
    title: "Summer Minimalist Dress",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    price: "₹4,999",
    rating: 4.8,
    category: "Apparel",
    inStock: true
  },
  {
    id: "4",
    title: "Handcrafted Leather Boots",
    designer: "WalkFree",
    image: "https://images.unsplash.com/photo-1520639889313-727216be3b37?w=400&h=500&fit=crop",
    price: "₹5,499",
    rating: 4.6,
    category: "Footwear",
    inStock: true
  },
  {
    id: "5",
    title: "Celestial Gold Necklace",
    designer: "Aura Jewels",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    price: "₹18,999",
    rating: 4.9,
    category: "Jewelry",
    inStock: false
  }
];

export default function WishlistPage() {
  const [items, setItems] = useState(initialWishlistItems);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">Wishlist</h1>
          <p className="text-muted-foreground mt-1 text-base">You have {items.length} items saved in your collection.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all shadow-xl shadow-black/10 dark:shadow-white/5">
            <ShoppingBag className="w-4 h-4" />
            Add All to Bag
          </button>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
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
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${!item.inStock ? 'grayscale opacity-60' : ''}`}
                />
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Out of Stock Overlay */}
                {!item.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-card/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-foreground shadow-xl border border-border">
                      Out of Stock
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 rounded-2xl bg-card/90 backdrop-blur-md text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-3 rounded-2xl bg-card/90 backdrop-blur-md text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {item.inStock && (
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-primary text-primary-foreground opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl flex items-center justify-between cursor-pointer hover:bg-rose-600">
                    <p className="text-xs font-bold uppercase tracking-widest pl-2">Add to Bag</p>
                    <Plus className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="px-1">
                <div className="flex items-center justify-between mb-1">
                  <Link href={`/app/marketplace/${item.id}`}>
                    <h3 className="font-semibold text-[15px] truncate text-foreground hover:text-rose-600 transition-colors cursor-pointer">{item.title}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-xs font-bold bg-muted px-2 py-0.5 rounded-full text-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2 font-medium">{item.designer}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-rose-600">{item.price}</p>
                  <Link href={`/app/marketplace/${item.id}`} className="text-[11px] font-bold text-foreground uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-1">
                    Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-6">
            <div className="w-24 h-24 rounded-[32px] bg-muted flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Your wishlist is empty</h3>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto font-medium">Save items you love and they'll show up here for you to shop later.</p>
            </div>
            <Link href="/app/marketplace" className="inline-block">
              <button className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-black/10 dark:shadow-white/5 flex items-center gap-2">
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Recommended for You */}
      {items.length > 0 && (
        <section className="pt-20 space-y-8 border-t border-muted">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold font-display tracking-tight text-foreground flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-rose-500" />
              Recommended For You
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-4 border border-border bg-muted">
                  <img
                    src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80&sig=${i+10}`}
                    alt="Recommendation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h4 className="font-bold text-sm text-foreground">Tailored Linen Pants</h4>
                <p className="text-xs text-rose-600 font-bold mt-1">₹3,299</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
