"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden"
    >
      {/* Background Decorations - Subtle & Premium */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.4]" />

        {/* Animated Blobs - Slower, more subtle */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-500/[0.03] blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] bg-rose-500/[0.03] blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 backdrop-blur-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-secondary-foreground tracking-wide uppercase">
            The Future of Beauty & Fashion
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold leading-[0.95] tracking-tight text-primary font-display mb-6"
        >
          Where Fashion
          <br />
          <span className="text-muted-foreground italic font-light">Meets Intelligence.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Experience an AI-powered ecosystem that understands your style.
          Curated marketplace, verified salons, and virtual styling in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-12"
        >
          <Link href="/app" className="w-full sm:w-auto flex-1">
            <button
              className="w-full h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium text-base hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-background border border-input font-medium text-base hover:bg-accent transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
            <Play className="w-4 h-4 fill-foreground text-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
            Watch Demo
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {["Secure Payments", "Easy Returns", "Verified Sellers"].map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground/80 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500/80" />
              {badge}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hero Image / Video Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: springX, y: springY }}
        className="relative w-full max-w-6xl mx-auto mt-16 px-6 lg:px-8"
      >
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted border border-border shadow-2xl shadow-foreground/5">
            <div className="absolute inset-0 bg-neutral-900/10 z-10" />
            <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop&q=80"
                alt="Fashion Platform"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white ml-1 opacity-90 group-hover:opacity-100" />
                </button>
            </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
