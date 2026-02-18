"use client";

import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  IndianRupee,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import NotificationBell from "@/components/NotificationBell";
import UserAccount from "@/components/UserAccount";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import SearchBar from "@/components/SearchBar"; // Optional, can be removed if search isn't needed

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/business" },
  { icon: Calendar, label: "Appointments", href: "/business/appointments" },
  { icon: Scissors, label: "My Services", href: "/business/services" },
  { icon: Users, label: "Customers", href: "/business/customers" },
  { icon: IndianRupee, label: "Earnings", href: "/business/earnings" },
  { icon: Settings, label: "Settings", href: "/business/settings" },
];

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (query: string) => {
    // Implement business search logic (e.g., search bookings/customers)
    console.log("Searching:", query);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className={`border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/business" className="text-2xl font-bold tracking-tight text-foreground">
              Rare <span className="text-primary font-light">Partner</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
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
          <div className={`flex items-center gap-3 px-2 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/50" />
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">Aura Luxury Spa</p>
                <p className="text-xs text-muted-foreground truncate">Business Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-card/80 backdrop-blur-md sticky top-0 z-40 border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/business" className="text-2xl font-bold tracking-tight text-foreground">
            Rare <span className="text-primary font-light">Partner</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
           <ThemeSwitcher />
           <NotificationBell />
           <UserAccount showLabel={false} />
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 ml-1">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <span className="text-2xl font-bold text-foreground">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-between py-4 text-lg font-medium border-b border-border ${
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
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col relative overflow-x-hidden">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-bold text-foreground capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="w-64">
               {/* Simplified search or keep hidden if not needed */}
               {/* <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} /> */}
            </div>
            <ThemeSwitcher />
            <NotificationBell />
            <UserAccount />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>

        <BusinessBottomNav />
      </div>
    </div>
  );
}
