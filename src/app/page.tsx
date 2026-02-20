"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  ArrowRight,
  Play,
  ChevronRight,
  ShoppingBag,
  Scissors,
  Video,
  Sparkles,
  Star,
  CheckCircle2,
  Scan,
  Palette,
  TrendingUp,
  Zap,
  Heart,
  Search,
  Calendar,
  Users,
  Store,
  Smartphone,
  MapPin,
  BookOpen,
  Mail,
  Navigation,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    content: "Rare has completely changed how I discover new designers. The AI Stylist is surprisingly accurate and helps me find pieces I wouldn't have considered before.",
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


const howItWorksSteps = [
  {
    step: "01",
    title: "Discover",
    description: "Browse AI-curated fashion and beauty services tailored to your taste.",
    icon: Search,
    color: "#e11d48",
    gradient: "from-rose-500/10 to-pink-500/10",
  },
  {
    step: "02",
    title: "Try On",
    description: "Use our virtual try-on to see exactly how every piece looks on you.",
    icon: Sparkles,
    color: "#9333ea",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    step: "03",
    title: "Book & Shop",
    description: "Seamlessly book salon appointments or add fashion pieces to your cart.",
    icon: Calendar,
    color: "#2563eb",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    step: "04",
    title: "Love It",
    description: "Enjoy your new look with hassle-free delivery and easy returns.",
    icon: Heart,
    color: "#059669",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
];

const animatedStats = [
  { value: 50, suffix: "K+", label: "Happy Users", color: "#e11d48" },
  { value: 500, suffix: "+", label: "Verified Salons", color: "#9333ea" },
  { value: 10, suffix: "K+", label: "Products", color: "#2563eb" },
  { value: 4.9, suffix: "★", label: "Avg. Rating", color: "#059669", decimals: 1 },
];

const liveStreams = [
  {
    title: "Summer Collection 2025",
    creator: "@style.by.neha",
    viewers: "2.4K",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=700&fit=crop",
    isLive: true,
    tag: "Fashion",
  },
  {
    title: "Bridal Makeup Tutorial",
    creator: "@beautywithananya",
    viewers: "1.8K",
    thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=700&fit=crop",
    isLive: true,
    tag: "Beauty",
  },
  {
    title: "Monsoon Edit",
    creator: "@rareofficial",
    viewers: "980",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop",
    isLive: false,
    tag: "Trending",
  },
  {
    title: "Saree Draping Masterclass",
    creator: "@ethnicbytara",
    viewers: "3.1K",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=700&fit=crop",
    isLive: true,
    tag: "Ethnic",
  },
];

const faqItems = [
  {
    question: "How does the AI Stylist work?",
    answer: "Our AI Stylist analyses your body measurements, style preferences, and purchase history to recommend outfits and beauty services that are uniquely tailored to you. The more you interact, the smarter it gets.",
  },
  {
    question: "Is the virtual try-on accurate?",
    answer: "Yes. Our virtual try-on uses advanced AR and body-mapping technology to give you a realistic preview. Users report over 60% fewer returns when they use try-on before purchasing.",
  },
  {
    question: "How are salons verified on Rare?",
    answer: "Every salon partner goes through a thorough onboarding process including license verification, hygiene inspections, and customer review validation before they are listed on the platform.",
  },
  {
    question: "Can I watch live shopping streams and buy directly?",
    answer: "Absolutely. With Video Commerce Live, you can watch creator and brand streams, tap on featured products, and check out without ever leaving the stream.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support all major UPI apps, credit/debit cards, net banking, and popular buy-now-pay-later services. All transactions are end-to-end encrypted.",
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes! The Rare app is available on both iOS and Android. You can download it from the App Store or Google Play Store for the best experience.",
  },
];

const partnerCards = [
  {
    type: "Salon & Brand Partners",
    headline: "Grow your business with Rare",
    description: "Join 500+ verified salons and fashion brands already reaching millions of style-conscious customers across India.",
    cta: "Partner with Us",
    icon: Store,
    color: "#e11d48",
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent",
    border: "border-rose-500/20",
    perks: ["Zero setup fees", "Smart booking management", "Analytics dashboard"],
  },
  {
    type: "Content Creators",
    headline: "Turn your passion into income",
    description: "Monetise your style content through live commerce, affiliate collections, and brand collaborations on a platform built for creators.",
    cta: "Become a Creator",
    icon: Video,
    color: "#9333ea",
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    border: "border-violet-500/20",
    perks: ["Revenue share on every sale", "Creator analytics", "Brand deal access"],
  },
];

const blogPosts = [
  {
    category: "Style Guide",
    title: "10 Ways to Style a Saree for a Modern Look",
    excerpt: "Reimagine India's most iconic garment with contemporary draping techniques and accessories.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop",
    date: "May 12, 2025",
    readTime: "5 min read",
  },
  {
    category: "Beauty",
    title: "The Monsoon Skincare Routine You Actually Need",
    excerpt: "Dermatologist-backed tips to keep your skin balanced and glowing through India's rainy season.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
    date: "May 8, 2025",
    readTime: "4 min read",
  },
  {
    category: "AI & Fashion",
    title: "How AI Is Rewriting the Rules of Personal Style",
    excerpt: "A deep dive into the technology powering the next generation of style recommendations.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop",
    date: "May 2, 2025",
    readTime: "7 min read",
  },
];

const nearbySalons = [
  {
    name: "Luxe Beauty Lounge",
    area: "Koramangala, Bangalore",
    distance: "0.8 km",
    rating: 4.9,
    tags: ["Haircut", "Color", "Spa"],
    open: true,
  },
  {
    name: "Glow Studio",
    area: "Indiranagar, Bangalore",
    distance: "1.4 km",
    rating: 4.7,
    tags: ["Facial", "Waxing", "Bridal"],
    open: true,
  },
  {
    name: "The Style Lab",
    area: "HSR Layout, Bangalore",
    distance: "2.1 km",
    rating: 4.8,
    tags: ["Haircut", "Highlights"],
    open: false,
  },
];

function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
  color,
}: {
  value: number;
  suffix: string;
  decimals?: number;
  color: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      setDisplay(v.toFixed(decimals));
    });
  }, [spring, decimals]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <span ref={ref} style={{ color }}>
      {display}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <LandingNavbar />

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
                <p className="mt-4 text-muted-foreground text-sm">Watch how Rare works</p>
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


      {/* ── 1. HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
              How It Works
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Four steps to your
              <br />
              <span className="text-gradient-color italic">perfect look.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative group p-8 rounded-3xl bg-card border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  {i < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <span className="text-[11px] font-semibold tracking-widest text-muted-foreground/50 uppercase mb-4 block">
                      Step {step.step}
                    </span>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground font-display">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. ANIMATED STATS ── */}
      <section className="py-24 md:py-32 bg-card overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
              By the Numbers
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Real impact,
              <br />
              <span className="text-muted-foreground italic">measurable results.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {animatedStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-background border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-[52px] sm:text-[60px] font-semibold tracking-tight leading-none mb-3">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                    color={stat.color}
                  />
                </p>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. VIDEO COMMERCE LIVE ── */}
      <section id="live" className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
              Video Commerce
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Shop live,
              <br />
              <span className="text-gradient-color italic">buy instantly.</span>
            </h2>
            <p className="text-muted-foreground text-[17px] md:text-[21px] max-w-[520px] mx-auto mt-6 leading-relaxed">
              Watch style creators and brands go live. Tap any product on screen and check out without missing a moment.
            </p>
          </motion.div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6">
            {liveStreams.map((stream, i) => (
              <motion.div
                key={stream.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex-shrink-0 w-[220px] sm:w-[260px] rounded-3xl overflow-hidden bg-card border border-border cursor-pointer snap-start hover:shadow-2xl hover:shadow-foreground/10 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {stream.isLive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium">
                        {stream.tag}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur">
                    <Users className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">{stream.viewers}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm leading-tight mb-1">{stream.title}</p>
                    <p className="text-white/70 text-xs">{stream.creator}</p>
                    <button className="mt-3 w-full py-2 rounded-xl bg-white/20 backdrop-blur border border-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-1.5">
                      <Play className="w-3 h-3" />
                      {stream.isLive ? "Join Live" : "Watch Now"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button className="px-6 py-3 rounded-full bg-card border border-border font-medium text-[15px] hover:bg-secondary transition-all hover:border-muted-foreground/30 active:scale-[0.98] inline-flex items-center gap-2 group">
              View All Streams
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 4. SOCIAL PROOF ── */}
      <section className="py-24 md:py-32 bg-card overflow-hidden">
        <div className="max-w-[980px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
                ].map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt="User"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="w-12 h-12 rounded-full object-cover border-2 border-card"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold tracking-tight leading-tight font-display mb-4">
              Rated <span className="text-gradient-color">4.9 out of 5</span>
              <br />
              <span className="text-muted-foreground italic">by 12,000+ users.</span>
            </p>

            <p className="text-muted-foreground text-[17px] max-w-[440px] mx-auto mb-10 leading-relaxed">
              Join thousands of fashion lovers who have transformed their style with Rare.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "12,000+ Reviews", icon: Star, color: "#f59e0b" },
                { label: "500+ Salons", icon: Scissors, color: "#9333ea" },
                { label: "Secure Payments", icon: CheckCircle2, color: "#059669" },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border border-border text-sm font-medium"
                  >
                    <Icon className="w-4 h-4" style={{ color: badge.color }} />
                    {badge.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. PARTNERS & CREATORS ── */}
      <section id="partners" className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
              Partner with Rare
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Grow with
              <br />
              <span className="text-gradient-color italic">the ecosystem.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {partnerCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.type}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative p-8 md:p-10 rounded-3xl bg-card border ${card.border} overflow-hidden group hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500 hover:-translate-y-1`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60`} />
                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: card.color }} />
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 block">
                      {card.type}
                    </span>
                    <h3 className="text-[24px] sm:text-[28px] font-semibold leading-tight mb-4 font-display">
                      {card.headline}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mb-6 max-w-[380px]">
                      {card.description}
                    </p>
                    <ul className="space-y-2 mb-8">
                      {card.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2.5 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="px-6 py-3 rounded-full font-medium text-[15px] text-white hover:opacity-90 transition-all active:scale-[0.98] inline-flex items-center gap-2 group/btn"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. APP DOWNLOAD ── */}
      <section id="app" className="py-24 md:py-32 bg-card overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
                Mobile App
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
                Style in your
                <br />
                <span className="text-muted-foreground italic">pocket.</span>
              </h2>
              <p className="text-muted-foreground text-[17px] leading-relaxed mb-8 max-w-[440px]">
                Download the Rare app and get the full experience — AI try-on, live shopping, salon bookings — all from your phone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all active:scale-[0.98]">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-label="App Store">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80 leading-none mb-0.5">Download on the</p>
                    <p className="text-sm font-semibold leading-none">App Store</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition-all active:scale-[0.98]">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-label="Google Play">
                    <path d="M3.18 23.76c.35.2.76.19 1.14-.04l12.67-7.31-2.79-2.79-11.02 10.14zM.27 1.12C.1 1.42 0 1.79 0 2.24v19.53c0 .44.1.81.28 1.11l.06.06 10.95-10.95v-.26L.33 1.06l-.06.06zM20.67 10.28l-2.88-1.66-3.09 3.09 3.09 3.09 2.89-1.67c.82-.48.82-1.37-.01-1.85zM4.32.28L17 7.59l-2.79 2.79L3.19.24C3.57.01 3.97.03 4.32.28z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80 leading-none mb-0.5">Get it on</p>
                    <p className="text-sm font-semibold leading-none">Google Play</p>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border w-fit">
                <div className="w-16 h-16 bg-foreground rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-12 h-12" aria-label="QR Code">
                    <rect x="10" y="10" width="30" height="30" fill="white" rx="2"/>
                    <rect x="15" y="15" width="20" height="20" fill="#1a1a1a" rx="1"/>
                    <rect x="18" y="18" width="14" height="14" fill="white" rx="1"/>
                    <rect x="60" y="10" width="30" height="30" fill="white" rx="2"/>
                    <rect x="65" y="15" width="20" height="20" fill="#1a1a1a" rx="1"/>
                    <rect x="68" y="18" width="14" height="14" fill="white" rx="1"/>
                    <rect x="10" y="60" width="30" height="30" fill="white" rx="2"/>
                    <rect x="15" y="65" width="20" height="20" fill="#1a1a1a" rx="1"/>
                    <rect x="18" y="68" width="14" height="14" fill="white" rx="1"/>
                    <rect x="55" y="55" width="8" height="8" fill="white" rx="1"/>
                    <rect x="67" y="55" width="8" height="8" fill="white" rx="1"/>
                    <rect x="79" y="55" width="8" height="8" fill="white" rx="1"/>
                    <rect x="55" y="67" width="8" height="8" fill="white" rx="1"/>
                    <rect x="67" y="67" width="8" height="8" fill="white" rx="1"/>
                    <rect x="79" y="79" width="8" height="8" fill="white" rx="1"/>
                    <rect x="55" y="79" width="8" height="8" fill="white" rx="1"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Scan to download</p>
                  <p className="text-xs text-muted-foreground">Available on iOS &amp; Android</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-[280px] sm:w-[320px]">
                <div className="relative rounded-[3rem] bg-foreground p-3 shadow-2xl shadow-foreground/20">
                  <div className="rounded-[2.5rem] overflow-hidden aspect-[9/19.5] bg-card border-2 border-border/20">
                    <img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=860&fit=crop"
                      alt="Rare app"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-foreground rounded-full z-10" />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-1/4 p-3 rounded-2xl bg-card border border-border shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold whitespace-nowrap">AI Try-On Active</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-8 bottom-1/4 p-3 rounded-2xl bg-card border border-border shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold whitespace-nowrap">4.9 Rating</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7. NEWSLETTER ── */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="relative rounded-3xl bg-card border border-border p-10 md:p-16 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/[0.06] blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/[0.06] blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
                  Stay in the Loop
                </span>
                <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-semibold leading-tight tracking-tight mb-4 font-display">
                  Style updates,
                  <br />
                  <span className="text-gradient-color italic">straight to you.</span>
                </h2>
                <p className="text-muted-foreground text-[17px] max-w-[420px] mx-auto mb-10 leading-relaxed">
                  Get exclusive trend reports, early access to new features, and curated style picks — weekly.
                </p>

                <AnimatePresence mode="wait">
                  {newsletterSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-center gap-3 py-4"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <p className="text-foreground font-medium text-lg">You&apos;re on the list!</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleNewsletterSubmit}
                      className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
                    >
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full h-14 pl-11 pr-4 rounded-full bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-medium text-[15px] hover:opacity-90 transition-all active:scale-[0.98] whitespace-nowrap"
                      >
                        Subscribe
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <p className="text-xs text-muted-foreground mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section id="faq" className="py-24 md:py-32 bg-card overflow-hidden">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
              FAQ
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Questions?
              <br />
              <span className="text-muted-foreground italic">We&apos;ve got answers.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-background border border-border overflow-hidden"
          >
            <Accordion type="single" collapsible className="divide-y divide-border">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-0">
                  <AccordionTrigger className="px-8 py-6 text-[16px] font-medium hover:no-underline text-foreground [&[data-state=open]]:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6 text-muted-foreground text-[15px] leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Still have questions?{" "}
            <a href="mailto:hello@rare.in" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              Contact our team
            </a>
          </motion.p>
        </div>
      </section>

      {/* ── 9. BLOG PREVIEW ── */}
      <section id="blog" className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
                Journal
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
                Style stories &amp;
                <br />
                <span className="text-gradient-color italic">beauty guides.</span>
              </h2>
            </div>
            <button className="px-6 py-3 rounded-full bg-card border border-border font-medium text-[15px] hover:bg-secondary transition-all hover:border-muted-foreground/30 active:scale-[0.98] inline-flex items-center gap-2 group self-start sm:self-auto whitespace-nowrap">
              View All Articles
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group rounded-3xl bg-card border border-border overflow-hidden hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-[17px] leading-snug mb-2 text-foreground font-display group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    <BookOpen className="w-4 h-4" />
                    Read more
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. LOCALISATION ── */}
      <section id="discover" className="py-24 md:py-32 bg-card overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
                Near You
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-4 font-display">
                Top salons
                <br />
                <span className="text-muted-foreground italic">in your city.</span>
              </h2>
              <p className="text-muted-foreground text-[17px] leading-relaxed mb-8 max-w-[440px]">
                Discover the best-rated salons and beauty studios near you. Book instantly, no calls needed.
              </p>

              <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-2xl bg-background border border-border w-fit">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Bangalore, Karnataka</span>
                <span className="text-xs text-muted-foreground ml-1">· Detected automatically</span>
              </div>

              <div className="space-y-4">
                {nearbySalons.map((salon, i) => (
                  <motion.div
                    key={salon.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-background border border-border hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:border-muted-foreground/20 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Scissors className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-foreground text-[15px] truncate">{salon.name}</p>
                        {salon.open ? (
                          <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Open
                          </span>
                        ) : (
                          <span className="flex-shrink-0 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Closed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{salon.area}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {salon.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold">{salon.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {salon.distance}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6"
              >
                <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-[15px] hover:opacity-90 transition-all active:scale-[0.98] inline-flex items-center gap-2 group">
                  Explore All Salons
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden bg-background border border-border h-[420px] lg:h-full min-h-[420px] relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground mt-1">Bangalore, Karnataka</p>
                  <div className="flex flex-col gap-2 mt-6">
                    {nearbySalons.map((salon) => (
                      <div key={salon.name} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-medium">{salon.name}</span>
                        <span className="text-muted-foreground text-xs">{salon.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
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

      <LandingFooter />
    </div>
  );
}
