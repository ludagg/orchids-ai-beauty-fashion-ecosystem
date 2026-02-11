"use client";

import { motion } from "framer-motion";
import {
  Video,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  Play,
  Heart,
  Search,
  CheckCircle2,
  Zap,
  Tag,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  "All", "Fashion", "Beauty", "Lifestyle", "Luxury", "Streetwear", "Minimalist"
];

const trendingStreams = [
  {
    id: "1",
    title: "Summer Collection Launch 🌿",
    creator: "Ananya Sharma",
    viewers: "1.2k",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    category: "Fashion"
  },
  {
    id: "2",
    title: "Minimalist Skincare Routine ✨",
    creator: "Priya Patel",
    viewers: "850",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800&h=1000&fit=crop",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    category: "Beauty"
  },
  {
    id: "3",
    title: "Streetwear Trends 2026 👟",
    creator: "Rahul Mehra",
    viewers: "2.1k",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    category: "Streetwear"
  }
];

const topCreators = [
  { name: "Sonia Gupta", followers: "124k", avatar: "https://i.pravatar.cc/150?u=sonia", rating: 4.9 },
  { name: "Vikram Singh", followers: "89k", avatar: "https://i.pravatar.cc/150?u=vikram", rating: 4.8 },
  { name: "Anita Desai", followers: "210k", avatar: "https://i.pravatar.cc/150?u=anita", rating: 5.0 },
  { name: "Karan Johar", followers: "1.2M", avatar: "https://i.pravatar.cc/150?u=karan", rating: 4.7 }
];

export default function LiveCommerceIndex() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);

  const toggleFollow = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFollowedCreators(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-10 max-w-[1400px] mx-auto w-full">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] rounded-[40px] overflow-hidden bg-[#1a1a1a] dark:bg-card flex items-center px-8 sm:px-12 border border-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-widest text-white"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live Now
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-display leading-[1.1]"
          >
            Shop the <span className="italic text-rose-400">Future.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-md leading-relaxed"
          >
            Join interactive live streams from top creators and shop exclusively curated collections in real-time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/app/live-commerce/1">
              <button className="px-8 py-4 rounded-2xl bg-white text-[#1a1a1a] font-bold text-base hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center gap-3 group">
                Watch Featured Stream
                <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Trending Streams Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2 font-display text-foreground">
            <TrendingUp className="w-6 h-6 text-rose-500" />
            Trending Streams
          </h2>
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingStreams.map((stream, i) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/app/live-commerce/${stream.id}`}>
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-4 shadow-xl border border-border">
                  <img
                    src={stream.image}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      {stream.viewers}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-xl mb-3 line-clamp-2 leading-tight">
                      {stream.title}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-white/20 p-0.5 overflow-hidden">
                        <img src={stream.avatar} alt={stream.creator} className="w-full h-full object-cover rounded-[10px]" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm flex items-center gap-1">
                          {stream.creator}
                          <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                        </p>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{stream.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Creators Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2 font-display text-foreground">
            <Star className="w-6 h-6 text-amber-500" />
            Top Creators
          </h2>
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            See Discover <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topCreators.map((creator, i) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-6 rounded-[32px] bg-card border border-border hover:border-foreground transition-all group text-center relative"
            >
              <button
                onClick={(e) => toggleFollow(creator.name, e)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-all active:scale-90 z-10 ${
                  followedCreators.includes(creator.name)
                    ? "bg-rose-500 text-white"
                    : "bg-secondary text-foreground hover:bg-border"
                }`}
              >
                {followedCreators.includes(creator.name) ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <Link href={`/app/live-commerce/creator/${i+1}`}>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-rose-500 to-violet-500 animate-spin-slow opacity-20 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-full h-full rounded-[24px] overflow-hidden border-2 border-white shadow-xl">
                    <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="font-bold text-foreground flex items-center justify-center gap-1">
                  {creator.name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{creator.followers} followers</p>
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[1,2,3].map(j => (
                      <div key={j} className="w-5 h-5 rounded-full border border-card bg-secondary overflow-hidden">
                        <img src={`https://i.pravatar.cc/50?u=${creator.name}${j}`} alt="fan" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Top Tier</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coming Soon / Categories Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[40px] bg-gradient-to-br from-violet-600 to-indigo-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-3xl font-bold font-display">Creator Studio</h3>
              <p className="text-white/70 mt-2 leading-relaxed">
                Are you a designer or fashion influencer? Start your own live stream and reach millions.
              </p>
            </div>
            <button className="px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
              Apply Now
            </button>
          </div>
        </div>

        <div className="p-10 rounded-[40px] bg-secondary border border-border flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground">
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground font-display">Flash Sales</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Don't miss out on upcoming limited-time events from luxury brands.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-card overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=sale${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-foreground">
              +1.2k people interested
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
