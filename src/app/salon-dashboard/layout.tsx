"use client";

import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  IndianRupee,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Clock
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const salonNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/salon-dashboard" },
  { icon: Calendar, label: "Appointments", href: "/salon-dashboard/appointments" },
  { icon: Scissors, label: "My Services", href: "/salon-dashboard/services" },
  { icon: Users, label: "Customers", href: "/salon-dashboard/customers" },
  { icon: IndianRupee, label: "Earnings", href: "/salon-dashboard/earnings" },
  { icon: Settings, label: "Settings", href: "/salon-dashboard/settings" },
];

export default function SalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <Link href="/salon-dashboard" className="text-xl font-bold tracking-tight text-blue-600">
            Priisme <span className="text-foreground">Partner</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {salonNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
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
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Clock className="w-4 h-4" />
              <p className="text-xs font-bold uppercase">Store Status</p>
            </div>
            <p className="text-sm font-semibold text-blue-900">Open for Business</p>
            <p className="text-[10px] text-blue-600 mt-1">Closing in 4 hours</p>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">Aura Luxury Spa</p>
              <p className="text-xs text-muted-foreground truncate">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/salon-dashboard" className="text-lg font-bold text-primary">
            Priisme Partner
          </Link>
          <ThemeSwitcher />
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden pt-16">
          <nav className="p-6 space-y-2">
            {salonNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 py-4 text-lg font-medium border-b border-border"
              >
                <item.icon className="w-6 h-6 text-primary" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex h-16 bg-card border-b border-border px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
            <span className="text-border">/</span>
            <span className="text-sm font-bold">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button className="p-2 text-muted-foreground hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-card"></span>
            </button>
            <div className="h-8 w-px bg-border mx-2" />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              Book Appointment
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
