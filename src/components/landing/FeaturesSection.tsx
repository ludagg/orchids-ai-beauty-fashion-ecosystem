"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Scissors, Video, Sparkles, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Fashion Marketplace",
    description: "Curated collections from India's finest designers. Shop with confidence.",
    icon: ShoppingBag,
    color: "#e11d48",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop",
  },
  {
    title: "Salon Booking",
    description: "Book verified beauty services instantly. Real reviews, real results.",
    icon: Scissors,
    color: "#9333ea",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
  },
  {
    title: "Video Commerce",
    description: "Shop from live streams and videos. See it, love it, own it.",
    icon: Video,
    color: "#2563eb",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
  },
  {
    title: "AI Stylist",
    description: "Your personal style advisor. Intelligent recommendations, perfect fits.",
    icon: Sparkles,
    color: "#059669",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
  },
];

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium mb-6 uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight font-display text-foreground">
            One ecosystem.
            <br />
            <span className="text-muted-foreground font-light italic">Endless possibilities.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="relative h-[500px] sm:h-[560px] md:h-[620px] flex items-center justify-center perspective-[1200px]">
            <AnimatePresence mode="popLayout">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                const offset = (i - activeFeature + features.length) % features.length;
                const isActive = offset === 0;
                const isNext = offset === 1;
                const isPrev = offset === features.length - 1;
                const isHidden = !isActive && !isNext && !isPrev;

                let xPos = 0;
                let zPos = 0;
                let rotation = 0;
                let scale = 1;
                let opacity = 1;

                if (isActive) {
                  xPos = 0;
                  zPos = 0;
                  rotation = 0;
                  scale = 1;
                  opacity = 1;
                } else if (isNext) {
                  xPos = 280;
                  zPos = -150;
                  rotation = -8;
                  scale = 0.85;
                  opacity = 0.6;
                } else if (isPrev) {
                  xPos = -280;
                  zPos = -150;
                  rotation = 8;
                  scale = 0.85;
                  opacity = 0.6;
                } else {
                  xPos = offset > features.length / 2 ? -400 : 400;
                  zPos = -300;
                  rotation = offset > features.length / 2 ? 15 : -15;
                  scale = 0.7;
                  opacity = 0;
                }

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 100, rotateY: -15 }}
                    animate={{
                      x: xPos,
                      z: zPos,
                      rotateY: rotation,
                      scale,
                      opacity,
                      zIndex: isActive ? 30 : isNext || isPrev ? 20 : 10,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      mass: 1,
                    }}
                    onClick={() => !isActive && setActiveFeature(i)}
                    className={cn(
                      "absolute w-[300px] sm:w-[360px] md:w-[420px] cursor-pointer touch-none select-none",
                      isHidden && "pointer-events-none opacity-0"
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className={cn(
                        "relative rounded-3xl overflow-hidden bg-card transition-all duration-500 border border-border/50",
                        isActive ? "shadow-2xl shadow-black/5 ring-1 ring-border/50" : "shadow-lg shadow-black/5 opacity-80 grayscale-[0.5]"
                      )}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden group">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-6 left-6">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-lg"
                            style={{ backgroundColor: `${feature.color}cc` }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3 font-display tracking-wide">
                              {feature.title}
                            </h3>
                            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 font-light">
                              {feature.description}
                            </p>
                            {isActive && (
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors group/btn"
                              >
                                Explore
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                              </motion.button>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-12">
            {features.map((feature, i) => (
              <button
                key={feature.title}
                onClick={() => setActiveFeature(i)}
                className={cn(
                    "relative h-1.5 rounded-full transition-all duration-500",
                    i === activeFeature ? "w-8 bg-foreground" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setActiveFeature((prev) => (prev - 1 + features.length) % features.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="text-center min-w-[60px]">
              <p className="text-xs tracking-widest text-muted-foreground font-medium">
                <span className="text-foreground">{String(activeFeature + 1).padStart(2, '0')}</span> / {String(features.length).padStart(2, '0')}
              </p>
            </div>
            <button
              onClick={() => setActiveFeature((prev) => (prev + 1) % features.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
