"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = ["Features", "AI", "Marketplace", "Salons", "Testimonials"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/90 backdrop-blur-2xl shadow-sm" : ""
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight font-display"
            >
              Priisme
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link
                  key={item}
                  href={isHomePage ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`}
                  className="relative text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors py-2 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a1a1a] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-all hover:shadow-lg hover:shadow-black/20 active:scale-95"
              >
                Se connecter
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
            className="fixed inset-0 z-[100] bg-white"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-[#e5e5e5]">
                <span className="text-xl font-semibold font-display">Priisme</span>
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
                      <Link
                        href={isHomePage ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-4 text-2xl font-medium border-b border-[#e5e5e5] hover:text-[#6b6b6b] transition-colors"
                      >
                        {item}
                        <ChevronRight className="w-5 h-5 text-[#6b6b6b]" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 py-8 border-t border-[#e5e5e5] space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-4 rounded-2xl bg-[#1a1a1a] text-white font-medium text-center hover:bg-[#333] transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
