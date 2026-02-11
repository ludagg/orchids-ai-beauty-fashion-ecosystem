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
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-[#e5e5e5] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#e5e5e5]">
          <Link href="/salon-dashboard" className="text-xl font-bold tracking-tight text-blue-600">
            Priisme <span className="text-[#1a1a1a]">Partner</span>
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
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
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
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Clock className="w-4 h-4" />
              <p className="text-xs font-bold uppercase">Store Status</p>
            </div>
            <p className="text-sm font-semibold text-blue-900">Open for Business</p>
            <p className="text-[10px] text-blue-600 mt-1">Closing in 4 hours</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#e5e5e5]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">Aura Luxury Spa</p>
              <p className="text-xs text-[#6b6b6b] truncate">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-white border-b border-[#e5e5e5] px-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/salon-dashboard" className="text-lg font-bold text-blue-600">
          Priisme Partner
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden pt-16">
          <nav className="p-6 space-y-2">
            {salonNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 py-4 text-lg font-medium border-b border-[#e5e5e5]"
              >
                <item.icon className="w-6 h-6 text-blue-600" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex h-16 bg-white border-b border-[#e5e5e5] px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#6b6b6b]">Dashboard</span>
            <span className="text-[#e5e5e5]">/</span>
            <span className="text-sm font-bold">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-[#6b6b6b] hover:text-[#1a1a1a] relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#e5e5e5] mx-2" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
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
