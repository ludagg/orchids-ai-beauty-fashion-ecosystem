"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

const trustBadges = [
  "Secure Payments",
  "Easy Returns",
  "Verified Sellers",
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.3]" />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-500/[0.08] blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-500/[0.08] blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-violet-500/[0.05] blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-[980px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-muted-foreground">
            AI-Powered Beauty & Fashion Ecosystem
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-bold leading-[1.0] tracking-tighter font-display"
        >
          Where Fashion
          <br />
          <span className="text-gradient-color font-display italic">Meets Intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[17px] md:text-[21px] text-muted-foreground max-w-[540px] mx-auto mt-6 leading-relaxed"
        >
          Experience the future of fashion. Explore our AI-powered ecosystem
          and discover the intelligence behind style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full max-w-[600px] mx-auto"
        >
          <Link href="/app" className="flex-1 w-full group">
            <button
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-medium text-[17px] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 h-14 rounded-full bg-card border border-border font-medium text-[17px] hover:bg-secondary transition-all hover:border-muted-foreground/30 active:scale-[0.98] flex items-center justify-center gap-2 group">
            <Play className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10"
        >
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {badge}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ x: springX, y: springY }}
        className="relative w-full max-w-[1100px] mx-auto mt-16 px-6"
      >
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-secondary to-card shadow-2xl shadow-foreground/10 border border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
              <p className="mt-4 text-muted-foreground text-sm">Watch how Priisme works</p>
            </div>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            alt="Video thumbnail"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-2.5 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}