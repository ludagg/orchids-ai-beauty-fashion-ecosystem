"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Fashion Marketplace",
    description: "Curated collections from India's finest designers. Shop with confidence.",
    icon: ShoppingBag,
    color: "#e11d48",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f",
  },
  {
    title: "Salon Booking",
    description: "Book verified beauty services instantly. Real reviews, real results.",
    icon: Scissors,
    color: "#9333ea",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
  },
  {
    title: "Video Commerce",
    description: "Shop from live streams and videos. See it, love it, own it.",
    icon: Video,
    color: "#2563eb",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  {
    title: "AI Stylist",
    description: "Your personal style advisor. Intelligent recommendations, perfect fits.",
    icon: Sparkles,
    color: "#059669",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
  },
];

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
    <section id="features" ref={featuresRef} className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
            Platform
          </span>
          <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
            One ecosystem.
            <br />
            <span className="text-muted-foreground italic">Endless possibilities.</span>
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
                    className={`absolute w-[320px] sm:w-[380px] md:w-[440px] cursor-pointer ${isHidden ? "pointer-events-none" : ""}`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
            className={`relative rounded-3xl overflow-hidden bg-card shadow-2xl transition-shadow duration-500 ${isActive ? "shadow-black/20 dark:shadow-white/5" : "shadow-foreground/10"}`}
                      style={{
                      border: isActive ? `2px solid ${feature.color}30` : "1px solid var(--border)",
                      }}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute top-4 left-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl"
                            style={{ backgroundColor: `${feature.color}90` }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2 font-display">
                              {feature.title}
                            </h3>
                            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4">
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

          <div className="flex items-center justify-center gap-3 mt-8">
            {features.map((feature, i) => (
              <button
                key={feature.title}
                onClick={() => setActiveFeature(i)}
                className={`relative h-2 rounded-full transition-all duration-500 ${
                  i === activeFeature ? "w-10" : "w-2 hover:w-4"
                }`}
                style={{
                  backgroundColor: i === activeFeature ? feature.color : "var(--muted-foreground)",
                  opacity: i === activeFeature ? 1 : 0.3
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-8">
            <button
              onClick={() => setActiveFeature((prev) => (prev - 1 + features.length) % features.length)}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{activeFeature + 1}</span> / {features.length}
              </p>
            </div>
            <button
              onClick={() => setActiveFeature((prev) => (prev + 1) % features.length)}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}