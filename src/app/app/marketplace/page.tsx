"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  Heart,
  ChevronRight,
  Star,
  ArrowRight,
  TrendingUp,
  Tag
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = ["All", "Apparel", "Footwear", "Accessories", "Jewelry", "Beauty"];

const products = [
  {
    id: "1",
    title: "Summer Minimalist Dress",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    price: "₹4,999",
    rating: 4.8,
    reviews: 124,
    category: "Apparel"
  },
  {
    id: "2",
    title: "Artisan Silk Saree",
    designer: "Kalyan Heritage",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop",
    price: "₹12,499",
    rating: 4.9,
    reviews: 86,
    category: "Apparel"
  },
  {
    id: "3",
    title: "Neo-Tokyo Tech Jacket",
    designer: "Neo-Tokyo",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
    price: "₹7,299",
    rating: 4.7,
    reviews: 210,
    category: "Apparel"
  },
  {
    id: "4",
    title: "Handcrafted Leather Boots",
    designer: "WalkFree",
    image: "https://images.unsplash.com/photo-1520639889313-727216be3b37?w=400&h=500&fit=crop",
    price: "₹5,499",
    rating: 4.6,
    reviews: 45,
    category: "Footwear"
  },
  {
    id: "5",
    title: "Celestial Gold Necklace",
    designer: "Aura Jewels",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    price: "₹18,999",
    rating: 4.9,
    reviews: 32,
    category: "Jewelry"
  },
  {
    id: "6",
    title: "Modernist Canvas Tote",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1544816153-0973055cb755?w=400&h=500&fit=crop",
    price: "₹1,999",
    rating: 4.5,
    reviews: 156,
    category: "Accessories"
  }
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-base">Curated fashion from India's finest designers.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="h-10 w-px bg-border mx-1" />
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/10">
            <TrendingUp className="w-4 h-4" />
            Trends
          </button>
        </div>
      </section>

      {/* Categories Scroll */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Curated for You Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold font-display tracking-tight text-foreground">
            Curated for <span className="bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">You</span>
          </h2>
          <button className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors">
            Refine Profile
          </button>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {products.slice(0, 4).map((product, i) => (
            <div key={`curated-${product.id}`} className="flex-shrink-0 w-[240px] sm:w-[280px] group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-3 border border-border bg-card shadow-sm">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                    95% Match
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-sm truncate text-foreground">{product.title}</h3>
              <p className="text-xs text-muted-foreground mb-1">{product.designer}</p>
              <p className="font-bold text-sm text-foreground">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group"
          >
            <Link href={`/app/marketplace/${product.id}`} className="block">
              <div className="relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-3 sm:mb-4 shadow-sm border border-border bg-secondary">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Overlay Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 text-foreground">
                    <Tag className="w-3 h-3 text-rose-500" />
                    New
                  </div>
                </div>

                <button
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg active:scale-90 ${
                    wishlistedIds.includes(product.id)
                      ? "bg-rose-500 text-white opacity-100"
                      : "bg-background/90 text-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-background"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlistedIds.includes(product.id) ? "fill-current" : ""}`} />
                </button>

                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-background/90 backdrop-blur-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hidden sm:flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">Quick View</p>
                  <ArrowRight className="w-4 h-4 text-foreground" />
                </div>
              </div>

              <div className="px-1">
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <h3 className="font-semibold text-sm sm:text-[15px] truncate text-foreground">{product.title}</h3>
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold bg-secondary px-2 py-0.5 rounded-full text-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{product.designer}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-base sm:text-lg text-rose-600">{product.price}</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block">{product.reviews} reviews</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Load More */}
      <section className="flex justify-center pt-8">
        <button className="px-8 py-4 rounded-2xl border border-border bg-card text-foreground text-sm font-bold hover:bg-secondary transition-all flex items-center gap-2">
          View More Collections <ChevronRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
