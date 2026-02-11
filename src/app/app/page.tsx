"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  Heart,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

const featuredCollections = [
  {
    title: "Summer Minimalist",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    price: "₹4,999"
  },
  {
    title: "Artisan Silk",
    designer: "Kalyan Heritage",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop",
    price: "₹12,499"
  },
  {
    title: "Urban Techwear",
    designer: "Neo-Tokyo",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
    price: "₹7,299"
  }
];

const nearbySalons = [
  {
    name: "Aura Luxury Spa",
    location: "Indiranagar, Bangalore",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop"
  },
  {
    name: "The Grooming Co.",
    location: "Koramangala, Bangalore",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
  }
];

const trendingStyles = [
  { title: "Boho Chic", items: "124 items", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=400&fit=crop" },
  { title: "Ethic Fusion", items: "89 items", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop" },
  { title: "Street Luxe", items: "210 items", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop" },
  { title: "Minimalist", items: "56 items", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop" },
  { title: "Cyberpunk", items: "34 items", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop" },
];

export default function AppPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Welcome Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground mt-1 text-base">Explore India's most intelligent fashion ecosystem.</p>
          </div>
          <div className="flex items-center gap-3 bg-card p-2 px-3 rounded-2xl border border-border shadow-sm">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-secondary overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">12k+</span> stylists online
            </p>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "AI Stylist", desc: "Get recommendations", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50" },
          { title: "Virtual Fit", desc: "Try on clothes", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
          { title: "Book Salon", desc: "Nearby services", icon: Scissors, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Wishlist", desc: "3 items saved", icon: Heart, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((item, i) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all group text-left shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 ml-auto group-hover:text-foreground transition-colors" />
          </motion.button>
        ))}
      </section>

      {/* Trending Now Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2 font-display text-foreground">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            Trending Now
          </h2>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            Explore All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {trendingStyles.map((style, i) => (
            <motion.div
              key={style.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-sm border border-border">
                <img src={style.image} alt={style.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-bold truncate">{style.title}</p>
                </div>
              </div>
              <h3 className="font-medium text-sm truncate text-foreground">{style.title}</h3>
              <p className="text-xs text-muted-foreground">{style.items}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Marketplace Feed */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2 font-display tracking-tight text-foreground">
              <ShoppingBag className="w-6 h-6 text-rose-500" />
              Featured Marketplace
            </h2>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredCollections.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm border border-border">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button className="absolute top-4 right-4 p-2.5 rounded-full bg-background/90 backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <h3 className="font-semibold text-[15px] truncate text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{item.designer}</p>
                <p className="font-bold text-[15px] mt-1 text-rose-600">{item.price}</p>
              </motion.div>
            ))}
          </div>

          {/* Exclusive for You Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2 font-display tracking-tight text-foreground">
                <Star className="w-6 h-6 text-amber-500" />
                Exclusive for You
              </h2>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {[
                { title: "Silk Evening Gown", price: "₹15,999", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop" },
                { title: "Leather Biker Jacket", price: "₹8,499", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop" },
                { title: "Velvet Blazer", price: "₹6,299", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f684?w=300&h=400&fit=crop" },
                { title: "Embroidered Kurta", price: "₹4,599", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=400&fit=crop" },
              ].map((item, i) => (
                <div key={i} className="flex-shrink-0 w-48 group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border shadow-sm">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>
                  <h4 className="font-semibold text-sm truncate text-foreground">{item.title}</h4>
                  <p className="text-rose-600 font-bold text-sm">{item.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Promo Banner */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[32px] overflow-hidden bg-[#1a1a1a] dark:bg-card text-white p-8 sm:p-12 shadow-2xl shadow-black/20 border border-border"
          >
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Now
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold mb-4 font-display leading-tight text-white">Video Commerce Experience</h3>
              <p className="text-white/70 text-base mb-8 leading-relaxed">
                Watch top creators review the latest collections and shop instantly from the video feed.
              </p>
              <button className="px-8 py-3.5 rounded-full bg-white text-[#1a1a1a] text-sm font-bold hover:bg-white/90 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10">
                Join Live Stream <Video className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-3/5 overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
                alt="Live Commerce"
                className="w-full h-full object-cover opacity-60 scale-105"
              />
            </div>
          </motion.div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Salon Booking */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 font-display text-foreground">
                <Scissors className="w-5 h-5 text-blue-500" />
                Nearby Salons
              </h2>
            </div>

            <div className="space-y-5">
              {nearbySalons.map((salon, i) => (
                <motion.div
                  key={salon.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 group cursor-pointer bg-card p-3 rounded-2xl border border-transparent hover:border-border hover:shadow-sm transition-all"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-[15px] group-hover:text-blue-600 transition-colors truncate text-foreground">{salon.name}</h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {salon.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{salon.location}</p>
                    <button className="text-xs font-bold text-foreground hover:text-blue-600 transition-colors flex items-center gap-1 group/btn">
                      Book Now <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Style Quiz CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[32px] bg-gradient-to-br from-violet-600 to-indigo-700 text-white space-y-6 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 font-display">Uncover Your Style Persona</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Take our 2-minute visual quiz and let our AI build your unique fashion DNA for hyper-personalized recommendations.
              </p>
              <button className="w-full py-4 rounded-2xl bg-white text-[#1a1a1a] text-[15px] font-bold hover:bg-violet-50 transition-all active:scale-[0.98] shadow-lg">
                Start Style Quiz
              </button>
            </div>
          </motion.div>

          {/* AI Stylist Preview */}
          <div className="p-8 rounded-[32px] bg-card border border-border space-y-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[40px] rounded-full -mr-16 -mt-16" />
            <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 font-display text-foreground">AI Stylist Picks</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on your unique style DNA, we&apos;ve found 3 new outfits that match your profile.
              </p>
            </div>
            <div className="flex gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex-1 aspect-square rounded-2xl bg-secondary overflow-hidden border border-border group-hover:border-violet-200 transition-colors">
                  <img src={`https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop&q=80&sig=${i}`} alt="recom" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-2xl bg-[#1a1a1a] dark:bg-primary text-white dark:text-primary-foreground text-[15px] font-bold hover:bg-[#333] dark:hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-black/10">
              Explore Your Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
