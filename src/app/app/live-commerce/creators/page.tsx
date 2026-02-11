"use client";

import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Video,
  Star,
  CheckCircle2,
  TrendingUp,
  Eye,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const creators = [
  {
    id: "1",
    name: "Ananya Sharma",
    username: "@ananya.style",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop",
    followers: "124K",
    totalViews: "2.4M",
    liveNow: true,
    category: "Minimalist Fashion",
    rating: 4.9,
    isVerified: true
  },
  {
    id: "2",
    name: "Rahul Kapoor",
    username: "@rahulstreetwear",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&h=400&fit=crop",
    followers: "89K",
    totalViews: "1.8M",
    liveNow: false,
    category: "Streetwear",
    rating: 4.7,
    isVerified: true
  },
  {
    id: "3",
    name: "Priya Malhotra",
    username: "@priya.ethnic",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=400&fit=crop",
    followers: "156K",
    totalViews: "3.2M",
    liveNow: true,
    category: "Ethnic Wear",
    rating: 4.8,
    isVerified: true
  },
  {
    id: "4",
    name: "Arjun Singh",
    username: "@arjun.luxury",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop",
    followers: "210K",
    totalViews: "4.1M",
    liveNow: false,
    category: "Luxury Fashion",
    rating: 4.9,
    isVerified: true
  }
];

const categories = ["All", "Live Now", "Minimalist", "Streetwear", "Ethnic", "Luxury"];

export default function CreatorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [following, setFollowing] = useState<string[]>([]);

  const toggleFollow = (id: string) => {
    setFollowing(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredCreators = selectedCategory === "All"
    ? creators
    : selectedCategory === "Live Now"
      ? creators.filter(c => c.liveNow)
      : creators.filter(c => c.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#1a1a1a]">
            Top Creators
          </h1>
          <p className="text-[#6b6b6b] mt-1">
            Discover fashion creators and shop their curated collections
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-[#1a1a1a] text-white shadow-lg shadow-black/10"
                  : "bg-white border border-[#e5e5e5] text-[#6b6b6b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCreators.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[32px] border border-[#e5e5e5] shadow-sm hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={creator.cover}
                  alt={creator.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Live Badge */}
                {creator.liveNow && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Live
                  </div>
                )}

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {creator.totalViews}
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" />
                      {creator.liveNow ? "Live" : "Offline"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Creator Info */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {creator.liveNow && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-lg text-[#1a1a1a]">{creator.name}</h3>
                      {creator.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-100" />
                      )}
                    </div>
                    <p className="text-sm text-[#6b6b6b] mb-2">{creator.username}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#6b6b6b]">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-bold">{creator.followers}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{creator.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      following.includes(creator.id)
                        ? "bg-[#f5f5f5] text-[#6b6b6b] hover:bg-[#e5e5e5]"
                        : "bg-[#1a1a1a] text-white hover:bg-[#333] shadow-lg shadow-black/10"
                    }`}
                  >
                    {following.includes(creator.id) ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Category Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f5]">
                  <span className="px-3 py-1.5 rounded-lg bg-[#f5f5f5] text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider">
                    {creator.category}
                  </span>

                  <Link href={`/app/live-commerce/creators/${creator.id}`}>
                    <button className="flex items-center gap-2 text-sm font-bold text-[#1a1a1a] hover:text-violet-600 transition-colors">
                      View Profile
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending Section */}
        <section className="pt-12 border-t border-[#e5e5e5]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-violet-500" />
              Trending This Week
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-[#f5f5f5] border border-[#e5e5e5] relative">
                  <img
                    src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&sig=${i+30}`}
                    alt="Trending"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-violet-500" />
                    #{i}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#1a1a1a] truncate">Trending Look #{i}</h4>
                <p className="text-xs text-[#6b6b6b]">Featured by 5 creators</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
