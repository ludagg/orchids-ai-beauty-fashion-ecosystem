"use client";

import { motion } from "framer-motion";
import { Play, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LiveHero() {
  const [heroVideo, setHeroVideo] = useState<any>(null);

  useEffect(() => {
    async function fetchHero() {
        try {
            const res = await fetch("/api/videos?sortBy=popular&limit=1");
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setHeroVideo(data[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching hero video:", error);
        }
    }
    fetchHero();
  }, []);

  if (!heroVideo) {
    return (
    <section className="relative h-[400px] sm:h-[500px] rounded-[40px] overflow-hidden bg-foreground dark:bg-card flex items-end sm:items-center px-6 sm:px-12 py-10 sm:py-0 border border-border shadow-2xl group cursor-pointer">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=900&fit=crop"
          alt="Hero"
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/40 to-transparent opacity-90 sm:opacity-100" />
      </div>

      <div className="relative z-10 max-w-xl space-y-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-500/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Featured Live
        </motion.div>

        <div className="space-y-2">
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white font-display leading-[1.1] drop-shadow-lg"
            >
            Paris Fashion Week <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">
                Exclusive Access
            </span>
            </motion.h1>

            <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="flex items-center gap-2 text-white/80 font-medium"
            >
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                    <Users className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-xs">12.5k watching</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-sm">Started 15m ago</span>
            </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none"
        >
          Join us backstage with top designers as we reveal the upcoming Fall/Winter collection before anyone else.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 pt-2"
        >
          <Link href="/app/videos-creations/featured-live" className="flex-1 sm:flex-none">
            <span className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-base hover:bg-rose-50 transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3 group/btn cursor-pointer">
              Watch Now
              <Play className="w-5 h-5 fill-current transition-transform group-hover/btn:scale-110" />
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/20">
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white/20" alt="Host" />
             <div className="text-white">
                 <p className="text-xs font-bold leading-none mb-1 flex items-center gap-1">
                     Chloe Verner <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                 </p>
                 <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Host</p>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
    );
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] rounded-[40px] overflow-hidden bg-foreground dark:bg-card flex items-end sm:items-center px-6 sm:px-12 py-10 sm:py-0 border border-border shadow-2xl group cursor-pointer">
      <div className="absolute inset-0 z-0">
        <img
          src={heroVideo.thumbnailUrl || heroVideo.videoUrl}
          alt={heroVideo.title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/40 to-transparent opacity-90 sm:opacity-100" />
      </div>

      <div className="relative z-10 max-w-xl space-y-6 w-full">
        {heroVideo.isLive && (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-500/20"
            >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live Now
            </motion.div>
        )}

        <div className="space-y-2">
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white font-display leading-[1.1] drop-shadow-lg line-clamp-2"
            >
            {heroVideo.title}
            </motion.h1>

            <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="flex items-center gap-2 text-white/80 font-medium"
            >
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                    <Users className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-xs">{heroVideo.views} views</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-sm">{new Date(heroVideo.createdAt).toLocaleDateString()}</span>
            </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed line-clamp-2"
        >
          {heroVideo.description || "Watch this amazing video from our top creators."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 pt-2"
        >
          <Link href={`/app/videos-creations/${heroVideo.id}`} className="flex-1 sm:flex-none">
            <span className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-base hover:bg-rose-50 transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3 group/btn cursor-pointer">
              Watch Now
              <Play className="w-5 h-5 fill-current transition-transform group-hover/btn:scale-110" />
            </span>
          </Link>

          {heroVideo.user && (
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/20">
                 <img src={heroVideo.user.image || "https://github.com/shadcn.png"} className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" alt={heroVideo.user.name} />
                 <div className="text-white">
                     <p className="text-xs font-bold leading-none mb-1 flex items-center gap-1">
                         {heroVideo.user.name}
                         {heroVideo.salon && <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />}
                     </p>
                     <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Creator</p>
                 </div>
              </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
