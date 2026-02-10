"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function MotionVideo() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.95, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.95, 1], [1, 1, 0.8]);
  const blur = useTransform(scrollYProgress, [0.95, 1], [0, 20]);

  useEffect(() => {
    setMounted(true);
    // Generate floating particles
    const particleArray: FloatingParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * 400,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    setParticles(particleArray);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative h-[400vh] w-full">
      {/* Pinned container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="relative w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700"
          style={{
            opacity,
            scale,
            filter: blur ? `blur(${blur}px)` : "none",
          }}
        >
          {/* Background gradient animation */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              animate: {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              },
              transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

          {/* Progress bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-50"
            initial={{ scaleX: 0 }}
            style={{ scaleX: progress }}
            transform-origin="0%"
          />

          {/* Scene 1: Logo */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <Image
                  src="/priisme-logo.svg"
                  alt="Priisme Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-6xl font-bold text-white mb-4 tracking-wide">
                PRIISME
              </h1>
              <p className="text-2xl text-white/80 font-light tracking-wider">
                L'ÉCOSYSTÈME BEAUTÉ & MODE
              </p>
            </motion.div>
          </motion.div>

          {/* Scene 2: Shopping Cards */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div className="grid grid-cols-3 gap-8 max-w-4xl">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="relative"
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-48 h-64 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                    <div className="w-full h-40 bg-gradient-to-br from-pink-300 to-purple-400 relative">
                      <div className="absolute inset-4 bg-white/20 rounded-lg" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">
                        Produit Premium {i}
                      </h3>
                      <p className="text-white/70 text-sm">
                        Innovation IA avancée
                      </p>
                      <div className="mt-4 text-white font-bold">
                        {99 + i * 10}€
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scene 3: Rotating Circle */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <motion.div
              className="relative w-96 h-96"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/30"
                style={{ borderTopColor: "#ff6b6b", borderRightColor: "#4ecdc4" }}
              />
              
              {/* Inner ring */}
              <motion.div
                className="absolute inset-8 rounded-full border-2 border-white/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ borderBottomColor: "#45b7d1", borderLeftColor: "#f7b731" }}
              />
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-2xl font-bold">AI</span>
                </div>
              </div>
              
              {/* Orbiting elements */}
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 bg-white rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Scene 4: Product Grid */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <div className="grid grid-cols-4 gap-6 max-w-6xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                >
                  <div className="aspect-square bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/50 to-purple-600/50" />
                    <div className="absolute inset-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Floating price tag */}
                    <motion.div
                      className="absolute top-2 right-2 bg-white/90 text-purple-800 px-2 py-1 rounded-full text-xs font-bold"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {50 + i * 25}€
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scene 5: Call to Action */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <div className="text-center space-y-8">
              <motion.h2
                className="text-5xl font-bold text-white mb-6"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                PRÊT À REVOLUTIONNER
                <br />
                VOTRE BEAUTÉ ?
              </motion.h2>
              
              <motion.div
                className="space-y-4"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  className="bg-white text-purple-800 hover:bg-white/90 px-12 py-6 text-xl font-semibold rounded-full shadow-2xl"
                >
                  COMMENCER MAINTENANT
                </Button>
                <p className="text-white/70 text-sm">
                  Rejoignez des milliers d'utilisateurs satisfaits
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: particle.size,
                height: particle.size,
                left: particle.x,
                top: particle.y,
                opacity: particle.opacity,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.sin(particle.id) * 30, 0],
                opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
              }}
              transition={{
                duration: 10 + particle.speed * 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.id * 0.5,
              }}
            />
          ))}

          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}