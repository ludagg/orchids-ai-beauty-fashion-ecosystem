"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StoriesRail } from "@/components/videos/StoriesRail";
import { MasonryVideoGrid } from "@/components/videos/MasonryVideoGrid";
import CategoryPills from "@/components/videos-creations/CategoryPills";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

const CATEGORIES = [
  "All",
  "Live Now",
  "Hair",
  "Makeup",
  "Skincare",
  "Fashion",
  "Tutorials"
];

export default function VideosCreationsPage() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { ref, inView } = useInView();
  const isFetchingRef = useRef(false);

  const fetchVideos = useCallback(async (pageNum: number, isReset = false, category = selectedCategory) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", "20");
      if (category && category !== "All") {
        params.append("category", category);
      }

      const res = await fetch(`/api/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();

        // Transform data to match MasonryVideoGrid expectations
        const transformed = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl,
          views: v.views, // Ensure number
          likes: v.likes, // Ensure number
          isLiked: v.isLiked,
          user: {
            id: v.user.id,
            name: v.user.name,
            image: v.user.image,
          },
        }));

        setVideos((prev) => {
          if (isReset) return transformed;
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p.id));
          const newVideos = transformed.filter((t: any) => !existingIds.has(t.id));
          return [...prev, ...newVideos];
        });

        if (transformed.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [selectedCategory]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setVideos([]); // Reset videos synchronously to prevent race conditions during fetch
    fetchVideos(1, true, selectedCategory);
  }, [selectedCategory, fetchVideos]);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasMore && !loading && !isFetchingRef.current && videos.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage, false, selectedCategory);
    }
  }, [inView, hasMore, loading, videos.length, page, fetchVideos, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Stories Rail */}
      <div className="pt-2">
        <StoriesRail />
      </div>

      <div className="px-4 py-2">
        <CategoryPills
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Masonry Grid */}
      <div className="flex-1 max-w-[2000px] mx-auto w-full pt-2">
        <MasonryVideoGrid videos={videos} />

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={ref} className="h-4" />
      </div>
    </div>
  );
}
