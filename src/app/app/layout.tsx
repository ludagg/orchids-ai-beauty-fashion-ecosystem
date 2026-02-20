"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import SearchBar from "@/components/SearchBar";
import NotificationBell from "@/components/NotificationBell";
import CartIcon from "@/components/CartIcon";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import AIStylistSheet from "@/components/ai-stylist/AIStylistSheet";
import { CartProvider } from "@/lib/cart-context";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    router.push(`/app/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <CartProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-30 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 hidden lg:block" />
               {/* Mobile Logo */}
               <Link href="/" className="font-script text-xl lg:hidden">
                  Rare
               </Link>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
               {/* Search: Hidden on mobile, visible on desktop */}
               <div className="hidden lg:flex flex-1 max-w-xl items-center gap-2 mx-4">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="flex-1" />
                  <AIStylistSheet />
               </div>

               {/* Actions */}
               <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <Link href="/app/wishlist" className="p-2 relative hover:bg-secondary rounded-full transition-colors">
                     <Heart className={`w-5 h-5 ${pathname === '/app/wishlist' ? 'text-rose-500 fill-rose-500' : 'text-muted-foreground'}`} />
                  </Link>
                  <CartIcon />
                  <NotificationBell />
               </div>
            </div>
          </header>

          {/* Mobile Search Row */}
          <div className="lg:hidden px-4 py-2 border-b bg-background sticky top-16 z-20 flex items-center gap-2">
               <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} className="flex-1" />
               <AIStylistSheet />
          </div>

          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            {children}
          </main>

          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    </CartProvider>
  );
}
