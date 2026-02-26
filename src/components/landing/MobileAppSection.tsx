"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

export default function MobileAppSection() {
  return (
    <section id="download" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">

          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium mb-6 uppercase tracking-wider">
                Mobile App
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-8 font-display text-foreground">
                Fashion in your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500 font-light italic">pocket.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg mx-auto md:mx-0 font-light">
                Experience the full power of Rare on iOS and Android.
                Watch live streams, try on clothes virtually, and book salons on the go.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button className="flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] w-full sm:w-auto justify-center shadow-lg shadow-black/10">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 flex-shrink-0">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.69-.93.95 0 2.58.55 3.51 1.91-2.92 1.66-2.42 5.92.53 7.15-.69 1.83-1.65 3.58-2.81 4.1zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wide">Download on the</div>
                    <div className="text-base font-bold leading-none">App Store</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] w-full sm:w-auto justify-center shadow-lg shadow-black/10">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 flex-shrink-0">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-1.61-.77V2.585a1 1 0 0 1 1.61-.771zM15.42 13.628l-3.326-3.326 3.324-3.325 3.303 1.884a1.002 1.002 0 0 1 0 1.737l-3.3 1.884-.001-.154zM4.618 24l11.433-6.516-2.91-2.909L4.618 24zM4.618 0l8.523 9.426 2.91-2.91L4.618 0z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wide">GET IT ON</div>
                    <div className="text-base font-bold leading-none">Google Play</div>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2 mt-8 justify-center md:justify-start">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">4.9/5 rating on App Store</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 relative flex justify-center w-full"
          >
            {/* Phone Mockup */}
            <div className="relative z-10 w-[280px] sm:w-[320px] h-[580px] sm:h-[640px] bg-black rounded-[48px] border-[8px] border-zinc-900 overflow-hidden shadow-2xl shadow-black/20 ring-1 ring-zinc-800">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-zinc-900 rounded-b-2xl z-20" />

              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=1200&fit=crop"
                alt="App Interface"
                className="w-full h-full object-cover opacity-90"
              />

              {/* App UI Overlay Mockup */}
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-zinc-800">
                     <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <p className="text-white font-medium text-sm">@fashionista</p>
                     <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-white/70 text-[10px] uppercase tracking-wide">Live</p>
                     </div>
                  </div>
                </div>
                <button className="w-full py-3.5 rounded-full bg-white text-black font-medium text-sm hover:scale-105 transition-transform active:scale-[0.98]">
                  Shop Look (3 items)
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

            <motion.div
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-24 -right-4 sm:right-0 bg-background/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 max-w-[180px]"
            >
               <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">Live Now</p>
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
               </div>
               <div className="flex -space-x-3 mb-1 pl-1">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-zinc-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-background bg-zinc-100 flex items-center justify-center text-[10px] font-medium text-muted-foreground">+2k</div>
               </div>
               <p className="text-[10px] text-muted-foreground mt-2">Join the conversation</p>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
