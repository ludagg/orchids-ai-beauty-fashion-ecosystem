"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Users,
  Heart,
  MessageCircle,
  ShoppingBag,
  Share2,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Star,
  ChevronRight,
  TrendingUp,
  Tag,
  ArrowRight,
  CheckCircle2,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

const liveProducts = [
  {
    id: 1,
    title: "Eco-Linen Summer Set",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop",
    discount: "20% OFF",
    stock: "Low Stock"
  },
  {
    id: 2,
    title: "Artisan Silk Scarf",
    price: "₹1,299",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop",
    discount: null,
    stock: "Available"
  }
];

const comments = [
  { id: 1, user: "Ananya", text: "Love that linen set! Is it available in blue?", color: "bg-rose-500" },
  { id: 2, user: "Rahul", text: "Just ordered! Can't wait 😍", color: "bg-blue-500" },
  { id: 3, user: "Priya", text: "Does it shrink after wash?", color: "bg-violet-500" },
  { id: 4, user: "Karan", text: "The quality looks amazing on screen", color: "bg-emerald-500" }
];

export default function LiveCommercePage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen bg-black overflow-hidden flex flex-col lg:flex-row">
      {/* Video Stream Container */}
      <main className="flex-1 relative bg-foreground flex items-center justify-center group">
        {/* Placeholder for Video */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop"
            alt="Live Stream"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        {/* Live UI Overlay - Top */}
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

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/10">
              <Share2 className="w-5 h-5" />
            </button>
            <Link href="/app/live-commerce">
              <button className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/10">
                <X className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Centered Controls Overlay (Visible on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-all border border-white/30"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>
        </div>

        {/* Bottom UI Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-6 z-10">
          <div className="flex items-end justify-between">
            {/* Creator Info and Stream Details */}
            <div className="space-y-4 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border-2 border-rose-500 p-0.5 shadow-xl shadow-rose-500/20">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Creator"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-1.5">
                    Ananya Sharma
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                  </h3>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Summer Minimalist Collection</p>
                </div>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`ml-4 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95 ${
                    isFollowing ? "bg-card/20 text-white backdrop-blur-md" : "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/30"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
              <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                Exploring the new Eco-Linen arrivals! 🌿 Sustainable, breathable, and perfect for your summer escapes. Check out the cart below.
              </p>
            </div>

            {/* Side Actions (Vertical) */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`p-3 rounded-full backdrop-blur-md transition-all border ${
                  liked ? "bg-rose-500 border-rose-500 shadow-xl shadow-rose-500/40" : "bg-black/40 border-white/10 text-white hover:bg-black/60"
                }`}>
                  <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
                </div>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">4.8k</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">124</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </div>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">{isMuted ? "Muted" : "Audio"}</span>
              </button>
            </div>
          </div>

          {/* Featured Product Banner - Mobile */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:hidden p-4 rounded-3xl bg-card shadow-2xl flex items-center gap-4 border border-border"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-inner">
              <img src={liveProducts[0].image} alt="Featured" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">{liveProducts[0].title}</h4>
              <p className="text-foreground font-bold">{liveProducts[0].price}</p>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-foreground text-white text-xs font-bold hover:bg-[#333] transition-all flex items-center gap-2">
              Buy Now <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Sidebar - Desktop (Chat & Shopping) */}
      <aside className="hidden lg:flex w-96 bg-card border-l border-border flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
              !showCart ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
            onClick={() => setShowCart(false)}
          >
            Chat
          </button>
          <button
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
              showCart ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
            onClick={() => setShowCart(true)}
          >
            Shop ({liveProducts.length})
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!showCart ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col p-6 space-y-6"
              >
                <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                  <div className="p-4 rounded-2xl bg-muted border border-border text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Welcome to the stream!</p>
                    <p className="text-xs text-muted-foreground mt-1">Be respectful and have fun shopping 🛍️</p>
                  </div>

                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${comment.color}`}>
                        {comment.user[0]}
                      </div>
                      <div className="space-y-1 max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{comment.user}</span>
                        </div>
                        <div className="p-3 rounded-2xl rounded-tl-none bg-muted text-sm text-foreground">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type a comment..."
                      className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-muted border-transparent focus:bg-card focus:border-border transition-all outline-none text-sm"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-foreground text-white hover:bg-[#333] transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="shop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto p-6 space-y-6 no-scrollbar"
              >
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">On Screen Now</h4>
                  <div className="group relative rounded-[32px] overflow-hidden border-2 border-rose-500 bg-card shadow-2xl shadow-rose-500/10 transition-all hover:-translate-y-1">
                    <div className="relative aspect-square">
                      <img src={liveProducts[0].image} alt="Featured" className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                        {liveProducts[0].discount}
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button className="p-2.5 rounded-full bg-card shadow-xl hover:scale-110 transition-all">
                          <Heart className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-bold text-foreground">{liveProducts[0].title}</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">Studio Épure • Linen</p>
                        </div>
                        <p className="font-bold text-lg text-rose-600">{liveProducts[0].price}</p>
                      </div>
                      <Link href="/app/cart">
                        <button className="w-full py-4 rounded-2xl bg-foreground text-white font-bold hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-foreground/10 group/btn">
                          Add to Bag
                          <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">More From the Stream</h4>
                  {liveProducts.slice(1).map((product) => (
                    <div key={product.id} className="flex gap-4 p-3 rounded-2xl bg-card border border-border hover:border-foreground transition-all cursor-pointer group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-inner">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <h6 className="font-bold text-sm text-foreground truncate">{product.title}</h6>
                          <p className="text-xs font-bold text-rose-600 mt-1">{product.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{product.stock}</span>
                        </div>
                      </div>
                      <button className="self-center p-2.5 rounded-xl bg-muted text-foreground hover:bg-foreground hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
