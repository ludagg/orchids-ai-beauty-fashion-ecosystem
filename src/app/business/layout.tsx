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
  LogOut
} from "lucide-react";
import Link from "next/link";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import SearchBar from "@/components/SearchBar";
import NotificationBell from "@/components/NotificationBell";
import UserAccount from "@/components/UserAccount";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/business" },
  { icon: Calendar, label: "Appointments", href: "/business/appointments" },
  { icon: Scissors, label: "Services", href: "/business/services" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (query: string) => {
    console.log("Searching in business:", query);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className={`border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/business" className="text-3xl font-script text-black dark:text-white">
              Rare <span className="text-sm font-sans font-normal ml-1">Business</span>
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
           <Link
              href="/app"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-secondary hover:text-foreground mb-4 border-b border-border pb-4 ${isCollapsed ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 rotate-180" />
              {!isCollapsed && <span>Back to App</span>}
            </Link>

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

      </aside>

      {/* Mobile Nav */}
      <header className="lg:hidden bg-card/80 backdrop-blur-md sticky top-0 z-40 border-b border-border">
        <div className="h-16 px-4 flex items-center justify-between">
          <Link href="/business" className="text-2xl font-script text-black dark:text-white">
            Rare
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
        <div className="px-4 pb-3 flex items-center gap-2">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="flex-1" />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[50] bg-background lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <span className="text-3xl font-script text-black dark:text-white">Rare Business</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-2">
               <Link
                  href="/app"
                  className="w-full flex items-center justify-between py-4 text-xl font-medium border-b border-border text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-4">
                    <LogOut className="w-6 h-6 rotate-180" />
                    Back to App
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Link>

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
          </div>

          <div className="flex items-center gap-4 ml-4">
            <Link href="/app" className="text-sm font-medium hover:text-primary transition-colors mr-4">
                Back to App
            </Link>
            <ThemeSwitcher />
            <NotificationBell />
            <UserAccount />
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>

        <BusinessBottomNav />
      </div>
    </div>
  );
}
