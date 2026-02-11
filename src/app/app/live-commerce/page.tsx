"use client";

import { motion } from "framer-motion";
import {
  Video,
  Users,
  TrendingUp,
  Search,
  ChevronRight,
  Play,
  ArrowRight,
  Star,
  CheckCircle2,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const liveStreams = [
  {
    id: 1,
    title: "Summer Collection Launch 🌿",
    creator: "Ananya Sharma",
    viewers: "1.2k",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Minimalist Style Guide",
    creator: "Rahul Mehra",
    viewers: "856",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=800&h=1000&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Streetwear Trends 2026",
    creator: "Zoe Chen",
    viewers: "2.4k",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=1000&fit=crop",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

const creators = [
  { id: 1, name: "Ananya Sharma", followers: "124k", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  { id: 2, name: "Rahul Mehra", followers: "86k", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { id: 3, name: "Priya Patel", followers: "210k", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  { id: 4, name: "Vikram Singh", followers: "45k", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" }
];

export default function LiveDiscoveryPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 max-w-[1400px] mx-auto w-full">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[48px] overflow-hidden bg-[#1a1a1a] flex items-center p-8 sm:p-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=800&fit=crop"
            className="w-full h-full object-cover opacity-50"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Live Now
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight font-display">
            The Future of <br />
            <span className="text-rose-500 italic">Shopping is Live.</span>
          </h1>
          <p className="text-white/70 text-lg">Watch, interact, and shop your favorite styles in real-time.</p>
          <Link href="/app/live-commerce/watch/1">
            <button className="mt-4 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all flex items-center gap-2">
              Watch Highlight <Play className="w-4 h-4 fill-current" />
            </button>
          </Link>
        </div>
      </section>

      {/* Live Now Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Trending Streams</h2>
          </div>
          <button className="text-sm font-bold text-[#6b6b6b] hover:text-[#1a1a1a] flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStreams.map((stream, i) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/app/live-commerce/watch/${stream.id}`}>
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-4 shadow-xl shadow-black/5">
                  <img src={stream.image} alt={stream.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      Live
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      {stream.viewers}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{stream.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                        <img src={stream.avatar} alt={stream.creator} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-white/80">{stream.creator}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Creators Section */}
      <section className="space-y-8 py-12 border-y border-[#f5f5f5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-500">
              <Star className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Featured Creators</h2>
          </div>
          <button className="text-sm font-bold text-[#6b6b6b] hover:text-[#1a1a1a] flex items-center gap-1">
            Discover Creators <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {creators.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group text-center"
            >
              <Link href={`/app/live-commerce/creators/${creator.id}`}>
                <div className="relative mb-4 mx-auto w-32 h-32 sm:w-40 sm:h-40">
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-violet-500 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-[3px] bg-white rounded-full p-1 z-10">
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-[#1a1a1a] group-hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5">
                  {creator.name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                </h3>
                <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest mt-1">{creator.followers} followers</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories / Trends */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Shop by Vibe</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Quiet Luxury", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=300&fit=crop", color: "bg-slate-900" },
            { label: "Street Edge", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop", color: "bg-rose-900" },
            { label: "Ethnic Chic", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop", color: "bg-amber-900" },
            { label: "Eco Minimal", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop", color: "bg-emerald-900" },
          ].map((vibe, i) => (
            <motion.div
              key={vibe.label}
              whileHover={{ y: -5 }}
              className={`relative h-40 rounded-[32px] overflow-hidden cursor-pointer group`}
            >
              <img src={vibe.image} alt={vibe.label} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className={`absolute inset-0 ${vibe.color}/40 mix-blend-multiply group-hover:bg-black/20 transition-all`} />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-white font-bold text-lg uppercase tracking-widest text-center">{vibe.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
