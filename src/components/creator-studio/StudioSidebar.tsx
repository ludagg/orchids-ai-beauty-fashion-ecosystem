"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  BarChart2,
  MessageSquare,
  DollarSign,
  Settings,
  ChevronLeft,
  LogOut,
  Palette
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/creator-studio" },
  { icon: Video, label: "Content", href: "/app/creator-studio/content" },
  { icon: BarChart2, label: "Analytics", href: "/app/creator-studio/analytics" },
  { icon: MessageSquare, label: "Community", href: "/app/creator-studio/community" },
  { icon: DollarSign, label: "Earn", href: "/app/creator-studio/earn" },
  { icon: Palette, label: "Customization", href: "/app/creator-studio/customization" },
  { icon: Settings, label: "Settings", href: "/app/creator-studio/settings" },
];

export default function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen z-50">
      <div className="p-6 flex items-center gap-3">
        <Link
            href="/app"
            className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
            title="Back to App"
        >
            <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="font-display font-semibold text-xl tracking-tight">
          Creator <span className="text-primary italic">Studio</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Your Partner Status</p>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-foreground">Rising Star</span>
            </div>
            <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-[70%]" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">70% to next level</p>
        </div>

        <div className="flex items-center justify-between px-2">
            <ThemeSwitcher />
            <button className="text-xs font-medium text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1">
                <LogOut className="w-3 h-3" />
                Exit Studio
            </button>
        </div>
      </div>
    </aside>
  );
}
