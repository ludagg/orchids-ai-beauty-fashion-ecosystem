"use client";

import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Sparkles,
  ArrowRight,
  Filter,
  ShoppingBag,
  Scissors,
  Video,
  Play
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Data (placeholder for real API)
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "salons", label: "Salons" },
  { id: "styles", label: "Styles" },
  { id: "shop", label: "Shop" },
  { id: "videos", label: "Videos" },
];

const FEATURED_HERO = {
  title: "Summer Glow Up",
  subtitle: "Discover the best salons for your summer look.",
  cta: "Explore Now",
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
};

const TRENDING_STYLES = [
  { id: 1, title: "Boho Chic", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop", creator: "@sarastyle" },
  { id: 2, title: "Urban Edge", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop", creator: "@cityvibe" },
  { id: 3, title: "Minimalist", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop", creator: "@pure" },
  { id: 4, title: "Classic", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop", creator: "@timeless" },
];

const TOP_SALONS = [
  { id: 1, name: "Luxe Beauty Lounge", location: "Koramangala, Bangalore", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop" },
  { id: 2, name: "The Grooming Co.", location: "Indiranagar, Bangalore", rating: 4.8, reviews: 95, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop" },
];

const MARKETPLACE_PICKS = [
  { id: 1, name: "Silk Evening Gown", price: "₹15,999", brand: "Studio Épure", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop" },
  { id: 2, name: "Leather Biker Jacket", price: "₹8,499", brand: "Neo-Tokyo", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop" },
  { id: 3, name: "Velvet Blazer", price: "₹6,299", brand: "Kalyan Heritage", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f684?w=400&h=500&fit=crop" },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="flex-1 min-h-screen bg-background pb-20 lg:pb-10">
      {/* Header Section */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between lg:hidden">
            {/* Mobile Header elements if needed, though Layout handles some */}
            <h1 className="text-lg font-semibold font-display">Discover</h1>
             <button
              className="p-2 -mr-2 text-muted-foreground"
              aria-label="Filter results"
             >
              <Filter className="w-5 h-5" />
            </button>
        </div>

        {/* Categories */}
        <div className="px-4 py-3 overflow-x-auto no-scrollbar flex gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-7xl mx-auto">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] group cursor-pointer"
        >
          <img
            src={FEATURED_HERO.image}
            alt={FEATURED_HERO.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3 uppercase tracking-wider">
              Featured
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-2">{FEATURED_HERO.title}</h2>
            <p className="text-white/80 text-sm md:text-lg mb-6">{FEATURED_HERO.subtitle}</p>
            <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
              {FEATURED_HERO.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.section>

        {/* Trending Styles */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Trending Styles
            </h3>
            <Link href="/app/videos-creations" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth no-scrollbar">
            {TRENDING_STYLES.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-48 group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-sm border border-border">
                  <img src={style.image} alt={style.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-medium">{style.creator}</p>
                  </div>
                </div>
                <p className="font-medium text-sm truncate">{style.title}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Salons */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-display flex items-center gap-2">
              <Scissors className="w-5 h-5 text-rose-500" /> Top Rated Salons
            </h3>
            <Link href="/app/salons" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOP_SALONS.map((salon, i) => (
              <motion.div
                key={salon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex bg-card p-3 rounded-2xl border border-border hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="ml-4 flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-foreground">{salon.name}</h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {salon.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {salon.location}
                    </p>
                  </div>
                  <button className="self-start text-xs font-bold text-primary hover:underline mt-2">
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Marketplace Picks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-display flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" /> Recommended For You
            </h3>
            <Link href="/app/marketplace" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MARKETPLACE_PICKS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border bg-secondary">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-background outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <h4 className="font-medium text-sm truncate text-foreground">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="font-bold text-sm text-foreground mt-1">{product.price}</p>
              </motion.div>
            ))}
          </div>
        </section>

         {/* AI Stylist CTA */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[32px] bg-gradient-to-br from-violet-600 to-indigo-700 text-white relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/10">
                  <Sparkles className="w-3 h-3" /> New Feature
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-2 font-display">Not sure what to wear?</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-md">
                  Let our AI Stylist create the perfect look for you based on your unique style DNA.
                </p>
              </div>
              <button className="px-8 py-4 rounded-2xl bg-white text-violet-700 font-bold hover:bg-violet-50 transition-all active:scale-[0.98] shadow-lg whitespace-nowrap">
                Ask AI Stylist
              </button>
            </div>
          </motion.div>

      </div>
    </div>
  );
}
