"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  ChevronRight,
  Star,
  Heart,
  TrendingUp,
  Calendar,
  Clock,
  Package,
  CreditCard,
  MapPin,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

// Mock Data
const userProfile = {
  name: "Sarah",
  points: 2450,
  tier: "Gold Member"
};

const upcomingAppointment = {
  salon: "Aura Luxury Spa",
  service: "Hair Spa & Styling",
  date: "Today",
  time: "4:00 PM",
  image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop"
};

const recentOrder = {
  id: "#ORD-2024-88",
  status: "Shipped",
  item: "Silk Evening Gown",
  delivery: "Arriving Tomorrow",
  image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop"
};

const featuredCollections = [
  {
    title: "Summer Minimalist",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    price: "₹4,999",
    tag: "New Arrival"
  },
  {
    title: "Artisan Silk",
    designer: "Kalyan Heritage",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=800&fit=crop",
    price: "₹12,499",
    tag: "Best Seller"
  },
  {
    title: "Urban Techwear",
    designer: "Neo-Tokyo",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop",
    price: "₹7,299",
    tag: "Trending"
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
];

export default function AppPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-10 max-w-[1400px] mx-auto w-full">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-display tracking-tight text-foreground">
            Good Afternoon, {userProfile.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Your style edit is ready. You have <span className="text-foreground font-medium">1 appointment</span> today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground">System Online</span>
          </div>
        </div>
      </motion.section>

      {/* Activity Dashboard (Scrollable on mobile) */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
      >
        {/* Upcoming Appointment Card */}
        <motion.div variants={itemVariants} className="min-w-[300px] flex-1 bg-card rounded-3xl p-5 border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Appointment</p>
                <p className="text-sm font-semibold text-foreground">{upcomingAppointment.date} • {upcomingAppointment.time}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{upcomingAppointment.service}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
              <MapPin className="w-3.5 h-3.5" /> {upcomingAppointment.salon}
            </p>
            <button className="w-full py-2.5 rounded-xl bg-background border border-border text-sm font-medium hover:bg-secondary transition-colors text-foreground">
              View Details
            </button>
          </div>
        </motion.div>

        {/* Recent Order Card */}
        <motion.div variants={itemVariants} className="min-w-[300px] flex-1 bg-card rounded-3xl p-5 border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-24 h-24 text-rose-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Order</p>
                <p className="text-sm font-semibold text-emerald-600">{recentOrder.status}</p>
              </div>
            </div>
            <div className="flex gap-3 mb-4">
              <img src={recentOrder.image} alt="Product" className="w-12 h-16 object-cover rounded-lg bg-secondary" />
              <div>
                <h3 className="text-base font-medium text-foreground line-clamp-1">{recentOrder.item}</h3>
                <p className="text-xs text-muted-foreground mt-1">{recentOrder.delivery}</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-background border border-border text-sm font-medium hover:bg-secondary transition-colors text-foreground">
              Track Order
            </button>
          </div>
        </motion.div>

        {/* Wallet / Rewards Card */}
        <motion.div variants={itemVariants} className="min-w-[280px] md:max-w-xs flex-1 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full -mr-10 -mt-10" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Priisme Wallet</p>
                <h3 className="text-3xl font-bold mt-1">{userProfile.points}</h3>
                <p className="text-white/70 text-xs">Points Available</p>
              </div>
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">{userProfile.tier}</span>
              <button className="text-xs font-bold hover:text-white/80 transition-colors flex items-center gap-1">
                Redeem <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-lg font-semibold mb-4 font-display text-foreground px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "AI Stylist", desc: "Get recommendations", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
            { title: "Virtual Fit", desc: "Try on clothes", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
            { title: "Book Salon", desc: "Nearby services", icon: Scissors, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { title: "Wishlist", desc: "3 items saved", icon: Heart, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          ].map((item, i) => (
            <motion.button
              key={item.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-all group text-left shadow-sm"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-[15px] text-foreground truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* Left Column (Feed) */}
        <div className="lg:col-span-8 space-y-10">

          {/* Trending Styles (New Layout) */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 font-display text-foreground">
                <TrendingUp className="w-5 h-5 text-violet-500" />
                Trending Now
              </h2>
              <Link href="/app/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                Explore All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trendingStyles.slice(0, 4).map((style, i) => (
                <motion.div
                  key={style.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border shadow-sm">
                    <img src={style.image} alt={style.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs font-bold">{style.title}</p>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-foreground truncate">{style.title}</h3>
                  <p className="text-xs text-muted-foreground">{style.items}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Featured Collection (Large Cards) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2 font-display text-foreground">
                <ShoppingBag className="w-6 h-6 text-rose-500" />
                Curated Collections
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredCollections.slice(0, 2).map((item, i) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer relative"
                >
                  <div className="aspect-[4/5] rounded-[32px] overflow-hidden relative shadow-md">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                      {item.tag}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <p className="text-white/80 text-sm font-medium mb-1">{item.designer}</p>
                      <h3 className="text-2xl font-display font-semibold text-white mb-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{item.price}</span>
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Video Commerce Banner */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[32px] overflow-hidden bg-foreground dark:bg-card text-white p-8 sm:p-12 shadow-2xl shadow-black/20 border border-border group"
          >
            <div className="relative z-20 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-card animate-pulse" />
                Live Now
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold mb-4 font-display leading-tight text-white">Video Commerce Experience</h3>
              <p className="text-white/70 text-base mb-8 leading-relaxed">
                Watch top creators review the latest collections and shop instantly from the video feed.
              </p>
              <button className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10">
                Join Live Stream <Video className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-3/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
                alt="Live Commerce"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-8">

          {/* AI Stylist Daily Look (New Feature) */}
          <div className="p-6 rounded-[32px] bg-card border border-border shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-foreground">Your Daily Look</h3>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 group cursor-pointer">
               <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop" alt="Daily Look" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
               <div className="absolute bottom-4 right-4 flex gap-2">
                 <button className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                   <Heart className="w-5 h-5" />
                 </button>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-foreground">Casual Friday Chic</h4>
                  <p className="text-sm text-muted-foreground">Based on Bangalore weather</p>
                </div>
                <span className="text-sm font-bold text-violet-600">98% Match</span>
              </div>
              <button className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors">
                View Full Outfit
              </button>
            </div>
          </div>

          {/* Nearby Salons */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 font-display text-foreground">
                <Scissors className="w-5 h-5 text-blue-500" />
                Nearby Salons
              </h2>
              <Link href="/app/salons" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {nearbySalons.map((salon, i) => (
                <motion.div
                  key={salon.name}
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-4 p-3 bg-card rounded-2xl border border-transparent hover:border-border hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                    <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 py-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-foreground truncate">{salon.name}</h4>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {salon.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{salon.location}</p>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       <span className="text-[10px] font-medium text-muted-foreground">Open Now</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

           {/* Style Quiz CTA */}
           <div className="p-6 rounded-[32px] bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-[50px] rounded-full -mr-20 -mt-20" />
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-white mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-2 font-display">Refine Your Style</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                Take the quiz to get better recommendations.
              </p>
              <button className="w-full py-3 rounded-xl bg-white text-rose-600 text-sm font-bold hover:bg-rose-50 transition-colors shadow-lg">
                Start Quiz
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
