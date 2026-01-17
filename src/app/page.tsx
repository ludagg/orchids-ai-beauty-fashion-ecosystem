"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, ChevronRight } from "lucide-react";

const navItems = ["Features", "AI", "Marketplace", "Salons"];

const features = [
  {
    title: "Fashion Marketplace",
    description: "Curated collections from India's finest designers. Shop with confidence.",
  },
  {
    title: "Salon Booking",
    description: "Book verified beauty services instantly. Real reviews, real results.",
  },
  {
    title: "Video Commerce",
    description: "Shop from live streams and videos. See it, love it, own it.",
  },
  {
    title: "AI Stylist",
    description: "Your personal style advisor. Intelligent recommendations, perfect fits.",
  },
];

const capabilities = [
  { metric: "60%", label: "Fewer Returns", detail: "Virtual fit technology" },
  { metric: "500+", label: "Verified Salons", detail: "Trusted partners" },
  { metric: "2M+", label: "Styles", detail: "AI-curated catalog" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
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

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-black/10">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-2xl shadow-sm" : ""
        }`}
      >
        <div className="max-w-[980px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold tracking-tight"
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
                  className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </nav>

      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center pt-14 overflow-hidden"
      >
        <div className="relative z-10 max-w-[980px] mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#6b6b6b] text-sm tracking-wide mb-4"
          >
            India&apos;s First AI-Powered Beauty & Fashion Ecosystem
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[56px] md:text-[80px] lg:text-[96px] font-semibold leading-[1.05] tracking-tight mb-2"
          >
            Priisme
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[28px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-tight text-gradient-color mb-1"
          >
            Where Fashion Meets Intelligence.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[17px] md:text-[21px] text-[#6b6b6b] max-w-[600px] mx-auto mt-4 leading-relaxed"
          >
            Shop fashion. Book salons. Watch shoppable videos.
            All powered by AI, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[17px] text-[#1a1a1a] font-medium hover:opacity-70 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[17px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Watch the film
              <Play className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative w-full max-w-[1200px] mx-auto mt-16 px-6"
        >
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-black/10">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=675&fit=crop"
              alt="Fashion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-lg">
                  <Play className="w-5 h-5 text-[#1a1a1a] ml-0.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Watch the Priisme Story</p>
                  <p className="text-xs text-white/70">2 min</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section id="features" className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-[48px] md:text-[56px] font-semibold leading-tight tracking-tight">
              One ecosystem.
              <br />
              <span className="text-[#6b6b6b]">Endless possibilities.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setActiveFeature(i)}
                className={`group relative p-8 rounded-2xl transition-all duration-500 cursor-pointer border ${
                  activeFeature === i
                    ? "bg-[#fafafa] border-[#e5e5e5]"
                    : "bg-transparent border-transparent hover:bg-[#fafafa]/50 hover:border-[#e5e5e5]/50"
                }`}
              >
                <h3 className="text-[24px] font-semibold mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-6">
                  {feature.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[#1a1a1a] text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  Learn more
                  <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="py-32 bg-[#fafafa]">
        <div className="max-w-[980px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-6"
          >
            <p className="text-[#6b6b6b] text-sm tracking-wide uppercase mb-4">
              Artificial Intelligence
            </p>
            <h2 className="text-[48px] md:text-[56px] font-semibold leading-tight tracking-tight">
              Your personal
              <br />
              <span className="text-gradient-color">AI stylist.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#6b6b6b] text-[17px] md:text-[21px] text-center max-w-[600px] mx-auto mb-20 leading-relaxed"
          >
            Advanced machine learning that understands your style,
            body type, and preferences to deliver truly personalized recommendations.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-[64px] md:text-[80px] font-semibold tracking-tight leading-none">
                  {cap.metric}
                </p>
                <p className="text-[17px] font-medium mt-2">{cap.label}</p>
                <p className="text-[#6b6b6b] text-sm mt-1">{cap.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#6b6b6b] text-sm tracking-wide uppercase mb-4">
                Marketplace
              </p>
              <h2 className="text-[40px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6">
                Shop with
                <br />
                <span className="text-[#6b6b6b]">confidence.</span>
              </h2>
              <p className="text-[#6b6b6b] text-[17px] leading-relaxed mb-8 max-w-[440px]">
                Curated fashion from verified sellers. Secure payments.
                Easy returns. Virtual try-on powered by AI.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[17px] text-[#1a1a1a] font-medium hover:opacity-70 transition-opacity"
              >
                Explore the marketplace
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=500&fit=crop",
                  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop",
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl overflow-hidden shadow-xl shadow-black/10 ${i === 1 ? "mt-8" : ""}`}
                  >
                    <img
                      src={src}
                      alt="Fashion"
                      className="w-full h-[280px] object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="salons" className="py-32 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl overflow-hidden bg-white shadow-xl shadow-black/10">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop"
                  alt="Salon"
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">Luxe Beauty Lounge</p>
                      <p className="text-[#6b6b6b] text-sm">Koramangala, Bangalore</p>
                    </div>
                    <div className="text-sm text-[#6b6b6b]">
                      <span className="text-[#1a1a1a]">4.9</span> ★
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-[#1a1a1a] text-white font-medium text-sm hover:bg-[#333] transition-colors">
                    Book Now
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
              <p className="text-[#6b6b6b] text-sm tracking-wide uppercase mb-4">
                Salon Booking
              </p>
              <h2 className="text-[40px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6">
                Beauty services,
                <br />
                <span className="text-[#6b6b6b]">verified.</span>
              </h2>
              <p className="text-[#6b6b6b] text-[17px] leading-relaxed mb-8 max-w-[440px]">
                Book appointments at India&apos;s top salons. Real reviews.
                Real-time availability. Secure, hassle-free payments.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[17px] text-[#1a1a1a] font-medium hover:opacity-70 transition-opacity"
              >
                Find salons near you
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-[48px] md:text-[64px] lg:text-[80px] font-semibold leading-tight tracking-tight mb-4">
              The future of
              <br />
              <span className="text-gradient-color">beauty & fashion.</span>
            </h2>
            <p className="text-[#6b6b6b] text-[17px] md:text-[21px] max-w-[600px] mx-auto mb-10 leading-relaxed">
              Join thousands who&apos;ve already discovered a smarter way
              to shop, book, and style.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-8 py-4 rounded-full bg-[#1a1a1a] text-white font-medium text-[17px] hover:bg-[#333] transition-colors">
                Download App
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[17px] text-[#1a1a1a] font-medium hover:opacity-70 transition-opacity"
              >
                For Business
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { title: "Platform", links: ["Marketplace", "Salons", "Video", "AI Stylist"] },
              { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help", "Contact", "Privacy", "Terms"] },
              { title: "Connect", links: ["Instagram", "Twitter", "LinkedIn", "YouTube"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs text-[#6b6b6b] font-medium mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-[#e5e5e5]">
            <p className="text-xs text-[#6b6b6b]">
              Copyright © 2024 Priisme. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
