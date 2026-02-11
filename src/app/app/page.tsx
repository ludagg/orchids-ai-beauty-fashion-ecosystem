"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  Search,
  Bell,
  User,
  LayoutDashboard,
  TrendingUp,
  Heart,
  Calendar,
  Settings,
  ArrowRight,
  ChevronRight,
  Star,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Sparkles, label: "AI Stylist" },
  { icon: Scissors, label: "Salons" },
  { icon: Video, label: "Live Commerce" },
];

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

export default function AppPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-[#e5e5e5] bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="text-xl font-semibold tracking-tight font-display">
            Priisme
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/10"
                  : "text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-violet-500/10 border border-rose-200/20">
            <p className="text-xs font-semibold text-rose-600 mb-1 uppercase tracking-wider">AI Insight</p>
            <p className="text-sm text-[#1a1a1a] font-medium leading-relaxed">
              Your style profile is 85% complete. Finish it to unlock personal picks.
            </p>
            <button className="mt-3 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Complete Profile <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-[#e5e5e5]">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="lg:hidden h-16 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold font-display">
          Priisme
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[50] bg-white lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-[#e5e5e5]">
              <span className="text-xl font-semibold font-display">Priisme</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between py-4 text-xl font-medium border-b border-[#e5e5e5] ${
                    item.active ? "text-[#1a1a1a]" : "text-[#6b6b6b]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative overflow-x-hidden">
        {/* Header - Desktop Search */}
        <header className="hidden lg:flex h-16 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 items-center justify-between">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
            <input
              type="text"
              placeholder="Search fashion, salons, styles..."
              className="w-full pl-10 pr-4 py-2 bg-[#f5f5f5] border-transparent focus:bg-white focus:border-[#e5e5e5] rounded-full text-sm transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 rounded-full hover:bg-[#f5f5f5] transition-colors relative">
              <Bell className="w-5 h-5 text-[#6b6b6b]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[#f5f5f5] transition-colors border border-transparent hover:border-[#e5e5e5]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 flex items-center justify-center text-white font-medium text-xs">
                JD
              </div>
              <span className="text-sm font-medium hidden sm:inline">Guest User</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          {/* Welcome Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight">Welcome back!</h1>
                <p className="text-[#6b6b6b] mt-1 text-base">Explore India's most intelligent fashion ecosystem.</p>
              </div>
              <div className="flex items-center gap-3 bg-white p-2 px-3 rounded-2xl border border-[#e5e5e5] shadow-sm">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#f5f5f5] overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#6b6b6b]">
                  <span className="font-semibold text-[#1a1a1a]">12k+</span> stylists online
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
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e5e5] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all group text-left shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px]">{item.title}</h3>
                  <p className="text-xs text-[#6b6b6b] mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#c4c4c4] ml-auto group-hover:text-[#1a1a1a] transition-colors" />
              </motion.button>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Marketplace Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2 font-display">
                  <ShoppingBag className="w-5 h-5 text-rose-500" />
                  Featured Marketplace
                </h2>
                <button className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] flex items-center gap-1 transition-colors">
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
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm border border-[#e5e5e5]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        <Heart className="w-4 h-4 text-[#1a1a1a]" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-[15px] truncate">{item.title}</h3>
                    <p className="text-sm text-[#6b6b6b] mt-0.5">{item.designer}</p>
                    <p className="font-bold text-[15px] mt-1 text-rose-600">{item.price}</p>
                  </motion.div>
                ))}
              </div>

              {/* Promo Banner */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative rounded-[32px] overflow-hidden bg-[#1a1a1a] text-white p-8 sm:p-12 shadow-2xl shadow-black/20"
              >
                <div className="relative z-10 max-w-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Now
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-semibold mb-4 font-display leading-tight">Video Commerce Experience</h3>
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
                  <h2 className="text-xl font-semibold flex items-center gap-2 font-display">
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
                      className="flex gap-4 group cursor-pointer bg-white p-3 rounded-2xl border border-transparent hover:border-[#e5e5e5] hover:shadow-sm transition-all"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-[15px] group-hover:text-blue-600 transition-colors truncate">{salon.name}</h4>
                          <div className="flex items-center gap-1 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {salon.rating}
                          </div>
                        </div>
                        <p className="text-xs text-[#6b6b6b] mb-3">{salon.location}</p>
                        <button className="text-xs font-bold text-[#1a1a1a] hover:text-blue-600 transition-colors flex items-center gap-1 group/btn">
                          Book Now <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Stylist Preview */}
              <div className="p-8 rounded-[32px] bg-white border border-[#e5e5e5] space-y-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[40px] rounded-full -mr-16 -mt-16" />
                <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 font-display">AI Stylist Picks</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">
                    Based on your unique style DNA, we&apos;ve found 3 new outfits that match your profile.
                  </p>
                </div>
                <div className="flex gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex-1 aspect-square rounded-2xl bg-[#f5f5f5] overflow-hidden border border-[#e5e5e5] group-hover:border-violet-200 transition-colors">
                      <img src={`https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop&q=80&sig=${i}`} alt="recom" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-white text-[15px] font-bold hover:bg-[#333] transition-all active:scale-[0.98] shadow-lg shadow-black/10">
                  Explore Your Style
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
