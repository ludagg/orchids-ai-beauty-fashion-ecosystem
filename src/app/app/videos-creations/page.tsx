"use client";

import { useState } from "react";
import VideoFeed from "@/components/videos-creations/VideoFeed";
import VideoUploadModal from "@/components/videos-creations/VideoUploadModal";
import { Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Luxury",
  "Streetwear",
  "Minimalist",
];

export default function VideosCreationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [resetKey, setResetKey] = useState(0);

  const handleUploadSuccess = () => {
    // Force re-mount of VideoFeed to reload videos
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-black overflow-hidden">
      {/* Top Overlay Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
         {/* Left: Branding or Title (Optional, maybe hidden for cleanliness) */}
         <div className="flex items-center gap-2 pointer-events-auto">
             <div className="flex gap-4 text-white font-bold text-lg drop-shadow-md">
                 {/* Simple Category Tabs */}
                 {categories.slice(0, 3).map(cat => (
                     <button
                        key={cat}
                        onClick={() => {
                            if (selectedCategory !== cat) {
                                setSelectedCategory(cat);
                                setResetKey(prev => prev + 1);
                            }
                        }}
                        className={`transition-opacity ${selectedCategory === cat ? "opacity-100 border-b-2 border-white pb-1" : "opacity-50 hover:opacity-80"}`}
                     >
                         {cat === "All" ? "For You" : cat}
                     </button>
                 ))}
             </div>
         </div>

         {/* Right: Upload */}
         <div className="pointer-events-auto">
             <VideoUploadModal
                onSuccess={handleUploadSuccess}
                trigger={
                    <button className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all">
                        <Plus className="w-5 h-5" />
                    </button>
                }
             />
         </div>
      </div>

      {/* Main Feed */}
      {/* We use resetKey to force re-mounting when category changes or new upload happens */}
      <VideoFeed
        key={`${selectedCategory}-${resetKey}`}
        initialCategory={selectedCategory}
      />

    </div>
  );
}
