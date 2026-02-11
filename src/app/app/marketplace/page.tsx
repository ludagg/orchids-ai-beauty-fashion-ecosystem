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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight">Marketplace</h1>
          <p className="text-[#6b6b6b] mt-1 text-base">Curated fashion from India's finest designers.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e5e5] bg-white text-sm font-medium hover:bg-[#f5f5f5] transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="h-10 w-px bg-[#e5e5e5] mx-1" />
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-all shadow-lg shadow-black/10">
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
                ? "bg-[#1a1a1a] text-white shadow-md"
                : "bg-white border border-[#e5e5e5] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
            }`}
          >
            {category}
          </button>
        ))}
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
              <div className="relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-3 sm:mb-4 shadow-sm border border-[#e5e5e5] bg-[#f5f5f5]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Overlay Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-rose-500" />
                    New
                  </div>
                </div>

                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-white"
                >
                  <Heart className="w-4 h-4 text-[#1a1a1a]" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hidden sm:flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1a1a1a]">Quick View</p>
                  <ArrowRight className="w-4 h-4 text-[#1a1a1a]" />
                </div>
              </div>

              <div className="px-1">
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <h3 className="font-semibold text-sm sm:text-[15px] truncate text-[#1a1a1a]">{product.title}</h3>
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold bg-[#f5f5f5] px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#6b6b6b] mb-1 sm:mb-2">{product.designer}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-base sm:text-lg text-rose-600">{product.price}</p>
                  <p className="text-[10px] sm:text-[11px] text-[#6b6b6b] hidden sm:block">{product.reviews} reviews</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Load More */}
      <section className="flex justify-center pt-8">
        <button className="px-8 py-4 rounded-2xl border border-[#e5e5e5] bg-white text-sm font-bold hover:bg-[#fafafa] transition-all flex items-center gap-2">
          View More Collections <ChevronRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
