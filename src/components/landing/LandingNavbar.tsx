"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { usePathname } from "next/navigation";

const navItems = ["Features", "AI", "Marketplace", "Salons", "Testimonials"];

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

  const getLinkHref = (item: string) => {
    const hash = `#${item.toLowerCase()}`;
    return isHome ? hash : `/${hash}`;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
                <Link key={item} href={getLinkHref(item)} legacyBehavior passHref>
                  <motion.a
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative text-sm text-muted-foreground hover:text-foreground transition-colors py-2 group cursor-pointer"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href={isHome ? "/business" : "/"} className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {isHome ? "For Business" : "For Shoppers"}
              </Link>
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
                className="md:hidden p-2 -mr-2"
                onClick={() => setMobileMenuOpen(true)}
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
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={getLinkHref(item)} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-4 text-2xl font-medium border-b border-border hover:text-muted-foreground transition-colors w-full">
                        {item}
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 py-8 border-t border-border space-y-3">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors">
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
