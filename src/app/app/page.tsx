"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Scissors,
  Play,
  Loader2,
  Heart,
  MapPin,
  Star
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [topSalons, setTopSalons] = useState<any[]>([]);
  const [marketplacePicks, setMarketplacePicks] = useState<any[]>([]);
  const [trendingStyles, setTrendingStyles] = useState<any[]>([]);
  const [videoClips, setVideoClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            const [salonsRes, productsRes, stylesRes, videosRes] = await Promise.all([
                fetch('/api/salons?limit=4'),
                fetch('/api/products?limit=4'),
                fetch('/api/videos?sortBy=popular&limit=4'), // Using popular videos as trending styles for now
                fetch('/api/videos?limit=4')
            ]);

            if (salonsRes.ok) {
                const data = await salonsRes.json();
                setTopSalons(data);
            }
            if (productsRes.ok) {
                const data = await productsRes.json();
                setMarketplacePicks(data);
            }
            if (stylesRes.ok) {
                const data = await stylesRes.json();
                setTrendingStyles(data);
            }
             if (videosRes.ok) {
                const data = await videosRes.json();
                setVideoClips(data);
            }
        } catch (error) {
            console.error("Error fetching homepage data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);


  const filteredContent = () => {
    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    switch (activeCategory) {
      case "salons":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSalons.map((salon, i) => (
              <SalonCard key={salon.id} salon={salon} index={i} />
            ))}
            {topSalons.length === 0 && <p className="text-muted-foreground">No salons found.</p>}
          </div>
        );
      case "styles":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingStyles.map((style, i) => (
              <StyleCard key={style.id} style={style} index={i} />
            ))}
             {trendingStyles.length === 0 && <p className="text-muted-foreground">No styles found.</p>}
          </div>
        );
      case "shop":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {marketplacePicks.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
            {marketplacePicks.length === 0 && <p className="text-muted-foreground">No products found.</p>}
          </div>
        );
      case "videos":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoClips.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
            {videoClips.length === 0 && <p className="text-muted-foreground">No videos found.</p>}
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-6">
            {/* Greeting */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold font-display text-foreground">Hi there! 👋</h1>
              <p className="text-muted-foreground text-lg">Let's get you beauty ready.</p>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column (Main Content) */}
              <div className="lg:col-span-8 flex flex-col gap-6">

                {/* Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg group">
                  <div className="absolute inset-0 bg-black/20" />
                  <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop" alt="Hero" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" />
                  <div className="relative p-8 md:p-12 h-[280px] md:h-[320px] flex flex-col justify-end">
                    <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-2 leading-tight">Book your next<br/>appointment</h2>
                    <p className="text-white/90 text-sm md:text-base mb-6 max-w-sm">Discover the best salons and stylists for your next look.</p>
                    <div>
                      <Button variant="secondary" className="rounded-xl px-8 py-6 text-base font-bold shadow-xl hover:scale-105 transition-transform group/btn">
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Dashboard Widgets (Points & Bookings) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Loyalty Widget (Mock) */}
                  <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full">GOLD TIER</span>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium mb-1">Your Loyalty Points</p>
                      <h3 className="text-3xl font-bold text-foreground">2,450</h3>
                    </div>
                  </div>

                  {/* Upcoming Booking Widget (Mock) */}
                  <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-full">UPCOMING</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground truncate">Haircut & Styling</p>
                      <p className="text-muted-foreground text-sm">Studio 54 • Tomorrow, 2:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Top Rated Salons */}
                <div>
                  <SectionHeader title="Top Rated Salons" icon={Scissors} href="/app/search?tab=salons" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topSalons.slice(0, 4).map((salon, i) => (
                      <SalonCard key={salon.id} salon={salon} index={i} />
                    ))}
                    {topSalons.length === 0 && <p className="text-muted-foreground">No salons found.</p>}
                  </div>
                </div>

              </div>

              {/* Right Column (Secondary Content) */}
              <div className="lg:col-span-4 flex flex-col gap-6">

                {/* Services Grid (Mock) */}
                <div>
                  <h3 className="text-lg font-bold font-display mb-4 text-foreground">Explore Services</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Haircut", icon: "✂️", color: "bg-blue-50 dark:bg-blue-950/30" },
                      { name: "Manicure", icon: "💅", color: "bg-pink-50 dark:bg-pink-950/30" },
                      { name: "Massage", icon: "💆‍♀️", color: "bg-emerald-50 dark:bg-emerald-950/30" },
                      { name: "Makeup", icon: "💄", color: "bg-purple-50 dark:bg-purple-950/30" }
                    ].map((service, idx) => (
                      <Link key={idx} href={`/app/search?tab=salons&q=${service.name}`} className={`${service.color} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform border border-border/50`}>
                        <span className="text-3xl">{service.icon}</span>
                        <span className="text-sm font-bold text-foreground">{service.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Marketplace Picks */}
                <div className="bg-secondary/50 rounded-3xl p-6 border border-border/50 flex-1 flex flex-col">
                  <SectionHeader title="Marketplace" icon={ShoppingBag} href="/app/search?tab=marketplace" />
                  <div className="flex flex-col gap-4 flex-1">
                    {marketplacePicks.slice(0, 3).map((product, i) => (
                      <SmallProductCard key={product.id} product={product} />
                    ))}
                    {marketplacePicks.length === 0 && <p className="text-muted-foreground">No products found.</p>}
                  </div>
                  <Link href="/app/search?tab=marketplace">
                    <Button variant="outline" className="w-full mt-6 rounded-xl bg-background hover:bg-muted">
                      Shop All <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-background pb-20 lg:pb-10">
      <div className="p-6 max-w-7xl mx-auto min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Sub-components for cleaner code

function SectionHeader({ title, icon: Icon, href }: { title: string, icon: any, href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold font-display flex items-center gap-2 text-foreground">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h3>
      <Link href={href} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group">
        View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function StyleCard({ style, index }: { style: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md border border-border bg-secondary">
        <img src={style.thumbnailUrl || style.videoUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop"} alt={style.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-rose-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 text-white translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full">@{style.user?.name || "creator"}</p>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm truncate text-foreground">{style.title}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> {style.likes}
        </div>
      </div>
    </motion.div>
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

function SalonCard({ salon, index }: { salon: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col sm:flex-row bg-card p-4 rounded-3xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-full"
    >
        <Link href={`/app/salons/${salon.id}`} className="contents">
        <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 relative">
            <img src={salon.image || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop"} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold flex items-center gap-1 text-black">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 5.0
            </div>
        </div>
        <div className="sm:ml-5 flex-1 flex flex-col justify-between h-full">
            <div>
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{salon.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {salon.city}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {[salon.type].map((tag: string) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground">
                    {tag}
                </span>
                ))}
            </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">Open Now</span>
            <span className="text-sm font-bold text-primary hover:underline">
                Book
            </span>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SmallProductCard({ product }: { product: any }) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <Link href={`/app/marketplace/${product.id}`} className="flex items-center gap-4 group bg-background p-3 rounded-2xl border border-border/50 hover:shadow-md transition-all">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
        <img src={product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground truncate">{product.brand || product.salon?.name}</p>
        <p className="font-bold text-sm text-primary mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

function ProductCard({ product, index }: { product: any, index: number }) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer flex flex-col h-full"
    >
      <Link href={`/app/marketplace/${product.id}`} className="contents">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border bg-secondary">
            <img src={product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

            {/* {product.discount && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-md shadow-sm">
                {product.discount}
            </div>
            )} */}
            {product.rating > 4.5 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-sm">
                HOT
            </div>
            )}

            <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-rose-500 hover:scale-110">
            <Heart className="w-4 h-4" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
            <button className="w-full py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors shadow-lg">
                View
            </button>
            </div>
        </div>

        <div className="mt-auto">
            <div className="flex justify-between items-start gap-2">
            <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{product.brand || product.salon?.name}</p>
            <p className="font-bold text-sm text-foreground">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
