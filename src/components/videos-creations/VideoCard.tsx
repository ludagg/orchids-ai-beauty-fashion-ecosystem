"use client";

import { motion } from "framer-motion";
import { Play, Users, CheckCircle2, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface VideoCardProps {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  thumbnail: string;
  views: string;
  likes: string;
  isLive?: boolean;
  category?: string;
}

export default function VideoCard({ video }: { video: VideoCardProps }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative aspect-[9/16] rounded-[24px] overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/app/videos-creations/${video.id}`} className="block w-full h-full">
        {/* Thumbnail Image */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {video.isLive && (
            <div className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Live
            </div>
          )}
          <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {video.views}
          </div>
        </div>

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight drop-shadow-md">
            {video.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={video.creator.avatar}
                alt={video.creator.name}
                className="w-6 h-6 rounded-full border border-white/50 object-cover"
              />
              <span className="text-white/90 text-xs font-bold truncate max-w-[100px] flex items-center gap-1">
                {video.creator.name}
                {video.creator.verified && (
                  <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-white/80">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{video.likes}</span>
                </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
