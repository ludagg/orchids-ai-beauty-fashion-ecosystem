"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FullPageVideoItem } from "./FullPageVideoItem";
import { Loader2, ArrowUp, MoveDown, MoveUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Video {
  id: string;
  thumbnailUrl: string | null;
  videoUrl: string;
  title: string;
  description?: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  products?: any[];
}

interface FullPageVideoFeedProps {
  videos: Video[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function FullPageVideoFeed({ videos, onLoadMore, hasMore = true, loading = false }: FullPageVideoFeedProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", dragFree: false, loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    // Trigger load more when near end (e.g., 2 slides remaining)
    if (onLoadMore && hasMore && !loading && index >= videos.length - 2) {
      onLoadMore();
    }
  }, [emblaApi, onLoadMore, hasMore, loading, videos.length]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (videos.length === 0 && !loading) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-white/50 bg-black">
            <p>No videos found</p>
        </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="h-full w-full flex flex-col touch-pan-y">
          {videos.map((video, index) => (
            <div
                key={video.id}
                className="relative h-full w-full flex-[0_0_100%]"
            >
              <FullPageVideoItem
                video={video}
                isActive={index === selectedIndex}
              />
            </div>
          ))}
          {loading && (
             <div className="h-20 w-full flex items-center justify-center text-white/50 flex-[0_0_auto]">
                <Loader2 className="animate-spin w-6 h-6" />
             </div>
          )}
        </div>
      </div>

      {/* Interaction Hint (Only show on first slide if not scrolled yet) */}
      {selectedIndex === 0 && videos.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce opacity-40 pointer-events-none z-30">
             <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-white font-medium drop-shadow-md">Swipe Up</span>
            </div>
        </div>
      )}
    </div>
  );
}
