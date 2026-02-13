"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Scissors,
  Heart,
  MapPin,
  Star,
  Play,
  Calendar,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// --- Mock Data ---

const EDITOR_PICK = {
  id: "story-1",
  title: "The Renaissance of Indian Textiles",
  subtitle: "How traditional weaves are taking over the modern runway.",
  image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=2070&auto=format&fit=crop",
  category: "Fashion Edit",
  readTime: "4 min read"
};

const DAILY_EDIT = [
  {
    id: 1,
    type: "event",
    title: "Lakmé Fashion Week",
    subtitle: "Live Stream starts in 2h",
    icon: Play,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    id: 2,
    type: "booking",
    title: "Hair Spa at Luxe",
    subtitle: "Tomorrow, 10:00 AM",
    icon: Calendar,
    color: "text-violet-500",
    bg: "bg-violet-500/10"
  },
  {
    id: 3,
    type: "trend",
    title: "#SareeDraping",
    subtitle: "Trending in your area",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
];

const SHOP_THE_LOOK = [
  { id: 1, name: "Silk Evening Gown", price: "₹15,999", brand: "Studio Épure", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=650&fit=crop" },
  { id: 2, name: "Velvet Blazer", price: "₹6,299", brand: "Kalyan Heritage", image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa1e?w=500&h=650&fit=crop" },
  { id: 3, name: "Leather Biker Jacket", price: "₹8,499", brand: "Neo-Tokyo", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=650&fit=crop" },
  { id: 4, name: "Handwoven Scarf", price: "₹2,499", brand: "Varanasi Weaves", image: "https://images.unsplash.com/photo-1520908695049-da13395b27a6?w=500&h=650&fit=crop" },
];

const SALON_SPOTLIGHT = {
  id: 1,
  name: "Luxe Beauty Lounge",
  location: "Koramangala, Bangalore",
  rating: 4.9,
  reviews: 128,
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
  tags: ["Hair", "Spa", "Bridal"]
};

const FEATURED_VIDEO = {
  id: "vid-1",
  title: "Get Ready With Me: Diwali Edition",
  creator: "Ananya Panday",
  image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=650&fit=crop"
};


// --- Components ---

function SectionHeader({ title, action }: { title: string, action?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-display font-semibold tracking-tight">{title}</h2>
      {action && (
        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          {action} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function DateDisplay() {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }, []);
  return <p className="text-sm font-medium">{date}</p>;
}

export default function DiscoverPage() {
  return (
    <div className="flex-1 min-h-screen bg-background pb-20 lg:pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--secondary)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="p-4 md:p-6 lg:p-8 space-y-16 max-w-[1600px] mx-auto relative z-10">

        {/* --- SECTION 1: Editorial Header --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">

          {/* Main Story Card (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[500px] lg:min-h-0"
          >
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            <img
              src={EDITOR_PICK.image}
              alt={EDITOR_PICK.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-6 left-6 md:top-8 md:left-8">
               <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                {EDITOR_PICK.category}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                {EDITOR_PICK.title}
              </h1>
              <p className="text-white/80 text-lg mb-6 line-clamp-2">
                {EDITOR_PICK.subtitle}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>{EDITOR_PICK.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-white/60" />
                <span className="flex items-center gap-1">Read Story <ArrowRight className="w-4 h-4" /></span>
              </div>
            </div>
          </motion.div>

          {/* Sidebar: The Daily Edit (1/3 width) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground font-medium">Good Morning,</p>
                <h3 className="text-2xl font-display font-semibold">Alex</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Today's Edit</p>
                <DateDisplay />
              </div>
            </motion.div>

            <div className="flex-1 flex flex-col gap-4">
              {DAILY_EDIT.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex-1 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors cursor-pointer group flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Explore Your Feed
            </motion.button>
          </div>
        </section>

        {/* --- SECTION 2: Shop The Look --- */}
        <section>
          <SectionHeader title="Shop The Look" action="View Marketplace" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {SHOP_THE_LOOK.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-black hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <h3 className="font-medium text-foreground text-sm md:text-base leading-tight">{product.name}</h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">{product.brand}</p>
                <p className="font-semibold text-foreground mt-2">{product.price}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: Spotlight (Salon + Video) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Salon Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-card border border-border overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-xl transition-all duration-500"
          >
            <div className="md:w-1/2 relative min-h-[250px] md:min-h-0 overflow-hidden">
               <img
                src={SALON_SPOTLIGHT.image}
                alt={SALON_SPOTLIGHT.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-black shadow-sm">
                Salon of the Month
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between md:w-1/2">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-current" /> {SALON_SPOTLIGHT.rating}
                  </div>
                  <span className="text-xs text-muted-foreground">({SALON_SPOTLIGHT.reviews} reviews)</span>
                </div>
                <h3 className="text-2xl font-display font-semibold mb-2">{SALON_SPOTLIGHT.name}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                  <MapPin className="w-3 h-3" /> {SALON_SPOTLIGHT.location}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {SALON_SPOTLIGHT.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
                Book Now
              </button>
            </div>
          </motion.div>

          {/* Trending Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer aspect-[16/9] lg:aspect-auto"
          >
            <img
              src={FEATURED_VIDEO.image}
              alt={FEATURED_VIDEO.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <span className="inline-block px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                Viral Now
              </span>
              <h3 className="text-2xl font-display font-semibold text-white mb-1">
                {FEATURED_VIDEO.title}
              </h3>
              <p className="text-white/80 text-sm">
                by {FEATURED_VIDEO.creator}
              </p>
            </div>
          </motion.div>

        </section>

      </div>
    </div>
  );
}
