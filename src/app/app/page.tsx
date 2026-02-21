"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Scissors,
  Play,
  Loader2,
  Heart,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const Map = dynamic(() => import("@/components/ui/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary/50 animate-pulse rounded-[32px] flex items-center justify-center text-muted-foreground">
      <Loader2 className="animate-spin mr-2" /> Loading map...
    </div>
  ),
});

// Mock Data for unimplemented sections
const HERO_SLIDES = [
  {
    id: 1,
    title: "Summer Glow Up",
    subtitle: "Discover the best salons for your summer look.",
    cta: "Book Now",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop",
    color: "from-rose-500 to-orange-500",
  },
  {
    id: 2,
    title: "New Designer Drops",
    subtitle: "Shop exclusive runway pieces.",
    cta: "Shop Collection",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: 3,
    title: "AI Style Assistant",
    subtitle: "Get personalized outfit recommendations.",
    cta: "Try AI Stylist",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=600&fit=crop",
    color: "from-emerald-500 to-teal-500",
  },
];

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
        const [salonsRes, productsRes, stylesRes, videosRes] =
          await Promise.all([
            fetch("/api/salons?limit=4"),
            fetch("/api/products?limit=4"),
            fetch("/api/videos?sortBy=popular&limit=4"), // Using popular videos as trending styles for now
            fetch("/api/videos?limit=4"),
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
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      );
    }

    switch (activeCategory) {
      case "salons":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSalons.map((salon, i) => (
              <SalonCard key={salon.id} salon={salon} index={i} />
            ))}
            {topSalons.length === 0 && (
              <p className="text-muted-foreground">No salons found.</p>
            )}
          </div>
        );
      case "styles":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingStyles.map((style, i) => (
              <StyleCard key={style.id} style={style} index={i} />
            ))}
            {trendingStyles.length === 0 && (
              <p className="text-muted-foreground">No styles found.</p>
            )}
          </div>
        );
      case "shop":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {marketplacePicks.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
            {marketplacePicks.length === 0 && (
              <p className="text-muted-foreground">No products found.</p>
            )}
          </div>
        );
      case "videos":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoClips.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
            {videoClips.length === 0 && (
              <p className="text-muted-foreground">No videos found.</p>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-12">
            <HeroCarousel slides={HERO_SLIDES} />

            <div className="py-2">
              <LocationPreview />
            </div>

            <SectionHeader
              title="Trending Styles"
              icon={Sparkles}
              href="/app/styles"
            />
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth no-scrollbar">
              {trendingStyles.map((style, i) => (
                <div key={style.id} className="w-[180px] flex-shrink-0">
                  <StyleCard style={style} index={i} />
                </div>
              ))}
              {trendingStyles.length === 0 && (
                <p className="text-muted-foreground pl-4">
                  No trending styles yet.
                </p>
              )}
            </div>

            <SectionHeader
              title="Top Rated Salons"
              icon={Scissors}
              href="/app/search?tab=salons"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topSalons.slice(0, 2).map((salon, i) => (
                <SalonCard key={salon.id} salon={salon} index={i} />
              ))}
              {topSalons.length === 0 && (
                <p className="text-muted-foreground">No salons found.</p>
              )}
            </div>

            <SectionHeader
              title="Recommended For You"
              icon={ShoppingBag}
              href="/app/search?tab=marketplace"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {marketplacePicks.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
              {marketplacePicks.length === 0 && (
                <p className="text-muted-foreground">No products found.</p>
              )}
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

function LocationPreview() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, []);

  // Default to Paris if location not available
  const displayLocation = userLocation || { lat: 48.8566, lng: 2.3522 };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-6 mb-8 h-[350px] md:h-auto rounded-[32px] md:rounded-none overflow-hidden md:overflow-visible">
      {/* Map Preview */}
      <div className="absolute inset-0 md:relative md:inset-auto md:col-span-2 md:rounded-[32px] md:overflow-hidden shadow-none md:shadow-lg md:shadow-black/5 border-none md:border md:border-border bg-secondary h-full md:h-[280px] z-0">
        <Map
          lat={displayLocation.lat}
          lng={displayLocation.lng}
          popupText={userLocation ? "You are here" : "Paris, France"}
          className="z-0"
          style={{ minHeight: "100%", height: "100%" }}
          interactive={false}
        />

        {userLocation && (
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md border border-white/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-black">Your Location</span>
          </div>
        )}
      </div>

      {/* Explore Action */}
      <div className="relative z-10 h-full md:h-[280px] md:col-span-1 bg-gradient-to-t from-background/95 via-background/60 to-background/10 backdrop-blur-[2px] md:bg-card md:backdrop-blur-none rounded-none md:rounded-[32px] p-6 flex flex-col justify-end md:justify-between border-none md:border md:border-border shadow-none md:shadow-sm">
        <div>
          <div className="w-12 h-12 bg-secondary/80 md:bg-secondary rounded-2xl flex items-center justify-center mb-4 text-primary shadow-sm border border-border">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2 font-display">
            Explore Nearby
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Discover top-rated salons and stylists in your area.
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Link href="/app/search?tab=salons" className="w-full">
            <Button className="w-full rounded-xl py-6 text-base font-semibold shadow-md group">
              Explore Nearby
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/app/search?tab=marketplace" className="w-full">
            <Button
              variant="outline"
              className="w-full rounded-xl py-6 text-base font-semibold border-primary/10 hover:bg-secondary group bg-background/50 md:bg-background"
            >
              Shop Now
              <ShoppingBag className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroCarousel({ slides }: { slides: typeof HERO_SLIDES }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured content"
      className="relative rounded-[32px] overflow-hidden aspect-[3/4] md:aspect-[21/9] group shadow-2xl shadow-black/5"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${slides[current].color} text-white text-xs font-bold mb-4 uppercase tracking-wider shadow-lg`}
              >
                Featured
              </span>
              <h2 className="text-2xl md:text-5xl font-bold font-display text-white mb-3 leading-tight">
                {slides[current].title}
              </h2>
              <p className="text-white/90 text-sm md:text-lg mb-6 md:mb-8 max-w-lg leading-relaxed">
                {slides[current].subtitle}
              </p>
              <button className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl text-sm md:text-base">
                {slides[current].cta} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon: any;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold font-display flex items-center gap-2 text-foreground">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h3>
      <Link
        href={href}
        className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group"
      >
        View All{" "}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function StyleCard({ style, index }: { style: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md border border-border bg-secondary">
        <img
          src={
            style.thumbnailUrl ||
            style.videoUrl ||
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop"
          }
          alt={style.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            aria-label="Add to favorites"
            className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-rose-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 text-white translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full">
            @{style.user?.name || "creator"}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm truncate text-foreground">
          {style.title}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />{" "}
          {style.likes}
        </div>
      </div>
    </motion.div>
  );
}

function VideoCard({ video, index }: { video: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-3 shadow-md border border-border bg-black">
        <img
          src={
            video.thumbnailUrl ||
            video.videoUrl ||
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=600&fit=crop"
          }
          alt={video.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full inline-block mb-1">
            {video.views} views
          </p>
          <p className="font-semibold text-sm truncate">{video.title}</p>
          <p className="text-xs opacity-80">@{video.user?.name || "creator"}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SalonCard({ salon, index }: { salon: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col sm:flex-row bg-card p-4 rounded-3xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-full"
    >
      <Link href={`/app/salons/${salon.id}`} className="contents">
        <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 relative">
          <img
            src={
              salon.image ||
              "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop"
            }
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold flex items-center gap-1 text-black">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 5.0
          </div>
        </div>
        <div className="sm:ml-5 flex-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {salon.name}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {salon.city}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[salon.type].map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
              Open Now
            </span>
            <span className="text-sm font-bold text-primary hover:underline">
              Book
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductCard({ product, index }: { product: any; index: number }) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer flex flex-col h-full relative"
    >
      <Link
        href={`/app/marketplace/${product.id}`}
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">View {product.name}</span>
      </Link>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border bg-secondary">
        <img
          src={
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.rating > 4.5 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-sm z-10">
            HOT
          </div>
        )}

        <button
          aria-label="Add to favorites"
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-rose-500 hover:scale-110 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent z-10">
          <div className="w-full py-2 rounded-xl bg-white text-black text-xs font-bold text-center shadow-lg">
            View
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10 pointer-events-none">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-sm text-foreground truncate">
            {product.name}
          </h4>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          {product.brand || product.salon?.name}
        </p>
        <p className="font-bold text-sm text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
