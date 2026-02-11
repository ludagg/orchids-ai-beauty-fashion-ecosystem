"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Play,
  ChevronRight,
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  Menu,
  X,
  Star,
  CheckCircle2,
  Scan,
  Palette,
  TrendingUp,
  Shield,
  Zap,
  Heart
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "next-themes";

const navItems = ["Features", "AI", "Marketplace", "Salons", "Testimonials"];

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

const capabilities = [
  { metric: "60%", label: "Fewer Returns", detail: "Virtual fit technology" },
  { metric: "500+", label: "Verified Salons", detail: "Trusted partners" },
  { metric: "2M+", label: "Styles", detail: "AI-curated catalog" },
];

const trustBadges = [
  "Secure Payments",
  "Easy Returns",
  "Verified Sellers",
];

const partners = [
  { name: "Nike", logo: "/partners/nike.svg" },
  { name: "Adidas", logo: "/partners/adidas.svg" },
  { name: "Zara", logo: "/partners/zara.svg" },
  { name: "H&M", logo: "/partners/hm.svg" },
  { name: "Gucci", logo: "/partners/gucci.svg" },
  { name: "Louis Vuitton", logo: "/partners/lv.svg" },
];

const bentoItems = [
  {
    title: "Virtual Try-On",
    description: "See how clothes look on you before buying",
    icon: Scan,
    size: "large",
    gradient: "from-rose-500/10 to-orange-500/10",
    iconColor: "#e11d48",
  },
  {
    title: "Style DNA",
    description: "AI learns your unique preferences",
    icon: Palette,
    size: "small",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "#9333ea",
  },
  {
    title: "Trend Forecast",
    description: "Stay ahead of fashion curves",
    icon: TrendingUp,
    size: "small",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "#2563eb",
  },
  {
    title: "Smart Sizing",
    description: "Perfect fit recommendations using body measurements",
    icon: Zap,
    size: "medium",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "#059669",
  },
  {
    title: "Wishlist Sync",
    description: "Price alerts & availability tracking",
    icon: Heart,
    size: "small",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "#ec4899",
  },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Fashion Blogger",
    content: "Priisme has completely changed how I discover new designers. The AI Stylist is surprisingly accurate and helps me find pieces I wouldn't have considered before.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    name: "Rahul Mehra",
    role: "Verified Buyer",
    content: "The virtual try-on feature is a game changer. I've bought three outfits so far and they all fit perfectly. No more returns because of wrong sizing!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Salon Regular",
    content: "Booking my favorite salon has never been easier. Love the real-time availability and the fact that I can see verified reviews before booking.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5
  }
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-card/90 backdrop-blur-2xl shadow-sm" : ""
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold tracking-tight font-display"
            >
              Priisme
            </motion.a>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative text-sm text-muted-foreground hover:text-foreground transition-colors py-2 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Link href="/auth">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden sm:block px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  Sign In
                </motion.button>
              </Link>
              <button
                className="md:hidden p-2 -mr-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-semibold font-display">Priisme</span>
                  <ThemeSwitcher />
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <a
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-4 text-2xl font-medium border-b border-border hover:text-muted-foreground transition-colors"
                      >
                        {item}
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 py-8 border-t border-border space-y-3">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="text-[44px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-semibold leading-[1.05] tracking-tight font-display"
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
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=675&fit=crop')] bg-cover bg-center opacity-30" />
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
                          <img 
                            src={feature.image} 
                            alt={feature.title}
                            className="w-full h-full object-cover"
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
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card text-foreground text-sm font-medium hover:opacity-90 transition-colors group/btn"
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

      <section id="ai" className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
              Artificial Intelligence
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Your personal
              <br />
              <span className="text-gradient-color italic">AI stylist.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-[17px] md:text-[21px] text-center max-w-[560px] mx-auto mb-16 md:mb-20 leading-relaxed"
          >
            Advanced machine learning that understands your style,
            body type, and preferences.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[140px] md:auto-rows-[180px]">
            {bentoItems.map((item, i) => {
              const Icon = item.icon;
              const sizeClasses = {
                large: "col-span-2 row-span-2",
                medium: "col-span-2 row-span-1",
                small: "col-span-1 row-span-1",
              };
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${sizeClasses[item.size as keyof typeof sizeClasses]} relative group p-6 rounded-3xl bg-card border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10 h-full flex flex-col">
                    <div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-auto"
                      style={{ backgroundColor: `${item.iconColor}10` }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: item.iconColor }} />
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-[15px] md:text-[17px] font-semibold mb-1 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-3 gap-6 md:gap-8 mt-16">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-card border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-[48px] sm:text-[56px] md:text-[72px] font-semibold tracking-tight leading-none text-gradient-color">
                  {cap.metric}
                </p>
                <p className="text-[17px] font-semibold mt-3 text-foreground">{cap.label}</p>
                <p className="text-muted-foreground text-sm mt-1">{cap.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="py-24 md:py-32 bg-card">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
                Marketplace
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
                Shop with
                <br />
                <span className="text-muted-foreground italic">confidence.</span>
              </h2>
              <p className="text-muted-foreground text-[17px] leading-relaxed mb-8 max-w-[440px]">
                Curated fashion from verified sellers. Secure payments.
                Easy returns. Virtual try-on powered by AI.
              </p>
              
              <ul className="space-y-3 mb-8">
                {["AI-powered size recommendations", "Virtual try-on technology", "Verified authentic products"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
                Explore Marketplace
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=500&fit=crop", price: "₹2,499" },
                  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop", price: "₹3,299" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`group rounded-2xl overflow-hidden shadow-xl shadow-foreground/10 bg-card ${i === 1 ? "mt-8" : ""}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.src}
                        alt="Fashion"
                        className="w-full h-[240px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button className="absolute bottom-4 left-4 right-4 py-3 rounded-xl bg-card text-foreground font-medium text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-secondary">
                        Quick View
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-foreground">{item.price}</p>
                      <p className="text-sm text-muted-foreground">Designer Collection</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="salons" className="py-24 md:py-32 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden bg-card shadow-xl shadow-foreground/10 hover:shadow-2xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop"
                    alt="Salon"
                    className="w-full h-[260px] sm:h-[300px] object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur text-xs font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Open Now
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg text-foreground">Luxe Beauty Lounge</p>
                      <p className="text-muted-foreground text-sm">Koramangala, Bangalore</p>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-5">
                    {["Haircut", "Color", "Spa"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all active:scale-[0.98]">
                    Book Appointment
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
                Salon Booking
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
                Beauty services,
                <br />
                <span className="text-muted-foreground italic">verified.</span>
              </h2>
              <p className="text-muted-foreground text-[17px] leading-relaxed mb-8 max-w-[440px]">
                Book appointments at India&apos;s top salons. Real reviews.
                Real-time availability. Secure, hassle-free payments.
              </p>
              
              <ul className="space-y-3 mb-8">
                {["Real-time slot availability", "Verified customer reviews", "Easy cancellation policy"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
                Find Salons Near You
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 md:py-32 bg-card">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
              Testimonials
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Loved by fashion
              <br />
              <span className="text-muted-foreground italic">enthusiasts.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-background border border-border relative group hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground text-lg leading-relaxed mb-8">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--secondary)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
        <div className="max-w-[980px] mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] font-semibold leading-tight tracking-tight mb-4 font-display">
              Join the
              <br />
              <span className="text-gradient-color italic">future of fashion.</span>
            </h2>
            <p className="text-muted-foreground text-[17px] md:text-[21px] max-w-[540px] mx-auto mb-10 leading-relaxed">
              Be the first to experience India&apos;s most intelligent fashion ecosystem.
              Start your journey today.
            </p>
            
            <div className="max-w-[480px] mx-auto">
              <Link href="/app" className="group">
                <button
                  className="w-full h-14 rounded-full bg-primary text-primary-foreground font-medium text-[17px] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
        </section>

      <section className="py-16 md:py-20 bg-background border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mb-10"
          >
            Trusted by leading brands worldwide
          </motion.p>

          <div className="flex gap-12 md:gap-20 items-center justify-center flex-wrap">
            {[
              { name: "Nike", svg: <svg viewBox="0 0 100 35" className="w-20 h-8"><path fill="currentColor" d="M21.7 3.1c-8.8 4.3-17.6 8.8-26 13.4-1.4.8-2.1 1.5-2.1 2.3 0 .5.3.9.8 1.3.5.4 1.1.6 1.8.6.5 0 2.2-.5 5.1-1.5 2.9-1 6.4-2.3 10.5-3.8 4.1-1.5 7.1-2.6 9-3.3l5.7-2.1c1.8-.7 3.2-1.2 4.2-1.5 1-.3 1.8-.5 2.4-.5.4 0 .6.1.7.2.1.1.2.3.2.5 0 .3-.1.6-.2.9-.1.3-.4.7-.7 1.2l-4.5 6.6-8.2 12.1c-.8 1.2-1.2 2.1-1.2 2.6 0 .4.2.7.5.9.3.2.7.3 1.2.3.4 0 .8-.1 1.2-.2.4-.1.9-.4 1.4-.7 2.9-1.8 5.8-3.7 8.7-5.6l6.4-4.3c1.5-1 2.9-1.9 4.2-2.9 1.3-1 2.5-1.9 3.6-2.9 1.1-1 2-1.9 2.7-2.7.7-.8 1.3-1.7 1.7-2.5.4-.8.6-1.7.6-2.5 0-.9-.2-1.6-.7-2.3-.5-.7-1.1-1.2-1.9-1.6-.8-.4-1.7-.7-2.6-.9-.9-.2-1.9-.3-2.8-.3-1.2 0-2.6.2-4.2.5-1.6.3-3.3.8-5.1 1.5-1.8.7-3.8 1.4-5.8 2.3-2 .9-4.3 1.9-6.8 3z"/></svg> },
              { name: "Adidas", svg: <svg viewBox="0 0 100 65" className="w-16 h-10"><path fill="currentColor" d="M0 65l16.7-28.9 16.7 28.9H0zm19.4-33.5L36.1 3.4 52.8 32l-16.7 28.9-16.7-28.4zm36.1 0L72.2 3.4 88.9 32 72.2 60.9 55.5 32.5v-.5l-.1.5zm0-28.1L72.2 0l16.7 3.4L72.2 32 55.5 3.4z"/></svg> },
              { name: "H&M", svg: <svg viewBox="0 0 100 50" className="w-14 h-8"><text x="50" y="38" textAnchor="middle" fontSize="36" fontWeight="bold" fill="currentColor">H&amp;M</text></svg> },
              { name: "Zara", svg: <svg viewBox="0 0 100 30" className="w-16 h-6"><text x="50" y="24" textAnchor="middle" fontSize="28" fontWeight="400" letterSpacing="4" fill="currentColor" style={{fontFamily: "serif"}}>ZARA</text></svg> },
              { name: "Gucci", svg: <svg viewBox="0 0 100 35" className="w-16 h-8"><text x="50" y="28" textAnchor="middle" fontSize="24" fontWeight="400" letterSpacing="6" fill="currentColor" style={{fontFamily: "serif"}}>GUCCI</text></svg> },
              { name: "Dior", svg: <svg viewBox="0 0 100 30" className="w-14 h-6"><text x="50" y="24" textAnchor="middle" fontSize="26" fontWeight="400" letterSpacing="8" fill="currentColor" style={{fontFamily: "serif"}}>DIOR</text></svg> },
            ].map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-muted-foreground/50 hover:text-muted-foreground transition-all duration-300 cursor-pointer"
              >
                {brand.svg}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 bg-background border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl font-semibold mb-4 font-display text-foreground">Priisme</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&apos;s first AI-powered beauty & fashion ecosystem.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Marketplace", "Salons", "Video", "AI Stylist"] },
              { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help", "Contact", "Privacy", "Terms"] },
              { title: "Connect", links: ["Instagram", "Twitter", "LinkedIn", "YouTube"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Priisme. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
