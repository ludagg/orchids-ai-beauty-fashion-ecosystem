import { motion } from "framer-motion";
import { Play, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { VideoData } from "./types";

// [Jules - Restored clickability and animation for extracted VideoCard component]
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

export function ProfileVideoCard({ video, index }: { video: VideoData, index: number }) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer bg-muted"
    >
      <Link href={`/app/videos-creations/${video.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {video.title}</span>
      </Link>

      <img
        src={video.thumbnailUrl || '/placeholder-video.jpg'}
        alt={video.title}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Top badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {video.status === 'draft' && (
          <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-none">
            Draft
          </Badge>
        )}
      </div>

      {/* Hover action (Play) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-medium text-sm line-clamp-2 mb-3 drop-shadow-md">
          {video.title}
        </h4>
        <div className="flex items-center gap-4 text-white/90">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium border border-white/10">
            <Play className="w-3.5 h-3.5" />
            {(video.views / 1000).toFixed(1)}K
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium border border-white/10">
            <Heart className="w-3.5 h-3.5" />
            {(video.likes / 1000).toFixed(1)}K
          </div>
          <button className="ml-auto hover:text-white text-white/70 transition-colors p-1.5 hover:bg-white/10 rounded-full">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
