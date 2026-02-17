"use client";

import { useCart } from "@/lib/cart-context";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const isActive = pathname === "/app/cart";

  return (
    <Link
      href="/app/cart"
      className={`relative p-2 rounded-full transition-colors ${
        isActive
          ? "bg-secondary text-foreground"
          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
      }`}
    >
      <ShoppingBag className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white px-1 border-2 border-background shadow-sm"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
