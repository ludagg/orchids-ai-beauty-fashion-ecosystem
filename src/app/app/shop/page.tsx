"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { FilterChips } from '@/components/shop/FilterChips';
import { ProductCard } from '@/components/shop/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryFilter = searchParams.get('category');

  const [homeData, setHomeData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const LIMIT = 20;

  // If search or category filter is active, we are in "Filtering Mode"
  const isFiltering = !!searchQuery || (!!categoryFilter && categoryFilter !== 'All');

  // Fetch Home Data
  useEffect(() => {
    if (!isFiltering) {
      setLoading(true);
      fetch('/api/shop/home')
        .then(res => res.json())
        .then(data => {
          setHomeData(data);
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [isFiltering]);

  // Reset pagination when filters change
  useEffect(() => {
    if (isFiltering) {
        setSearchResults([]);
        setOffset(0);
        setHasMore(true);
        // Initial fetch happens in the next effect because offset changes to 0 (or stays 0)
        // Actually, if offset is already 0, the next effect runs only if other deps change.
        // We need to ensure fetch happens.
    }
  }, [searchQuery, categoryFilter, isFiltering]);

  // Fetch Search/Filter Data with Pagination
  useEffect(() => {
    if (isFiltering) {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (categoryFilter && categoryFilter !== 'All') params.set('category', categoryFilter);
      params.set('limit', LIMIT.toString());
      params.set('offset', offset.toString());

      fetch(`/api/products?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (data.length < LIMIT) setHasMore(false);
          setSearchResults(prev => offset === 0 ? data : [...prev, ...data]);
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [searchQuery, categoryFilter, isFiltering, offset]);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasMore && !loading && isFiltering) {
        setOffset(prev => prev + LIMIT);
    }
  }, [inView, hasMore, loading, isFiltering]);

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
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <FilterChips
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

      <main className="container mx-auto px-4 py-6 space-y-8">
        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />)}
            </div>
          </div>
        ) : isFiltering ? (
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {searchQuery ? `Results for "${searchQuery}"` : `${categoryFilter} Products`}
                </h2>
                <span className="text-sm text-muted-foreground">{searchResults.length} items</span>
             </div>
             <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {hasMore && (
                <div ref={ref} className="w-full py-8 flex justify-center">
                    {loading && <Skeleton className="h-8 w-8 rounded-full animate-spin" />}
                </div>
            )}
            {!loading && searchResults.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                    No products found.
                </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {homeData?.hero && homeData.hero.length > 0 && (
              <section>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                  {homeData.hero.map((product: any) => (
                    <div key={product.id} className="min-w-[85vw] md:min-w-[400px] snap-center">
                       {/* Hero Card Variant could be larger */}
                       <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommended */}
            {homeData?.recommended && homeData.recommended.length > 0 && (
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
             {homeData?.trending && homeData.trending.length > 0 && (
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
            {homeData?.newArrivals && homeData.newArrivals.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">New Arrivals</h2>
                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {homeData.newArrivals.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Best Sellers */}
             {homeData?.bestSellers && homeData.bestSellers.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Best Sellers</h2>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                  {homeData.bestSellers.map((product: any) => (
                    <div key={product.id} className="min-w-[160px] w-[160px] snap-center">
                       <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
