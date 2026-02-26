"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  Bell,
  Compass,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Heart,
  MessageSquare,
  Calendar,
  Store,
  User,
  Award,
  LogOut
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import SearchBar from "@/components/SearchBar";
import CartIcon from "@/components/CartIcon";
import NotificationBell from "@/components/NotificationBell";
import UserAccount from "@/components/UserAccount";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CartProvider } from "@/lib/cart-context";
import AIStylistSheet from "@/components/ai-stylist/AIStylistSheet";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Compass, label: "Discover", href: "/app" },
  { icon: User, label: "Profile", href: "/app/profile" },
  { icon: ShoppingBag, label: "Marketplace", href: "/app/marketplace" },
  { icon: Award, label: "Loyalty Program", href: "/app/loyalty" },
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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleSearch = (query: string) => {
    router.push(`/app/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <CartProvider>
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-sans">

      {/* Desktop Sidebar */}
      <aside
        className={cn(
            "border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 z-40",
            isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className={cn(
            "h-16 flex items-center border-b border-border/50 px-6",
            isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/" className="text-3xl font-script text-foreground">
              Rare
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {session?.user?.role === "salon_owner" && (
                <Link
                href="/app/my-business"
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group mb-6 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10",
                    isCollapsed ? "justify-center" : ""
                )}
                title="My Business"
                >
                <Store className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                {!isCollapsed && <span className="text-amber-700 dark:text-amber-300">My Business</span>}
                </Link>
            )}

            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                        isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        isCollapsed ? "justify-center" : ""
                    )}
                    title={item.label}
                >
                    <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary-foreground" : "group-hover:text-foreground")} />
                    {!isCollapsed && <span>{item.label}</span>}
                </Link>
                );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border/50 bg-background/50">
          <Link
            href="/app/settings"
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-secondary",
                pathname === "/app/settings" ? "text-foreground bg-secondary" : "text-muted-foreground",
                isCollapsed ? "justify-center" : ""
            )}
            title="Settings"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-script text-foreground">
            Rare
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <CartIcon />
            <NotificationBell />
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -mr-2 text-foreground active:opacity-70"
                aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Area */}
        <div className="px-4 pb-3 flex items-center gap-2">
            <div className="flex-1">
                 <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="w-full" />
            </div>
            <AIStylistSheet />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background lg:hidden flex flex-col"
            >
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                <span className="text-3xl font-script text-foreground">Rare</span>
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-foreground active:opacity-70"
                    aria-label="Close menu"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="flex items-center gap-4 mb-8 p-4 bg-secondary/50 rounded-2xl">
                    <UserAccount showLabel={true} />
                </div>

                <nav className="space-y-1">
                    {session?.user?.role === "salon_owner" && (
                        <Link
                        href="/app/my-business"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-4 border-b border-border text-lg font-medium text-amber-600 dark:text-amber-400"
                        >
                        <span className="flex items-center gap-4">
                            <Store className="w-5 h-5" />
                            My Business
                        </span>
                        <ChevronRight className="w-5 h-5 opacity-50" />
                        </Link>
                    )}

                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center justify-between py-4 border-b border-border text-lg font-medium",
                                isActive ? "text-primary" : "text-foreground/80"
                            )}
                        >
                            <span className="flex items-center gap-4">
                            <item.icon className="w-5 h-5" />
                            {item.label}
                            </span>
                            <ChevronRight className="w-5 h-5 opacity-30" />
                        </Link>
                        );
                    })}

                    <Link
                        href="/app/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-4 border-b border-border text-lg font-medium text-foreground/80"
                    >
                        <span className="flex items-center gap-4">
                        <Heart className="w-5 h-5" />
                        Wishlist
                        </span>
                        <ChevronRight className="w-5 h-5 opacity-30" />
                    </Link>

                    <Link
                        href="/app/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-4 border-b border-border text-lg font-medium text-foreground/80"
                    >
                        <span className="flex items-center gap-4">
                        <Settings className="w-5 h-5" />
                        Settings
                        </span>
                        <ChevronRight className="w-5 h-5 opacity-30" />
                    </Link>
                </nav>

                <div className="mt-8">
                     <button className="flex items-center gap-3 text-destructive font-medium px-2 py-3 w-full hover:bg-destructive/5 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                     </button>
                </div>
            </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-8 items-center justify-between">
          <div className="flex-1 max-w-xl flex items-center gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="flex-1" />
            <AIStylistSheet />
          </div>

          <div className="flex items-center gap-6 pl-6">
            <div className="flex items-center gap-2 border-r border-border pr-6">
                <ThemeSwitcher />
                <NotificationBell />
                <CartIcon />
            </div>
            <UserAccount />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/10 pb-20 lg:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </div>
    </CartProvider>
  );
}
