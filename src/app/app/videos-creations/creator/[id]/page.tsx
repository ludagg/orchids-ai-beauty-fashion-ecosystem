"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Users,
  Video,
  ShoppingBag,
  Grid,
  Calendar,
  MoreVertical,
  Plus,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const creatorData = {
  name: "Ananya Sharma",
  role: "Fashion & Lifestyle Creator",
  bio: "Exploring the intersection of sustainability and high fashion. India-based. Minimalist at heart. 🌿",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=600&fit=crop",
  followers: "124k",
  following: "432",
  likes: "2.4M",
  isFollowing: false,
  collections: [
    { title: "Summer Minimalist", items: 24, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop" },
    { title: "Sustainable Silk", items: 12, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop" },
    { title: "Urban Escape", items: 18, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop" }
  ],
  recentVideos: [
    { id: 1, views: "45k", thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop" },
    { id: 2, views: "12k", thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop" },
    { id: 3, views: "89k", thumbnail: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=600&fit=crop" },
    { id: 4, views: "34k", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop" }
  ]
};

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(creatorData.isFollowing);

  return (
    <div className="min-h-screen bg-card">
      {/* Header / Cover */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden">
        <img src={creatorData.cover} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Link
          href="/app/videos-creations"
          className="absolute top-6 left-6 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-black/40 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 sm:-mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="flex flex-col sm:flex-row items-end gap-6 w-full sm:w-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-[40px] border-4 border-white bg-card overflow-hidden shadow-2xl">
              <img src={creatorData.avatar} alt={creatorData.name} className="w-full h-full object-cover" />
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
                {creatorData.name}
                <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500/10" />
              </h1>
              <p className="text-muted-foreground font-medium">{creatorData.role}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-center sm:text-left">
                  <p className="font-bold text-foreground">{creatorData.followers}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Followers</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-foreground">{creatorData.following}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Following</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-foreground">{creatorData.likes}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Likes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 sm:flex-none h-12 px-8 rounded-2xl font-bold transition-all ${
                isFollowing
                  ? "bg-muted text-foreground border border-border"
                  : "bg-foreground text-white shadow-xl shadow-foreground/10 hover:bg-[#333]"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="h-12 w-12 rounded-2xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="h-12 w-12 rounded-2xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="py-8">
          <p className="text-muted-foreground leading-relaxed max-w-2xl italic">
            &quot;{creatorData.bio}&quot;
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar">
          {[
            { label: "Videos", icon: Video, count: "42" },
            { label: "Collections", icon: ShoppingBag, count: "12" },
            { label: "Bookings", icon: Calendar, count: null },
            { label: "Activity", icon: Grid, count: null }
          ].map((tab, i) => (
            <button
              key={tab.label}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                i === 0 ? "text-foreground border-foreground" : "text-muted-foreground/50 border-transparent hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count && <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px]">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {creatorData.recentVideos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -5 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted group cursor-pointer border border-border"
            >
              <img src={video.thumbnail} alt="Video" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <Video className="w-3 h-3" />
                {video.views} views
              </div>
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 0.98 }}
            className="aspect-[3/4] rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground/50 hover:text-foreground hover:border-foreground transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">View More</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
