"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LiveHero from "@/components/videos-creations/LiveHero";
import CategoryPills from "@/components/videos-creations/CategoryPills";
import CreatorRail from "@/components/videos-creations/CreatorRail";
import VideoCard, { VideoCardProps } from "@/components/videos-creations/VideoCard";

const categories = [
  "All",
  "Live Now",
  "For You",
  "Following",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Luxury",
  "Streetwear",
  "Minimalist",
];

const creators = [
  { id: "1", name: "Ananya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isLive: true },
  { id: "2", name: "Rahul Mehra", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isLive: false },
  { id: "3", name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isLive: true },
  { id: "4", name: "Sonia Gupta", avatar: "https://i.pravatar.cc/150?u=sonia", isLive: false },
  { id: "5", name: "Vikram Singh", avatar: "https://i.pravatar.cc/150?u=vikram", isLive: false },
  { id: "6", name: "Anita Desai", avatar: "https://i.pravatar.cc/150?u=anita", isLive: false },
  { id: "7", name: "Karan Johar", avatar: "https://i.pravatar.cc/150?u=karan", isLive: true },
];

const videos: VideoCardProps[] = [
  {
    id: "1",
    title: "Summer Collection Launch 🌿",
    creator: { name: "Ananya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", verified: true },
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
    views: "1.2k",
    likes: "4.8k",
    isLive: true,
    category: "Fashion"
  },
  {
    id: "2",
    title: "Minimalist Skincare Routine ✨",
    creator: { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", verified: true },
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800&h=1000&fit=crop",
    views: "850",
    likes: "3.2k",
    isLive: false,
    category: "Beauty"
  },
  {
    id: "3",
    title: "Streetwear Trends 2026 👟",
    creator: { name: "Rahul Mehra", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", verified: false },
    thumbnail: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop",
    views: "2.1k",
    likes: "10.5k",
    isLive: true,
    category: "Streetwear"
  },
  {
    id: "4",
    title: "Luxury Bag Collection Review 👜",
    creator: { name: "Sonia Gupta", avatar: "https://i.pravatar.cc/150?u=sonia", verified: true },
    thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop",
    views: "15k",
    likes: "1.2k",
    isLive: false,
    category: "Luxury"
  },
  {
    id: "5",
    title: "Get Ready With Me: Date Night 💄",
    creator: { name: "Anita Desai", avatar: "https://i.pravatar.cc/150?u=anita", verified: true },
    thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=1000&fit=crop",
    views: "5.4k",
    likes: "900",
    isLive: false,
    category: "Beauty"
  },
  {
    id: "6",
    title: "Sustainable Fashion Haul ♻️",
    creator: { name: "Vikram Singh", avatar: "https://i.pravatar.cc/150?u=vikram", verified: false },
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=1000&fit=crop",
    views: "3.2k",
    likes: "450",
    isLive: false,
    category: "Fashion"
  },
   {
    id: "7",
    title: "Morning Yoga Routine 🧘‍♀️",
    creator: { name: "Karan Johar", avatar: "https://i.pravatar.cc/150?u=karan", verified: true },
    thumbnail: "https://images.unsplash.com/photo-1544367563-12123d895951?w=800&h=1000&fit=crop",
    views: "8.9k",
    likes: "2.1k",
    isLive: true,
    category: "Lifestyle"
  },
  {
    id: "8",
    title: "Sneaker Collection 2025 👟",
    creator: { name: "Rahul Mehra", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", verified: false },
    thumbnail: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=1000&fit=crop",
    views: "12k",
    likes: "3.4k",
    isLive: false,
    category: "Streetwear"
  }
];

export default function VideosCreationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos = videos.filter((video) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Live Now") return video.isLive;
    if (selectedCategory === "For You") return true; // Mock logic
    if (selectedCategory === "Following") return true; // Mock logic
    return video.category === selectedCategory;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">

      {/* Hero Section */}
      <LiveHero />

      {/* Creator Rail */}
      <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display text-foreground">Top Creators</h2>
          </div>
          <CreatorRail creators={creators} />
      </section>

      {/* Categories */}
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Video Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
      >
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </motion.div>

        {filteredVideos.length === 0 && (
            <div className="text-center py-20">
                <p className="text-muted-foreground font-bold">No videos found for this category.</p>
                <button
                    onClick={() => setSelectedCategory("All")}
                    className="mt-4 px-6 py-2 rounded-full bg-foreground text-white font-bold text-sm"
                >
                    Clear Filters
                </button>
            </div>
        )}
    </div>
  );
}
