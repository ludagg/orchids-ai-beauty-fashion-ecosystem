"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  Search,
  Bell,
  LayoutDashboard,
  Settings,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Heart
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app" },
  { icon: ShoppingBag, label: "Marketplace", href: "/app/marketplace" },
  { icon: Sparkles, label: "AI Stylist", href: "/app/ai-stylist" },
  { icon: Scissors, label: "Salons", href: "/app/salons" },
  { icon: Video, label: "Live Commerce", href: "/app/live-commerce" },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/10"
                    : "text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
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
          <Link
            href="/app/settings"
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              pathname === "/app/settings" ? "text-[#1a1a1a]" : "text-[#6b6b6b] hover:text-[#1a1a1a]"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
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
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`w-full flex items-center justify-between py-4 text-xl font-medium border-b border-[#e5e5e5] ${
                      isActive ? "text-[#1a1a1a]" : "text-[#6b6b6b]"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <item.icon className="w-6 h-6" />
                      {item.label}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                );
              })}
              <Link
                href="/app/wishlist"
                className={`w-full flex items-center justify-between py-4 text-xl font-medium border-b border-[#e5e5e5] ${
                  pathname === "/app/wishlist" ? "text-[#1a1a1a]" : "text-[#6b6b6b]"
                }`}
              >
                <span className="flex items-center gap-4">
                  <Heart className="w-6 h-6" />
                  Wishlist
                </span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col relative overflow-x-hidden">
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
            <Link href="/app/wishlist" className="p-2 rounded-full hover:bg-[#f5f5f5] transition-colors relative">
              <Heart className={`w-5 h-5 ${pathname === '/app/wishlist' ? 'text-rose-500 fill-rose-500' : 'text-[#6b6b6b]'}`} />
            </Link>
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

        <main className="flex-1 min-h-0 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
