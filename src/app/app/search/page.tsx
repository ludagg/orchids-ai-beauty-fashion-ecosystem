"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ShoppingBag, Video, Scissors, Sparkles, Users, Filter, X, Loader2, Play } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const TABS = [
  { id: "all", label: "All Results" },
  { id: "salons", label: "Salons", icon: Scissors },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "videos", label: "Videos", icon: Video },
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
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");

  const [results, setResults] = useState<{ salons: any[], marketplace: any[], videos: any[] }>({ salons: [], marketplace: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(
      latParam && lngParam ? { lat: parseFloat(latParam), lng: parseFloat(lngParam) } : null
  );

  // Sync URL with state (debounced)
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (activeTab !== "all") params.set("tab", activeTab);
    if (userLoc) {
        params.set("lat", userLoc.lat.toString());
        params.set("lng", userLoc.lng.toString());
    }

    const newUrl = `/app/search?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [query, city, type, minPrice, maxPrice, activeTab, userLoc]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchSalons = activeTab === "all" || activeTab === "salons";
        const fetchProducts = activeTab === "all" || activeTab === "marketplace";
        const fetchVideos = activeTab === "all" || activeTab === "videos";

        const promises = [];

        if (fetchSalons) {
            const params = new URLSearchParams();
            if (query) params.append("query", query);
            if (city && city !== "Current Location") params.append("city", city);
            if (type) params.append("type", type);
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
            if (userLoc) {
                params.append("lat", userLoc.lat.toString());
                params.append("lng", userLoc.lng.toString());
            }
            if (activeTab === "all") params.append("limit", "6");
            promises.push(fetch(`/api/salons?${params.toString()}`).then(res => res.json()));
        } else {
            promises.push(Promise.resolve([]));
        }

        if (fetchProducts) {
            const params = new URLSearchParams();
            if (query) params.append("search", query);
            if (activeTab === "all") params.append("limit", "8");
            promises.push(fetch(`/api/products?${params.toString()}`).then(res => res.json()));
        } else {
            promises.push(Promise.resolve([]));
        }

        if (fetchVideos) {
            const params = new URLSearchParams();
            // Video search could be added later, currently fetches recent/popular
            if (activeTab === "all") params.append("limit", "8");
            promises.push(fetch(`/api/videos?${params.toString()}`).then(res => res.json()));
        } else {
             promises.push(Promise.resolve([]));
        }

        const [salonsData, productsData, videosData] = await Promise.all(promises);

        setResults({
            salons: Array.isArray(salonsData) ? salonsData : [],
            marketplace: Array.isArray(productsData) ? productsData : [],
            videos: Array.isArray(videosData) ? videosData : []
        });

      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [query, city, type, minPrice, maxPrice, activeTab, userLoc]);

  const clearFilters = () => {
    setQuery("");
    setCity("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setUserLoc(null);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLoc({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            setCity("Current Location"); // Visual feedback
        }, (error) => {
            console.error("Error getting location", error);
            alert("Could not retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
  };

  const hasFilters = query || city || type || minPrice || maxPrice || userLoc;
  const resultCount = results.salons.length + results.marketplace.length + results.videos.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search salons, services, products..."
                    className="flex-1"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all ${showFilters || (city || type || userLoc) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
                >
                    <Filter className="w-5 h-5" />
                    Filters
                    {(city || type || userLoc) && <span className="ml-1 w-2 h-2 rounded-full bg-rose-500" />}
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
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex justify-between">
                                City
                                <button onClick={handleUseLocation} className="text-primary hover:underline flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Near Me
                                </button>
                            </label>
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
                        <div>
                             <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Price Range (₹)</label>
                             <div className="flex gap-2">
                                 <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                                 />
                                 <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                                 />
                             </div>
                        </div>
                        <div className="col-span-1 sm:col-span-3 lg:col-span-3 flex justify-end pt-2">
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 rounded-xl border border-dashed border-muted-foreground/50 text-muted-foreground text-sm hover:text-foreground hover:border-foreground transition-colors"
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

                 {/* Videos Grid */}
                 {results.videos.length > 0 && (activeTab === "all" || activeTab === "videos") && (
                    <section>
                        {activeTab === "all" && (
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Video className="w-5 h-5 text-purple-500" /> Videos
                                </h2>
                                <button onClick={() => setActiveTab('videos')} className="text-sm font-semibold text-primary hover:underline">View All</button>
                            </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {results.videos.map((video, i) => (
                                <VideoCard key={video.id} video={video} index={i} />
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

function VideoCard({ video, index }: { video: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-3 shadow-md border border-border bg-black">
        <img src={video.thumbnailUrl || video.videoUrl || "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=600&fit=crop"} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full inline-block mb-1">{video.views} views</p>
          <p className="font-semibold text-sm truncate">{video.title}</p>
          <p className="text-xs opacity-80">@{video.user?.name || "creator"}</p>
        </div>
      </div>
    </motion.div>
  );
}
