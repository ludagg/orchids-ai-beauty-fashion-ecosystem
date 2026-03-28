// [Jules - Extracted ProfileVideoCard from monolithic ProfileView.tsx]
import { motion } from "framer-motion";
import { Play, Video } from "lucide-react";
import Link from "next/link";
import { VideoData } from "./types";

export function ProfileVideoCard({ video, index }: { video: VideoData, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      role="article"
      aria-label={`Video: ${video.title}`}
    >
      <Link
        href={`/app/videos-creations/${video.id}`}
        className="group relative block aspect-[9/16] rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-border/20"
      >
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Video className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </motion.div>
        </div>

        {/* Views Counter */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white drop-shadow-md">
          <Play className="w-3 h-3 fill-white" />
          <span className="text-xs font-semibold">
            {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}K` : video.views}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
