"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname } from "next/navigation";

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

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && !href.startsWith('/')) {
      e.preventDefault();
      const element = document.getElementById(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      setMobileMenuOpen(false);
    }
  };

  const getLinkHref = (item: typeof navItems[0]) => {
    if (item.external) return item.href;
    const hash = `#${item.href}`;
    return isHome ? hash : `/${hash}`;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? "bg-card/90 backdrop-blur-2xl shadow-sm" : ""
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-3xl font-script text-black dark:text-white">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Rare
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link key={item.label} href={getLinkHref(item)} legacyBehavior passHref>
                  <motion.a
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={(e) => !item.external && handleAnchorClick(e, item.href)}
                    className={`relative text-sm transition-colors py-2 group cursor-pointer ${
                      item.external ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-200 group-hover:w-full" />
                  </motion.a>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Link href="/auth">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden sm:block px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  Sign In
                </motion.button>
              </Link>
              <button
                className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            className="fixed inset-0 z-[100] bg-background"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-script text-black dark:text-white">Rare</span>
                  <ThemeSwitcher />
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close menu">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link 
                        href={getLinkHref(item)} 
                        onClick={(e) => {
                          if (!item.external) {
                            handleAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, item.href);
                          } else {
                            setMobileMenuOpen(false);
                          }
                        }} 
                        className={`flex items-center justify-between py-4 text-2xl font-medium border-b border-border hover:text-muted-foreground transition-colors w-full min-h-[56px] ${item.external ? "text-primary" : ""}`}
                      >
                        {item.label}
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 py-8 border-t border-border space-y-3">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors min-h-[52px]">
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
