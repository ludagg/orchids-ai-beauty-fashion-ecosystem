"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import FullPageVideo from "./FullPageVideo";
import { Loader2, ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CommentSection } from "@/components/videos-creations/CommentSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";

// Simple hook for media query
function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

interface VideoFeedProps {
  initialVideos?: any[];
  initialCategory?: string;
}

export default function VideoFeed({ initialVideos = [], initialCategory = "All" }: VideoFeedProps) {
  const [videos, setVideos] = useState<any[]>(initialVideos);
  const [api, setApi] = useState<CarouselApi>();
  const [currentInfo, setCurrentInfo] = useState({ index: 0, videoId: "" });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sheet States
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Cart
  const { addToCart } = useCart();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const fetchMoreVideos = async (pageToFetch = page) => {
    if (loading || (!hasMore && pageToFetch > 1)) return;
    setLoading(true);
    try {
        const res = await fetch(`/api/videos?page=${pageToFetch}&limit=10${initialCategory !== 'All' ? `&category=${initialCategory}` : ''}`);
        if (res.ok) {
            const newVideos = await res.json();
            if (newVideos.length < 10) setHasMore(false);

            // Filter duplicates
            setVideos(prev => {
                const existingIds = new Set(prev.map(v => v.id));
                const uniqueNew = newVideos.filter((v: any) => !existingIds.has(v.id));
                return [...prev, ...uniqueNew];
            });
        }
    } catch (error) {
        console.error("Failed to load more videos", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch if no videos provided
    if (videos.length === 0 && page === 1) {
        fetchMoreVideos(1);
    }
  }, []);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      const video = videos[index];
      if (video) {
        setCurrentInfo({ index, videoId: video.id });
        setActiveVideoId(video.id);

        // Load more logic
        if (index >= videos.length - 3 && hasMore && !loading) {
            setPage(prev => prev + 1);
        }
      }
    };

    api.on("select", onSelect);
    // Trigger initial select if we have videos
    if (videos.length > 0) {
        onSelect();
    }

    return () => {
      api.off("select", onSelect);
    };
  }, [api, videos, hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
        fetchMoreVideos();
    }
  }, [page]);

  // Find active video object safely
  const activeVideo = videos.find(v => v.id === activeVideoId) || videos[0] || null;

  const handleAddToCart = (product: any) => {
      addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          quantity: 1,
          salonId: product.salonId
      });
      toast.success("Added to cart");
  };

  const scrollPrev = () => {
    if (api) api.scrollPrev();
  };

  const scrollNext = () => {
    if (api) api.scrollNext();
  };

  // Helper component for responsive overlay
  const ResponsiveOverlay = ({ open, onOpenChange, title, children, icon: Icon }: any) => {
      if (isDesktop) {
          return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-background/95 backdrop-blur-xl border-l border-white/10 z-[100]">
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-border flex items-center gap-2">
                             {Icon && <Icon className="w-5 h-5" />}
                             <h2 className="font-bold text-lg">{title}</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            {children}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          );
      }

      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[80vh] z-[100]">
                <DrawerHeader className="text-left border-b pb-4">
                    <div className="flex items-center gap-2">
                         {Icon && <Icon className="w-5 h-5" />}
                         <DrawerTitle>{title}</DrawerTitle>
                    </div>
                </DrawerHeader>
                <div className="p-4 overflow-y-auto">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
      );
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group/feed">
      <Carousel
        setApi={setApi}
        orientation="vertical"
        className="w-full h-full"
        opts={{
            axis: "y",
            align: "start",
            loop: false,
            dragFree: false,
        }}
      >
        <CarouselContent className="-mt-0 h-full">
          {videos.length > 0 ? (
              videos.map((video, index) => (
                <CarouselItem key={video.id} className="pt-0 h-full w-full basis-full">
                  <FullPageVideo
                    video={video}
                    isActive={currentInfo.index === index}
                    onOpenComments={() => {
                        setActiveVideoId(video.id);
                        setIsCommentsOpen(true);
                    }}
                    onOpenProducts={() => {
                        setActiveVideoId(video.id);
                        setIsProductsOpen(true);
                    }}
                  />
                </CarouselItem>
              ))
          ) : (
             <div className="h-full w-full flex items-center justify-center text-white">
                 {loading ? <Loader2 className="animate-spin" /> : "No videos found."}
             </div>
          )}

          {loading && videos.length > 0 && (
              <CarouselItem className="pt-0 h-full w-full basis-full flex items-center justify-center bg-black">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
              </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>

      {/* Explicit Scroll Navigation Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 opacity-0 group-hover/feed:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
              onClick={scrollPrev}
              disabled={currentInfo.index === 0}
              className="pointer-events-auto p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 border border-white/10"
          >
              <ChevronUp className="w-6 h-6" />
          </button>
          <button
              onClick={scrollNext}
              className="pointer-events-auto p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
          >
              <ChevronDown className="w-6 h-6" />
          </button>
      </div>

      {/* Responsive Comments Overlay */}
      <ResponsiveOverlay
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        title="Comments"
      >
         {activeVideoId && <CommentSection videoId={activeVideoId} hideHeader />}
      </ResponsiveOverlay>

      {/* Responsive Products Overlay */}
      <ResponsiveOverlay
        open={isProductsOpen}
        onOpenChange={setIsProductsOpen}
        title="Shop the Look"
        icon={ShoppingBag}
      >
        <div className="space-y-4">
            {activeVideo?.products?.map((product: any) => (
                <div key={product.id} className="flex gap-4 p-3 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white flex-shrink-0">
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <Link href={`/app/marketplace/${product.id}`} className="font-bold text-sm line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">{product.brand || "Generic"}</p>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="font-bold text-foreground">
                                {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </span>
                            <Button size="sm" onClick={() => handleAddToCart(product)} className="h-8 px-3 rounded-full text-xs font-bold">
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {(!activeVideo?.products || activeVideo.products.length === 0) && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No products tagged in this video.</p>
                </div>
            )}
        </div>
      </ResponsiveOverlay>
    </div>
  );
}
