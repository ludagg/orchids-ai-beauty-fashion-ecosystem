"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ShopHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  // Mock cart count for now, will connect to API later
  const [cartCount, setCartCount] = useState(0);

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (query !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set('search', query);
        } else {
          params.delete('search');
        }
        // Update URL
        router.replace(`?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  useEffect(() => {
    // Sync query with URL if it changes externally
    const currentSearch = searchParams.get('search') || '';
    if (query !== currentSearch) {
        setQuery(currentSearch);
    }
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 gap-4 max-w-7xl mx-auto">
        {/* Brand / Logo if needed, otherwise rely on Layout */}

        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search products, brands..."
          />
        </div>

        <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/app/wishlist')}
                  className="relative"
                  aria-label="View Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Wishlist</TooltipContent>
            </Tooltip>

            {/* Cart */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/app/cart')}
                  className="relative"
                  aria-label={`View Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                          {cartCount}
                      </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cart</TooltipContent>
            </Tooltip>
        </div>
      </div>
    </header>
  );
}
