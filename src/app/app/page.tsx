"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Play,
  Calendar,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Mock Data
const CATEGORIES = [
  { id: "all", label: "For You", icon: Sparkles },
  { id: "salons", label: "Salons", icon: Scissors },
  { id: "styles", label: "Styles", icon: TrendingUp },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "videos", label: "Videos", icon: Video },
];

const HERO_SLIDES = [
  {
    id: 1,
    title: "Summer Glow Up",
    subtitle: "Discover the best salons for your summer look.",
    cta: "Book Now",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop",
    color: "from-rose-500 to-orange-500"
  },
  {
    id: 2,
    title: "New Designer Drops",
    subtitle: "Shop exclusive runway pieces.",
    cta: "Shop Collection",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: 3,
    title: "AI Style Assistant",
    subtitle: "Get personalized outfit recommendations.",
    cta: "Try AI Stylist",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=600&fit=crop",
    color: "from-emerald-500 to-teal-500"
  }
];

const TRENDING_STYLES = [
  { id: 1, title: "Boho Chic", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop", creator: "@sarastyle", likes: "2.4k" },
  { id: 2, title: "Urban Edge", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop", creator: "@cityvibe", likes: "1.8k" },
  { id: 3, title: "Minimalist", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop", creator: "@pure", likes: "3.1k" },
  { id: 4, title: "Classic", image: "https://images.unsplash.com/photo-1550614000-4b9519e09063?w=400&h=500&fit=crop", creator: "@timeless", likes: "950" },
];

const TOP_SALONS = [
  { id: 1, name: "Luxe Beauty Lounge", location: "Koramangala, Bangalore", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop", tags: ["Hair", "Spa"] },
  { id: 2, name: "The Grooming Co.", location: "Indiranagar, Bangalore", rating: 4.8, reviews: 95, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", tags: ["Men", "Beard"] },
  { id: 3, name: "Urban Sanctuary", location: "Whitefield, Bangalore", rating: 4.7, reviews: 210, image: "https://images.unsplash.com/photo-1521590832169-7dad1a9b70e6?w=600&h=400&fit=crop", tags: ["Massage", "Facial"] },
];

const MARKETPLACE_PICKS = [
  { id: 1, name: "Silk Evening Gown", price: "₹15,999", brand: "Studio Épure", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop", discount: "20% OFF" },
  { id: 2, name: "Leather Biker Jacket", price: "₹8,499", brand: "Neo-Tokyo", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", isNew: true },
  { id: 3, name: "Velvet Blazer", price: "₹6,299", brand: "Kalyan Heritage", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f684?w=400&h=500&fit=crop" },
  { id: 4, name: "Designer Handbag", price: "₹12,499", brand: "Vogue", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop", isNew: true },
];

const VIDEO_CLIPS = [
  { id: 1, title: "Summer Hair Trends", creator: "@hairbyjess", views: "12k", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=600&fit=crop" },
  { id: 2, title: "Makeup Tutorial 101", creator: "@glamguru", views: "8.5k", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=600&fit=crop" },
  { id: 3, title: "OOTD Inspiration", creator: "@fashionista", views: "22k", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop" },
  { id: 4, title: "Skincare Routine", creator: "@skinfirst", views: "5k", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=600&fit=crop" },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredContent = () => {
    switch (activeCategory) {
      case "salons":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOP_SALONS.map((salon, i) => (
              <SalonCard key={salon.id} salon={salon} index={i} />
            ))}
          </div>
        );
      case "styles":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING_STYLES.map((style, i) => (
              <StyleCard key={style.id} style={style} index={i} />
            ))}
          </div>
        );
      case "shop":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {MARKETPLACE_PICKS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        );
      case "videos":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {VIDEO_CLIPS.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-12">
            <HeroCarousel slides={HERO_SLIDES} />

            <SectionHeader title="Trending Styles" icon={Sparkles} href="/app/styles" />
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth no-scrollbar">
              {TRENDING_STYLES.map((style, i) => (
                <div key={style.id} className="w-[180px] flex-shrink-0">
                  <StyleCard style={style} index={i} />
                </div>
              ))}
            </div>

            <SectionHeader title="Top Rated Salons" icon={Scissors} href="/app/salons" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOP_SALONS.slice(0, 2).map((salon, i) => (
                <SalonCard key={salon.id} salon={salon} index={i} />
              ))}
            </div>

            <SectionHeader title="Recommended For You" icon={ShoppingBag} href="/app/shop" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MARKETPLACE_PICKS.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-background pb-20 lg:pb-10">

      {/* Welcome Header */}
      <div className="px-6 py-6 pb-2">
        <h1 className="text-2xl font-bold font-display">Good Morning, Alex!</h1>
        <p className="text-muted-foreground text-sm">Ready for your glow up today?</p>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 py-3 px-6 transition-[top] duration-300">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-foreground text-background shadow-lg scale-105"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-background" : ""}`} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Sub-components for cleaner code

function HeroCarousel({ slides }: { slides: typeof HERO_SLIDES }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  return (
    <div className="relative rounded-[32px] overflow-hidden aspect-[16/10] md:aspect-[21/9] group shadow-2xl shadow-black/5">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${slides[current].color} text-white text-xs font-bold mb-4 uppercase tracking-wider shadow-lg`}>
                Featured
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-3 leading-tight">
                {slides[current].title}
              </h2>
              <p className="text-white/90 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                {slides[current].subtitle}
              </p>
              <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl">
                {slides[current].cta} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, href }: { title: string, icon: any, href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold font-display flex items-center gap-2 text-foreground">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h3>
      <Link href={href} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group">
        View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function StyleCard({ style, index }: { style: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md border border-border bg-secondary">
        <img src={style.image} alt={style.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-rose-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 text-white translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full">{style.creator}</p>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm truncate text-foreground">{style.title}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> {style.likes}
        </div>
      </div>
    </motion.div>
  );
}

function VideoCard({ video, index }: { video: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-3 shadow-md border border-border bg-black">
        <img src={video.image} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full inline-block mb-1">{video.views} views</p>
          <p className="font-semibold text-sm truncate">{video.title}</p>
          <p className="text-xs opacity-80">{video.creator}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SalonCard({ salon, index }: { salon: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col sm:flex-row bg-card p-4 rounded-3xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-full"
    >
      <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 relative">
        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold flex items-center gap-1 text-black">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {salon.rating}
        </div>
      </div>
      <div className="sm:ml-5 flex-1 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{salon.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {salon.location}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {salon.tags?.map((tag: string) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">Open Now</span>
          <button className="text-sm font-bold text-primary hover:underline">
            Book
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index }: { product: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border bg-secondary">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {product.discount && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-md shadow-sm">
            {product.discount}
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-sm">
            NEW
          </div>
        )}

        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-rose-500 hover:scale-110">
          <Heart className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
          <button className="w-full py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors shadow-lg">
            Add to Bag
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <p className="font-bold text-sm text-foreground">{product.price}</p>
      </div>
    </motion.div>
  );
}
