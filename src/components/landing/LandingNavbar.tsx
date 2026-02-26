"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Features", href: "features" },
  { label: "AI", href: "ai" },
  { label: "Marketplace", href: "marketplace" },
  { label: "Salons", href: "salons" },
  { label: "Testimonials", href: "testimonials" },
  { label: "For Business", href: "/business", external: true },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const getLinkHref = (item: typeof navItems[0]) => {
    if (item.external) return item.href;
    const hash = `#${item.href}`;
    return isHome ? hash : `/${hash}`;
  };

  return (
    <>
      <nav
        className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
            scrolled ? "bg-background/80 backdrop-blur-md border-border py-2" : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-12 md:h-14">
            <Link href="/" className="text-3xl font-script text-foreground relative z-50">
              Rare
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link key={item.label} href={getLinkHref(item)} legacyBehavior passHref>
                  <motion.a
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-foreground relative group py-1",
                        item.external ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                    {!item.external && (
                        <span className="absolute inset-x-0 -bottom-px h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    )}
                  </motion.a>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <ThemeSwitcher />
              </div>
              <Link href="/auth">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden sm:inline-flex px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  Sign In
                </motion.button>
              </Link>
              <button
                className="md:hidden p-2 -mr-2 text-foreground"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-20 px-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-script text-foreground">Rare</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-foreground" aria-label="Close menu">
                    <X className="w-6 h-6" />
                    </button>
                </div>
              </div>
              <nav className="flex-1 px-6 py-8 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={getLinkHref(item)}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center justify-between py-4 text-xl font-medium border-b border-border/50 hover:text-foreground/70 transition-colors w-full",
                            item.external ? "text-primary" : "text-foreground"
                        )}
                      >
                        {item.label}
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 py-8 border-t border-border mt-auto">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:opacity-90 transition-all active:scale-[0.98]">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
