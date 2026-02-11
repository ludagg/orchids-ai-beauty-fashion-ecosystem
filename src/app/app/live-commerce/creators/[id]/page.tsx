"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  Users,
  Video,
  ShoppingBag,
  ArrowLeft,
  Grid,
  Play
} from "lucide-react";
import Link from "next/link";

export default function CreatorProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Cover */}
      <div className="relative h-64 sm:h-80 bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=400&fit=crop"
          className="w-full h-full object-cover opacity-60"
          alt="Cover"
        />
        <div className="absolute top-6 left-6">
          <Link href="/app/live-commerce">
            <button className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
          <div className="w-40 h-40 rounded-[48px] border-8 border-white bg-white overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
              className="w-full h-full object-cover"
              alt="Creator"
            />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-[#1a1a1a]">Ananya Sharma</h1>
              <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-50" />
            </div>
            <p className="text-[#6b6b6b] font-medium">@ananya_style • Fashion & Lifestyle Creator</p>
          </div>
          <div className="flex gap-3 pb-2">
            <button className="px-8 py-3 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all shadow-lg shadow-black/10">
              Follow
            </button>
            <button className="p-3 rounded-2xl border border-[#e5e5e5] text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 py-6 border-y border-[#f5f5f5] mb-8 overflow-x-auto no-scrollbar">
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">124k</p>
            <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Followers</p>
          </div>
          <div className="w-px h-10 bg-[#f5f5f5]" />
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">482k</p>
            <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Likes</p>
          </div>
          <div className="w-px h-10 bg-[#f5f5f5]" />
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">86</p>
            <p className="text-xs font-bold text-[#c4c4c4] uppercase tracking-widest">Streams</p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-4 mb-12">
          <p className="text-[#1a1a1a] text-lg leading-relaxed max-w-2xl">
            Founder of Studio Épure. Exploring the intersection of traditional Indian textiles and modern minimalist design. New streams every Tuesday & Friday! ✨
          </p>
          <div className="flex flex-wrap gap-2">
            {["Minimalism", "Eco-Fashion", "Indian Textiles", "Style Tips"].map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-[#f5f5f5] text-[#6b6b6b] text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="space-y-8 pb-20">
          <div className="flex items-center gap-8 border-b border-[#f5f5f5]">
            <button className="pb-4 text-sm font-bold border-b-2 border-[#1a1a1a] text-[#1a1a1a]">Videos</button>
            <button className="pb-4 text-sm font-bold text-[#c4c4c4] hover:text-[#1a1a1a] transition-colors">Past Streams</button>
            <button className="pb-4 text-sm font-bold text-[#c4c4c4] hover:text-[#1a1a1a] transition-colors">Shop</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#f5f5f5] group cursor-pointer shadow-lg shadow-black/5"
              >
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=400&h=600&fit=crop`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="Video"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold">12k views</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
