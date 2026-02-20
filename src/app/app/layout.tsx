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
  Compass,
  Settings,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Heart,
  MessageSquare,
  Calendar,
  Store,
  User
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import SearchBar from "@/components/SearchBar";
import NotificationBell from "@/components/NotificationBell";
import CartIcon from "@/components/CartIcon";
import UserAccount from "@/components/UserAccount";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CartProvider } from "@/lib/cart-context";
import AIStylistSheet from "@/components/ai-stylist/AIStylistSheet";
import { useSession } from "@/lib/auth-client";

const sidebarItems = [
  { icon: Compass, label: "Discover", href: "/app" },
  { icon: User, label: "Profile", href: "/app/profile" },
  { icon: ShoppingBag, label: "Marketplace", href: "/app/marketplace" },
  //{ icon: Sparkles, label: "AI Stylist", href: "/app/ai-stylist" },
  { icon: Scissors, label: "Salons", href: "/app/salons" },
  { icon: Video, label: "Videos & Creations", href: "/app/videos-creations" },
  { icon: MessageSquare, label: "Conversations", href: "/app/conversations" },
  { icon: Bell, label: "Notifications", href: "/app/notifications" },
  { icon: Calendar, label: "My Bookings", href: "/app/bookings" },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (query: string) => {
    router.push(`/app/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <CartProvider>
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className={`border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/" className="text-3xl font-script text-black dark:text-white">
              Rare
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {session?.user?.role === "salon_owner" && (
            <Link
              href="/business"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-[#D4AF37] hover:bg-secondary hover:text-[#D4AF37] ${isCollapsed ? "justify-center" : ""}`}
            >
              <Store className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>My Business</span>}
            </Link>
          )}
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-foreground/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        

        <div className={`p-4 border-t border-border ${isCollapsed ? "flex justify-center" : ""}`}>
          <Link
            href="/app/settings"
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              pathname === "/app/settings" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="lg:hidden bg-card/80 backdrop-blur-md sticky top-0 z-40 border-b border-border">
        <div className="h-16 px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-script text-black dark:text-white">
            Rare
          </Link>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
          <Link href="/app/wishlist" className="p-2 relative">
             <Heart className={`w-6 h-6 ${pathname === '/app/wishlist' ? 'text-rose-500 fill-rose-500' : ''}`} />
          </Link>
            <CartIcon />
            <NotificationBell />
            <UserAccount showLabel={false} />
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 ml-1">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 flex items-center gap-2">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="flex-1" />
          <AIStylistSheet />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[50] bg-background lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <span className="text-3xl font-script text-black dark:text-white">Rare</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-2">
              {session?.user?.role === "salon_owner" && (
                <Link
                  href="/business"
                  className="w-full flex items-center justify-between py-4 text-xl font-medium border-b border-border text-[#D4AF37] hover:text-[#D4AF37]"
                >
                  <span className="flex items-center gap-4">
                    <Store className="w-6 h-6" />
                    My Business
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
              {sidebarItems.filter(item => item.label !== "AI Stylist").map((item) => {
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
          <div className="flex-1 max-w-xl flex items-center gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="flex-1" />
            <AIStylistSheet />
          </div>

          <div className="flex items-center gap-4 ml-4">
            {session?.user?.role === "salon_owner" && (
              <Link href="/business" className="text-sm font-medium hover:text-primary transition-colors mr-4">
                My Business
              </Link>
            )}
            <ThemeSwitcher />
            <Link href="/app/wishlist" className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <Heart className={`w-5 h-5 ${pathname === '/app/wishlist' ? 'text-rose-500 fill-rose-500' : 'text-muted-foreground'}`} />
            </Link>
            <CartIcon />
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
    </CartProvider>
  );
}
