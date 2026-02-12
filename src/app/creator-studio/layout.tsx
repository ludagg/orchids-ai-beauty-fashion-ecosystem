"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Video, BarChart2, Settings, ArrowLeft, Menu, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import UserAccount from "@/components/UserAccount";
import { motion } from "framer-motion";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/creator-studio" },
  { icon: Video, label: "Content", href: "/creator-studio/content" },
  { icon: BarChart2, label: "Analytics", href: "/creator-studio/analytics" },
  { icon: Settings, label: "Settings", href: "/creator-studio/settings" },
];

export default function CreatorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/creator/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.isCreator) {
          router.push("/become-creator");
        }
      })
      .catch(() => router.push("/become-creator"))
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading Studio...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="border-r border-border bg-card hidden lg:flex flex-col w-64 sticky top-0 h-screen z-30">
        <div className="p-6 flex items-center gap-2">
          <Link href="/app" className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-rose-500">
            Creator Studio
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/creator-studio/upload">
            <Button className="w-full gap-2">
              <Upload className="w-4 h-4" />
              Upload New
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Link href="/app" className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-semibold font-display">Studio</span>
        </div>
        <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <UserAccount showLabel={false} />
            <button onClick={() => setMobileMenuOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
            </button>
        </div>
      </header>

       {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[50] bg-background lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <span className="text-xl font-semibold font-display">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-4">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 text-lg font-medium ${
                        isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                );
              })}
               <Link href="/creator-studio/upload">
                <Button className="w-full gap-2 mt-4">
                <Upload className="w-4 h-4" />
                Upload New
                </Button>
            </Link>
            </nav>
          </div>
        </div>
      )}


      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="hidden lg:flex h-16 border-b border-border px-6 items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-20">
             <h1 className="font-semibold text-lg">Dashboard</h1>
             <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <UserAccount />
             </div>
        </div>
        {children}
      </main>
    </div>
  );
}
