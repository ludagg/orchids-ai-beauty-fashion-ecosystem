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
  Heart,
  MessageSquare,
  Calendar
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import SearchBar from "@/components/SearchBar";
import NotificationBell from "@/components/NotificationBell";
import UserAccount from "@/components/UserAccount";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app" },
  { icon: ShoppingBag, label: "Marketplace", href: "/app/marketplace" },
  { icon: Sparkles, label: "AI Stylist", href: "/app/ai-stylist" },
  { icon: Scissors, label: "Salons", href: "/app/salons" },
  { icon: Video, label: "Live Commerce", href: "/app/live-commerce" },
  { icon: MessageSquare, label: "Conversations", href: "/app/conversations" },
  { icon: Calendar, label: "My Bookings", href: "/app/bookings" },
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
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen">
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
                    ? "bg-primary text-primary-foreground shadow-lg shadow-black/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
            <p className="text-sm text-foreground font-medium leading-relaxed">
              Your style profile is 85% complete. Finish it to unlock personal picks.
            </p>
            <button className="mt-3 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Complete Profile <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Link
            href="/app/settings"
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              pathname === "/app/settings" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="lg:hidden bg-card/80 backdrop-blur-md sticky top-0 z-40 border-b border-border">
        <div className="h-16 px-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold font-display">
            Priisme
          </Link>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <NotificationBell />
            <UserAccount showLabel={false} />
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 ml-1">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[50] bg-background lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
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
                    className={`w-full flex items-center justify-between py-4 text-xl font-medium border-b border-border ${
                      isActive ? "text-foreground" : "text-muted-foreground"
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
                className={`w-full flex items-center justify-between py-4 text-xl font-medium border-b border-border ${
                  pathname === "/app/wishlist" ? "text-foreground" : "text-muted-foreground"
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
        <header className="hidden lg:flex h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 items-center justify-between">
          <div className="flex-1 max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex items-center gap-4 ml-4">
            <ThemeSwitcher />
            <Link href="/app/wishlist" className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <Heart className={`w-5 h-5 ${pathname === '/app/wishlist' ? 'text-rose-500 fill-rose-500' : 'text-muted-foreground'}`} />
            </Link>
            <NotificationBell />
            <UserAccount />
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
