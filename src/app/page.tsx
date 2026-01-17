"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
  CheckCircle2
} from "lucide-react";

const navItems = ["Features", "AI", "Marketplace", "Salons"];

const features = [
  {
    title: "Fashion Marketplace",
    description: "Curated collections from India's finest designers. Shop with confidence.",
    icon: ShoppingBag,
    color: "#e11d48",
  },
  {
    title: "Salon Booking",
    description: "Book verified beauty services instantly. Real reviews, real results.",
    icon: Scissors,
    color: "#9333ea",
  },
  {
    title: "Video Commerce",
    description: "Shop from live streams and videos. See it, love it, own it.",
    icon: Video,
    color: "#2563eb",
  },
  {
    title: "AI Stylist",
    description: "Your personal style advisor. Intelligent recommendations, perfect fits.",
    icon: Sparkles,
    color: "#059669",
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

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-black/10">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/90 backdrop-blur-2xl shadow-sm" : ""
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
                  className="relative text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors py-2 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a1a1a] transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:block text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:block px-4 py-2 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-all hover:shadow-lg hover:shadow-black/20 active:scale-95"
              >
                Get Started
              </motion.button>
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
            className="fixed inset-0 z-[100] bg-white"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-[#e5e5e5]">
                <span className="text-xl font-semibold font-display">Priisme</span>
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
                        className="flex items-center justify-between py-4 text-2xl font-medium border-b border-[#e5e5e5] hover:text-[#6b6b6b] transition-colors"
                      >
                        {item}
                        <ChevronRight className="w-5 h-5 text-[#6b6b6b]" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 py-8 border-t border-[#e5e5e5] space-y-3">
                <button className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-colors">
                  Get Started
                </button>
                <button className="w-full py-4 rounded-2xl border border-[#e5e5e5] font-medium hover:bg-[#fafafa] transition-colors">
                  Sign In
                </button>
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
        <div className="relative z-10 max-w-[980px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e5e5e5] shadow-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-[#6b6b6b]">
              India&apos;s First AI-Powered Beauty & Fashion Ecosystem
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
            className="text-[17px] md:text-[21px] text-[#6b6b6b] max-w-[540px] mx-auto mt-6 leading-relaxed"
          >
            Shop fashion. Book salons. Watch shoppable videos.
            All powered by AI, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1a1a1a] text-white font-medium text-[17px] hover:bg-[#333] transition-all hover:shadow-xl hover:shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-2 group">
              Start Shopping
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-[#e5e5e5] font-medium text-[17px] hover:bg-[#fafafa] transition-all hover:border-[#d4d4d4] active:scale-[0.98] flex items-center justify-center gap-2 group">
              <Play className="w-5 h-5 text-[#6b6b6b] group-hover:text-[#1a1a1a] transition-colors" />
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
              <div key={badge} className="flex items-center gap-2 text-sm text-[#6b6b6b]">
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
          className="relative w-full max-w-[1100px] mx-auto mt-16 px-6"
        >
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-black/10 group">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=675&fit=crop"
              alt="Fashion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
              <div className="flex items-center gap-4">
                <button className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-lg hover:scale-110 active:scale-95">
                  <Play className="w-6 h-6 text-[#1a1a1a] ml-0.5" />
                </button>
                <div>
                  <p className="text-sm font-medium text-white">Watch the Priisme Story</p>
                  <p className="text-xs text-white/70">2 min · Behind the scenes</p>
                </div>
              </div>
            </div>
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
            className="w-6 h-10 rounded-full border-2 border-[#d4d4d4] flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-2.5 rounded-full bg-[#6b6b6b]" />
          </motion.div>
        </motion.div>
      </motion.section>

      <section id="features" className="py-24 md:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#f5f5f5] text-sm text-[#6b6b6b] font-medium mb-6">
              Platform
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              One ecosystem.
              <br />
              <span className="text-[#6b6b6b] italic">Endless possibilities.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setActiveFeature(i)}
                  className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 cursor-pointer border ${
                    activeFeature === i
                      ? "bg-[#fafafa] border-[#e5e5e5] shadow-lg shadow-black/5"
                      : "bg-transparent border-transparent hover:bg-[#fafafa]/50 hover:border-[#e5e5e5]/50"
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}10` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-[20px] md:text-[24px] font-semibold mb-2 tracking-tight font-display">
                    {feature.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-5">
                    {feature.description}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-[#1a1a1a] text-sm font-medium group/link"
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                  
                  <div 
                    className={`absolute bottom-0 left-6 right-6 h-1 rounded-full transition-all duration-500 ${
                      activeFeature === i ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ backgroundColor: feature.color }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ai" className="py-24 md:py-32 bg-[#fafafa] overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#e5e5e5] text-sm text-[#6b6b6b] font-medium mb-6">
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
            className="text-[#6b6b6b] text-[17px] md:text-[21px] text-center max-w-[560px] mx-auto mb-16 md:mb-20 leading-relaxed"
          >
            Advanced machine learning that understands your style,
            body type, and preferences.
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-white border border-[#e5e5e5] hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-[48px] sm:text-[56px] md:text-[72px] font-semibold tracking-tight leading-none text-gradient-color">
                  {cap.metric}
                </p>
                <p className="text-[17px] font-semibold mt-3">{cap.label}</p>
                <p className="text-[#6b6b6b] text-sm mt-1">{cap.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="py-24 md:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#f5f5f5] text-sm text-[#6b6b6b] font-medium mb-6">
                Marketplace
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
                Shop with
                <br />
                <span className="text-[#6b6b6b] italic">confidence.</span>
              </h2>
              <p className="text-[#6b6b6b] text-[17px] leading-relaxed mb-8 max-w-[440px]">
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
              
              <button className="px-6 py-3 rounded-full bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-all hover:shadow-lg hover:shadow-black/20 active:scale-[0.98] inline-flex items-center gap-2 group">
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
                    className={`group rounded-2xl overflow-hidden shadow-xl shadow-black/10 bg-white ${i === 1 ? "mt-8" : ""}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.src}
                        alt="Fashion"
                        className="w-full h-[240px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button className="absolute bottom-4 left-4 right-4 py-3 rounded-xl bg-white font-medium text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#fafafa]">
                        Quick View
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold">{item.price}</p>
                      <p className="text-sm text-[#6b6b6b]">Designer Collection</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="salons" className="py-24 md:py-32 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-black/10 hover:shadow-2xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop"
                    alt="Salon"
                    className="w-full h-[260px] sm:h-[300px] object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Open Now
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">Luxe Beauty Lounge</p>
                      <p className="text-[#6b6b6b] text-sm">Koramangala, Bangalore</p>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fafafa]">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-5">
                    {["Haircut", "Color", "Spa"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-[#f5f5f5] text-xs text-[#6b6b6b]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3.5 rounded-2xl bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-all active:scale-[0.98]">
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#e5e5e5] text-sm text-[#6b6b6b] font-medium mb-6">
                Salon Booking
              </span>
              <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
                Beauty services,
                <br />
                <span className="text-[#6b6b6b] italic">verified.</span>
              </h2>
              <p className="text-[#6b6b6b] text-[17px] leading-relaxed mb-8 max-w-[440px]">
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
              
              <button className="px-6 py-3 rounded-full bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-all hover:shadow-lg hover:shadow-black/20 active:scale-[0.98] inline-flex items-center gap-2 group">
                Find Salons Near You
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f5f5f5_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
        <div className="max-w-[980px] mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] font-semibold leading-tight tracking-tight mb-4 font-display">
              The future of
              <br />
              <span className="text-gradient-color italic">beauty & fashion.</span>
            </h2>
            <p className="text-[#6b6b6b] text-[17px] md:text-[21px] max-w-[540px] mx-auto mb-10 leading-relaxed">
              Join thousands who&apos;ve already discovered a smarter way
              to shop, book, and style.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1a1a1a] text-white font-medium text-[17px] hover:bg-[#333] transition-all hover:shadow-xl hover:shadow-black/20 active:scale-[0.98]">
                Download App
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-[#e5e5e5] font-medium text-[17px] hover:bg-[#fafafa] transition-all hover:border-[#d4d4d4] active:scale-[0.98] inline-flex items-center justify-center gap-2">
                For Business
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-16 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl font-semibold mb-4 font-display">Priisme</p>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
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
                        className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-[#e5e5e5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6b6b6b]">
              © 2024 Priisme. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Privacy</a>
              <a href="#" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Terms</a>
              <a href="#" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
