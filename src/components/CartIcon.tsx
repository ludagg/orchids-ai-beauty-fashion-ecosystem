"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CartIcon() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const isActive = pathname === '/app/cart';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/app/cart"
          className="p-2 relative rounded-full hover:bg-secondary transition-colors"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className={`w-5 h-5 ${isActive ? 'text-rose-500 fill-rose-500' : 'text-muted-foreground'}`} />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-background">
              {itemCount}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Shopping Cart</p>
      </TooltipContent>
    </Tooltip>
  );
}
