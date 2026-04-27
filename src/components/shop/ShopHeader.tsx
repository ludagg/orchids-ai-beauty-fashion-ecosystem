"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ShopHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  // [Jules - Remove mock cart count and replace with real API call]
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          // The quantity of each item is stored in data.items array, but let's just count total items or total quantity
          const totalItems = data.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
          setCartCount(totalItems);
        }
      })
      .catch(err => console.error("Failed to fetch cart for header", err));
  }, []);

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, brands..."
            className="w-full bg-secondary/50 pl-8 focus-visible:bg-background transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" onClick={() => router.push('/app/wishlist')} className="relative">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" onClick={() => router.push('/app/cart')} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {cartCount}
                </Badge>
            )}
            <span className="sr-only">Cart</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
