"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Compass,
    ShoppingBag,
    MessageSquare,
    Scissors,
    Video
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
      label: "Discover",
      href: "/app",
      icon: Compass
  },
  {
      label: "Shop",
      href: "/app/marketplace",
      icon: ShoppingBag
  },
  {
      label: "Salons",
      href: "/app/salons",
      icon: Scissors
  },
  {
      label: "Videos",
      href: "/app/videos-creations",
      icon: Video
  },
  {
      label: "Chat",
      href: "/app/conversations",
      icon: MessageSquare
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  "flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors min-w-[64px]", // Ensure min width for tap target
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                    className={cn(
                        "w-6 h-6 transition-all duration-300",
                        isActive ? "scale-110" : "scale-100"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
