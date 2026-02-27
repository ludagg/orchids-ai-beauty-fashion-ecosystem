"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { FilterChips } from '@/components/shop/FilterChips';
import { ProductCard } from '@/components/shop/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { FilterSheet, FilterState, defaultFilters } from '@/components/shop/FilterSheet';

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryFilter = searchParams.get('category');

  // Filter state
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [homeData, setHomeData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingHome, setLoadingHome] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const LIMIT = 20;

  // Determine if we are in "Filtering Mode" (excluding default sort/filters)
  // "Filtering Mode" means we HIDE the curated sections (Hero, Trending, etc)
  // This happens if:
  // 1. Search query exists
  // 2. Category is selected (not All)
  // 3. Any detailed filter (price, rating, stock) is changed from default
  const isDetailedFilterActive =
      filters.minPrice !== defaultFilters.minPrice ||
      filters.maxPrice !== defaultFilters.maxPrice ||
      filters.minRating !== defaultFilters.minRating ||
      filters.inStock !== defaultFilters.inStock ||
      filters.sortBy !== defaultFilters.sortBy;

  const isFiltering = !!searchQuery || (!!categoryFilter && categoryFilter !== 'All') || isDetailedFilterActive;

  // 1. Fetch Home Data (Curated sections) - Only if NOT filtering initially, or just once
  useEffect(() => {
      setLoadingHome(true);
      fetch('/api/shop/home')
        .then(res => res.json())
        .then(data => {
          setHomeData(data);
          setLoadingHome(false);
        })
        .catch(err => {
            console.error(err);
            setLoadingHome(false);
        });
  }, []); // Run once on mount

  // 2. Reset Pagination when any filter changes
  useEffect(() => {
    setSearchResults([]);
    setOffset(0);
    setHasMore(true);
    // Trigger fetch is handled by the next effect dependent on [offset] (which resets to 0)
    // However, if offset was ALREADY 0, the next effect won't trigger automatically unless we include other deps.
    // So we depend on all filter params in the fetch effect.
  }, [searchQuery, categoryFilter, filters]);

  // 3. Fetch Products (Infinite Scroll List)
  // This runs for BOTH "Home Mode" (appended at bottom) and "Filter Mode" (only thing shown)
  useEffect(() => {
    setLoadingProducts(true);
    const params = new URLSearchParams();

    // Core Params
    if (searchQuery) params.set('search', searchQuery);
    if (categoryFilter && categoryFilter !== 'All') params.set('category', categoryFilter);

    // Detailed Filters
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < defaultFilters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minRating > 0) params.set('minRating', filters.minRating.toString());
    if (filters.inStock) params.set('inStock', 'true');
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);

    // Pagination
    params.set('limit', LIMIT.toString());
    params.set('offset', offset.toString());

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.length < LIMIT) setHasMore(false);
        setSearchResults(prev => offset === 0 ? data : [...prev, ...data]);
        setLoadingProducts(false);
      })
      .catch(err => {
          console.error(err);
          setLoadingProducts(false);
      });
  }, [searchQuery, categoryFilter, filters, offset]);

  // 4. Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasMore && !loadingProducts) {
        setOffset(prev => prev + LIMIT);
    }
  }, [inView, hasMore, loadingProducts]);

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Beauty', value: 'Beauty' },
    { label: 'Hair Care', value: 'Hair Care' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Fragrances', value: 'Fragrances' },
    { label: 'Wellness', value: 'Wellness' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <ShopHeader />

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto flex items-center gap-2 px-4 py-2">
            <FilterSheet
                filters={filters}
                onApply={setFilters}
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
            />
            <div className="flex-1 overflow-hidden">
                <FilterChips
                    className="border-none py-0"
                    filters={categories}
                    selectedValue={categoryFilter || 'All'}
                    onSelect={(val) => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (val && val !== 'All') params.set('category', val);
                        else params.delete('category');
                        router.push(`?${params.toString()}`);
                    }}
                />
            </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8">

        {/* SHOW CURATED SECTIONS ONLY IF NOT FILTERING */}
        {!isFiltering && !loadingHome && homeData && (
          <>
            {/* Hero Section */}
            {homeData.hero && homeData.hero.length > 0 && (
              <section>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                  {homeData.hero.map((product: any) => (
                    <div key={product.id} className="min-w-[85vw] md:min-w-[400px] snap-center">
                       <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommended */}
            {homeData.recommended && homeData.recommended.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {homeData.recommended.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

             {/* Trending */}
             {homeData.trending && homeData.trending.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Trending This Week</h2>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                  {homeData.trending.map((product: any) => (
                    <div key={product.id} className="min-w-[160px] w-[160px] snap-center">
                       <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* New Arrivals */}
            {homeData.newArrivals && homeData.newArrivals.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">New Arrivals</h2>
                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {homeData.newArrivals.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

             <div className="py-4">
                <h2 className="text-xl font-bold mb-4">All Products</h2>
             </div>
          </>
        )}

        {/* LOADING STATE FOR HOME DATA */}
        {!isFiltering && loadingHome && (
             <div className="space-y-8">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />)}
                </div>
            </div>
        )}

        {/* MAIN PRODUCT GRID (INFINITE SCROLL) */}
        {/* This is shown at the bottom of Home, or as the main content when Filtering */}
        <div className="space-y-4">
             {isFiltering && (
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {searchQuery ? `Results for "${searchQuery}"` :
                         categoryFilter && categoryFilter !== 'All' ? `${categoryFilter} Products` :
                         "Filtered Results"}
                    </h2>
                    <span className="text-sm text-muted-foreground">{searchResults.length} items</span>
                </div>
             )}

             <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Loading / Infinite Scroll Indicator */}
            {hasMore && (
                <div ref={ref} className="w-full py-8 flex justify-center">
                    {loadingProducts && <Skeleton className="h-8 w-8 rounded-full animate-spin" />}
                </div>
            )}

            {/* Empty State */}
            {!loadingProducts && searchResults.length === 0 && isFiltering && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                    No products found matching your criteria.
                </div>
            )}
          </div>
      </main>
    </div>
  );
}
