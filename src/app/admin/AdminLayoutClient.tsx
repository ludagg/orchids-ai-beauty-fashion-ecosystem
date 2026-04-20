"use client";

import {
  LayoutDashboard,
  Users,
  Scissors,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
  CreditCard,
  Search,
  Menu,
  X,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Scissors, label: "Salons", href: "/admin/salons" },
  { icon: ShoppingBag, label: "Marketplace", href: "/admin/marketplace" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: ShieldAlert, label: "Moderation", href: "/admin/moderation" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[#1e293b] dark:bg-card text-white hidden lg:flex flex-col sticky top-0 h-screen border-r border-border">
        <div className="p-6 border-b border-slate-700">
          <Link href="/admin" className="text-3xl font-script tracking-tight">
            Priisme <span className="text-indigo-400 font-sans text-lg">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-[#1e293b] dark:bg-card text-white px-4 flex items-center justify-between sticky top-0 z-50 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-3xl font-script tracking-tight">
            Priisme <span className="text-indigo-400 font-sans text-lg">Admin</span>
          </Link>
          <ThemeSwitcher />
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#1e293b] dark:bg-card lg:hidden pt-16">
          <nav className="p-6 space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 py-4 text-lg font-medium border-b border-slate-700 text-slate-300"
              >
                <item.icon className="w-6 h-6 text-indigo-400" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex h-16 bg-card border-b border-border px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-secondary border-transparent focus:bg-card focus:border-border rounded-lg text-sm transition-all outline-none text-foreground"
            />
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button className="p-2 text-muted-foreground hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-card"></span>
            </button>
            <div className="h-8 w-px bg-border mx-2" />
            <button className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Administrator</span>
              <div className="w-8 h-8 rounded-lg bg-secondary border border-border" />
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
