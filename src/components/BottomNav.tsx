"use client";

import { LayoutDashboard, ShoppingBag, Sparkles, Scissors, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/app" },
  { icon: ShoppingBag, label: "Shop", href: "/app/marketplace" },
  { icon: Sparkles, label: "AI", href: "/app/ai-stylist" },
  { icon: Scissors, label: "Salons", href: "/app/salons" },
  { icon: Video, label: "Live", href: "/app/live-commerce" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-[#e5e5e5] px-4 pb-safe pt-2 z-50">
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
                isActive ? "text-[#1a1a1a] bg-[#f5f5f5]" : "text-[#6b6b6b] hover:text-[#1a1a1a]"
              }`}>
                <item.icon className={`w-5 h-5 ${isActive ? "fill-current/10" : ""}`} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-[#1a1a1a]" : "text-[#6b6b6b]"
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#1a1a1a] rounded-full"
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
