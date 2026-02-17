"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { usePathname } from "next/navigation";

export default function CartIcon() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const isActive = pathname === '/app/cart';

  return (
    <Link
      href="/app/cart"
      aria-label="Shopping bag"
      className="p-2 relative rounded-full hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <ShoppingBag className={`w-5 h-5 ${isActive ? 'text-rose-500 fill-rose-500' : 'text-muted-foreground'}`} />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-background">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
