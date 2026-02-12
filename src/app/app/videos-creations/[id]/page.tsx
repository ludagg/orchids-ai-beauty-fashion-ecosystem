"use client";

import { Users, Heart, Share2, X, Play, Pause, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function VideoDetailPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <main className="w-full max-w-[1280px] p-4 space-y-4">
        {/* Video Player Container - 16:9 Aspect Ratio */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl">
          {/* Placeholder for Video */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop"
              alt="Live Stream"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>

          {/* Top Overlays */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-card" />
                Live
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                <Users className="w-3.5 h-3.5" />
                1.2k watching
              </div>
            </div>

            <Link href="/app/videos-creations">
              <button className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/10">
                <X className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Center Play/Pause Control */}
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-all border border-white/30"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 fill-current" />
              ) : (
                <Play className="w-10 h-10 fill-current ml-1" />
              )}
            </button>
          </div>

           {/* Bottom Right Volume Control */}
           <div className="absolute bottom-6 right-6 z-20">
             <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
           </div>
        </div>

        {/* Video Details Section (Below Video) */}
        <div className="space-y-6 pt-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Summer Minimalist Collection Launch 🌿</h1>
               <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>1.2k watching</span>
                  <span>•</span>
                  <span>Started 10 mins ago</span>
               </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                 {/* Creator Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-rose-500 p-0.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                      alt="Creator"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold flex items-center gap-1.5">
                      Ananya Sharma
                      <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                    </h3>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Fashion & Lifestyle</p>
                  </div>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`ml-4 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      isFollowing
                        ? "bg-muted text-foreground"
                        : "bg-foreground text-white hover:opacity-90"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                   <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border ${
                      liked
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-muted text-foreground border-transparent hover:bg-muted/80"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    <span>4.8k</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-foreground font-bold border border-transparent hover:bg-muted/80 transition-all">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-muted/50 text-sm text-foreground/80 leading-relaxed max-w-4xl">
               <p className="font-bold mb-2">Description</p>
               <p>
                Exploring the new Eco-Linen arrivals! 🌿 Sustainable, breathable, and perfect for your summer escapes.
                In this stream, we will be going through the entire catalog, trying on different sizes, and answering your questions about fabric care.
              </p>
            </div>
        </div>
      </main>
    </div>
  );
}