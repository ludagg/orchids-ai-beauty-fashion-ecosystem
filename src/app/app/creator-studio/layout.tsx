"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Video, BarChart2, Users } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/app/creator-studio", icon: LayoutDashboard },
  { label: "Content", href: "/app/creator-studio/content", icon: Video },
  { label: "Analytics", href: "/app/creator-studio/analytics", icon: BarChart2 },
  { label: "Community", href: "/app/creator-studio/community", icon: Users },
];

export default function CreatorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-full">
      {/* Studio Header */}
      <header className="px-8 py-8 bg-background/50 backdrop-blur-sm sticky top-0 z-20 border-b border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500">
              Creator Studio
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your content and grow your audience
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
              + Upload New
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-violet-500" : ""}`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="studio-tab"
                    className="absolute inset-0 bg-secondary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}
