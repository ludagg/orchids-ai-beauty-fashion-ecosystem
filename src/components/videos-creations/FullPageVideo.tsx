"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, ShoppingBag, Volume2, VolumeX, Play } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  brand?: string;
}

interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  likes: number;
  views: number;
  isLiked?: boolean;
  category?: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  products?: Product[];
}

interface FullPageVideoProps {
  video: Video;
  isActive: boolean;
  onOpenComments: () => void;
  onOpenProducts: () => void;
}

export default function FullPageVideo({ video, isActive, onOpenComments, onOpenProducts }: FullPageVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const { data: session } = useSession();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Sync play state with active state
  useEffect(() => {
    if (isActive) {
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
            setIsMuted(true);
          });
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      toast.error("Please login to like");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await fetch(`/api/videos/${video.id}/like`, { method: "POST" });
    } catch (error) {
      console.error("Like failed", error);
      // Revert
      setLiked(!newLiked);
      setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed or cancelled", err);
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none group">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        poster={video.thumbnailUrl}
      />

      {/* Top Right Controls (Mute) */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white transition-all"
         >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
         </button>
      </div>

      {/* Play/Pause Overlay Indicator (Subtle) */}
      <AnimatePresence>
        {!isPlaying && isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Area - Main Interaction Zone */}
      <div className="absolute bottom-0 left-0 right-0 z-20">

        {/* Gradient Background for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent -z-10 h-[150%]" />

        <div className="px-4 pb-6 pt-12 flex flex-col gap-4">

           {/* User Info & Description */}
           <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2">
                  <Link href={`/app/videos-creations/creator/${video.user.id}`} className="flex items-center gap-2 group/user">
                    <Avatar className="w-9 h-9 border border-white/20">
                        <AvatarImage src={video.user.image} alt={video.user.name} />
                        <AvatarFallback>{video.user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-bold text-sm drop-shadow-md group-hover/user:underline">
                        @{video.user.name}
                    </span>
                  </Link>
                  {/* Follow button could go here */}
               </div>

               <div className="text-white/90 text-sm leading-snug drop-shadow-md max-w-[95%]">
                    <div className={`${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                        {video.description}
                        {video.category && (
                            <span className="font-bold text-primary ml-2">#{video.category}</span>
                        )}
                    </div>
                    {video.description && video.description.length > 80 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDescriptionExpanded(!isDescriptionExpanded);
                            }}
                            className="text-white/60 text-xs font-semibold mt-0.5 hover:text-white transition-colors"
                        >
                            {isDescriptionExpanded ? "less" : "more"}
                        </button>
                    )}
               </div>
           </div>

           {/* New Horizontal Action Bar */}
           <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-6">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 group/like focus:outline-none"
                    >
                        <Heart
                            className={`w-6 h-6 transition-all duration-300 ${
                                liked ? "fill-rose-500 text-rose-500 scale-110" : "text-white group-hover/like:scale-110"
                            }`}
                        />
                        <span className="text-white text-xs font-bold tabular-nums">{likesCount}</span>
                    </button>

                    {/* Comment */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenComments();
                        }}
                        className="flex items-center gap-1.5 group/comment focus:outline-none"
                    >
                        <MessageCircle className="w-6 h-6 text-white group-hover/comment:scale-110 transition-transform" />
                        <span className="text-white text-xs font-bold">Comment</span>
                    </button>

                    {/* Share */}
                    <button
                         onClick={handleShare}
                         className="flex items-center gap-1.5 group/share focus:outline-none"
                    >
                        <Share2 className="w-6 h-6 text-white group-hover/share:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Shop Button (Prominent if products exist) */}
                {video.products && video.products.length > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenProducts();
                        }}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-transform active:scale-95"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Shop ({video.products.length})</span>
                    </button>
                )}
           </div>

        </div>
      </div>
    </div>
  );
}
