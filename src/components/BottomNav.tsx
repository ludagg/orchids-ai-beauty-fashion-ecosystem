"use client";

import { LayoutDashboard, ShoppingBag, Sparkles, Scissors, Video, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/app" },
  { icon: ShoppingBag, label: "Shop", href: "/app/marketplace" },
  { icon: MessageSquare, label: "Chat", href: "/app/conversations" },
  //{ icon: Sparkles, label: "AI", href: "/app/ai-stylist" },
  { icon: Scissors, label: "Salons", href: "/app/salons" },
  { icon: Video, label: "Videos", href: "/app/videos-creations" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border px-4 pb-safe pt-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 group relative"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
              }`}>
                <item.icon className={`w-5 h-5 ${isActive ? "fill-current/10" : ""}`} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-foreground rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
