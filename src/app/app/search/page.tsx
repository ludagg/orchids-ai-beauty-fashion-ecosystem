"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ShoppingBag, Video, Scissors, Sparkles, Users, Filter, X, Loader2 } from "lucide-react";
import Link from "next/link";

const TABS = [
  { id: "all", label: "All Results" },
  { id: "salons", label: "Salons", icon: Scissors },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  // Keeping these as comments or disabled to show future roadmap but focusing on real data
  // { id: "videos", label: "Videos", icon: Video },
  // { id: "creators", label: "Creators", icon: Users },
  // { id: "styles", label: "Styles", icon: Sparkles },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial state from URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || ""); // SALON, BOUTIQUE, BOTH
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");

  const [results, setResults] = useState<{ salons: any[], marketplace: any[] }>({ salons: [], marketplace: [] });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL with state (debounced)
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (activeTab !== "all") params.set("tab", activeTab);

    const newUrl = `/app/search?${params.toString()}`;
    // Use replace to avoid cluttering history stack with every keystroke
    window.history.replaceState(null, "", newUrl);
  }, [query, city, type, activeTab]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchSalons = activeTab === "all" || activeTab === "salons";
        const fetchProducts = activeTab === "all" || activeTab === "marketplace";

        const promises = [];

        if (fetchSalons) {
            const params = new URLSearchParams();
            if (query) params.append("query", query);
            if (city) params.append("city", city);
            if (type) params.append("type", type);
            if (activeTab === "all") params.append("limit", "6");
            promises.push(fetch(`/api/salons?${params.toString()}`).then(res => res.json()));
        } else {
            promises.push(Promise.resolve([]));
        }

        if (fetchProducts) {
            const params = new URLSearchParams();
            if (query) params.append("search", query);
            // Products API doesn't support city filtering directly on the product table efficiently without join logic in API
            // For now, product search is mainly by name/category.
            // If we need city for products, we'd pass salonId or handle it in backend.
            // The API logic for products does filter by salonId but not city directly on product level unless we updated it.
            // But let's check product API again... it has `salon: { columns: { name: true, city: true... } }`
            // But filtering happens in `where`.
            // The current products API `src/app/api/products/route.ts` only filters by `category`, `salonId`, `search` (name), `featured`.
            // So City filter won't apply to products yet. That's fine for now.
            if (activeTab === "all") params.append("limit", "8");
            promises.push(fetch(`/api/products?${params.toString()}`).then(res => res.json()));
        } else {
            promises.push(Promise.resolve([]));
        }

        const [salonsData, productsData] = await Promise.all(promises);

        setResults({
            salons: Array.isArray(salonsData) ? salonsData : [],
            marketplace: Array.isArray(productsData) ? productsData : []
        });

      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [query, city, type, activeTab]);

  const clearFilters = () => {
    setQuery("");
    setCity("");
    setType("");
  };

  const hasFilters = query || city || type;
  const resultCount = results.salons.length + results.marketplace.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search salons, services, products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-secondary border-transparent focus:bg-background focus:border-foreground transition-all outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all ${showFilters || (city || type) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
                >
                    <Filter className="w-5 h-5" />
                    Filters
                    {(city || type) && <span className="ml-1 w-2 h-2 rounded-full bg-rose-500" />}
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">City</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="e.g. Paris, Bangalore"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm appearance-none"
                            >
                                <option value="">All Types</option>
                                <option value="SALON">Salons Only</option>
                                <option value="BOUTIQUE">Boutiques Only</option>
                                <option value="BOTH">Full Service (Both)</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full py-2 rounded-xl border border-dashed border-muted-foreground/50 text-muted-foreground text-sm hover:text-foreground hover:border-foreground transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                ? "bg-foreground text-background shadow-lg"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                            }`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-secondary/50 rounded-2xl h-72" />
                ))}
            </div>
        ) : (
            <div className="space-y-12">
                 {resultCount === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-6">We couldn't find any matches for your search.</p>
                        <button onClick={clearFilters} className="px-6 py-2.5 bg-foreground text-background rounded-xl font-medium hover:opacity-90">
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Salons Grid */}
                {results.salons.length > 0 && (activeTab === "all" || activeTab === "salons") && (
                    <section>
                         {activeTab === "all" && (
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Scissors className="w-5 h-5 text-rose-500" /> Salons
                                </h2>
                                <button onClick={() => setActiveTab('salons')} className="text-sm font-semibold text-primary hover:underline">View All</button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.salons.map((salon, i) => (
                                <Link href={`/app/salons/${salon.id}`} key={salon.id} className="block group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="h-full bg-card rounded-[24px] border border-border hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            <img
                                                src={salon.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop"}
                                                alt={salon.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                 {salon.isVerified && (
                                                    <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified</span>
                                                )}
                                                <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-foreground">{salon.type}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{salon.name}</h3>
                                                {/* <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
                                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.9
                                                </div> */}
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
                                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {salon.city}
                                            </p>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{salon.description}</p>

                                            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Available Now</span>
                                                <span className="text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Book <Scissors className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Marketplace Grid */}
                {results.marketplace.length > 0 && (activeTab === "all" || activeTab === "marketplace") && (
                    <section>
                        {activeTab === "all" && (
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-blue-500" /> Marketplace
                                </h2>
                                <button onClick={() => setActiveTab('marketplace')} className="text-sm font-semibold text-primary hover:underline">View All</button>
                            </div>
                        )}
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {results.marketplace.map((product, i) => (
                                <Link href={`/app/marketplace/${product.id}`} key={product.id} className="group block">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className="aspect-[3/4] rounded-[24px] overflow-hidden bg-secondary mb-3 relative border border-border">
                                            <img
                                                src={product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                             {product.rating > 4.5 && (
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-sm">
                                                    HOT
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-sm truncate pr-2">{product.name}</h3>
                                        <p className="text-xs text-muted-foreground mb-1 truncate">{product.brand || product.salon?.name}</p>
                                        <p className="font-bold text-sm text-rose-600">
                                            {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                        </p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
