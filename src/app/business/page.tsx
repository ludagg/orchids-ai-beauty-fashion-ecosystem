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
  BarChart3,
  Users,
  Store,
  Zap,
  CheckCircle2,
  TrendingUp,
  Globe,
  CalendarCheck,
  Star
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const businessFeatures = [
  {
    title: "Salon Management",
    description: "Streamline appointments, manage staff, and grow your client base effortlessly.",
    icon: Scissors,
    color: "#9333ea",
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop",
  },
  {
    title: "Retail Commerce",
    description: "Showcase your products to millions. AI-powered recommendations drive sales.",
    icon: ShoppingBag,
    color: "#e11d48",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
  },
  {
    title: "Smart Analytics",
    description: "Data-driven insights to optimize your pricing, inventory, and marketing.",
    icon: BarChart3,
    color: "#2563eb",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    title: "Global Reach",
    description: "Expand beyond your locality. Connect with customers worldwide.",
    icon: Globe,
    color: "#059669",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  },
];

const capabilities = [
  { metric: "40%", label: "Revenue Growth", detail: "Average in first 3 months" },
  { metric: "2M+", label: "Active Shoppers", detail: "Ready to discover you" },
  { metric: "24/7", label: "Business Support", detail: "Dedicated partner success" },
];

const trustBadges = [
  "Verified Partner Badge",
  "Secure Payments",
  "Zero Onboarding Fee",
];

const bentoItems = [
  {
    title: "Smart Booking",
    description: "Automated scheduling & reminders",
    icon: CalendarCheck,
    size: "large",
    gradient: "from-rose-500/10 to-orange-500/10",
    iconColor: "#e11d48",
  },
  {
    title: "Inventory Sync",
    description: "Real-time stock management",
    icon: Store,
    size: "small",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "#9333ea",
  },
  {
    title: "Customer CRM",
    description: "Build lasting relationships",
    icon: Users,
    size: "small",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "#2563eb",
  },
  {
    title: "Marketing Tools",
    description: "AI-driven campaigns that convert",
    icon: Zap,
    size: "medium",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "#059669",
  },
  {
    title: "Performance",
    description: "Track growth in real-time",
    icon: TrendingUp,
    size: "small",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "#ec4899",
  },
];

const testimonials = [
  {
    name: "Elena Rossi",
    role: "Salon Owner",
    content: "Since joining Rare, my bookings have doubled. The automated system saves me hours every week, letting me focus on my clients.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Boutique Manager",
    content: "The marketplace exposure is incredible. We're reaching customers we never could have found on our own. Sales are up 60%.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "Fashion Brand",
    content: "Rare's AI tools help us understand what our customers want before they even know it. It's like having a dedicated data team.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    rating: 5
  }
];

export default function BusinessLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
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
              For Salons, Boutiques, and Brands
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[44px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-semibold leading-[1.05] tracking-tight font-display"
          >
            Scale Your
            <br />
            <span className="text-gradient-color font-display italic">Business Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[17px] md:text-[21px] text-muted-foreground max-w-[540px] mx-auto mt-6 leading-relaxed"
          >
            The all-in-one platform for beauty and fashion businesses.
            Manage bookings, sell products, and grow your brand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full max-w-[600px] mx-auto"
          >
            <Link href="/business/register" className="flex-1 w-full group">
              <button
                className="w-full h-14 rounded-full bg-primary text-primary-foreground font-medium text-[17px] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/business/auth/login" className="w-full sm:w-auto">
                <button className="w-full h-14 px-8 rounded-full bg-card border border-border font-medium text-[17px] hover:bg-secondary transition-all hover:border-muted-foreground/30 active:scale-[0.98] flex items-center justify-center gap-2 group">
                Sign In
                </button>
            </Link>
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
                <p className="mt-4 text-muted-foreground text-sm">See how it works for businesses</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=675&fit=crop')] bg-cover bg-center opacity-30" />
          </div>
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
              Solutions
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Everything you need
              <br />
              <span className="text-muted-foreground italic">to succeed.</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="relative h-[500px] sm:h-[560px] md:h-[620px] flex items-center justify-center perspective-[1200px]">
              <AnimatePresence mode="popLayout">
                {businessFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  const offset = (i - activeFeature + businessFeatures.length) % businessFeatures.length;
                  const isActive = offset === 0;
                  const isNext = offset === 1;
                  const isPrev = offset === businessFeatures.length - 1;
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
                    xPos = offset > businessFeatures.length / 2 ? -400 : 400;
                    zPos = -300;
                    rotation = offset > businessFeatures.length / 2 ? 15 : -15;
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
                                  Learn More
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
              {businessFeatures.map((feature, i) => (
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
          </div>
        </div>
      </section>

      <section id="tools" className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium mb-6">
              Platform Tools
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Built for
              <br />
              <span className="text-gradient-color italic">modern businesses.</span>
            </h2>
          </motion.div>

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

      <section id="testimonials" className="py-24 md:py-32 bg-card">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
              Success Stories
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
              Trusted by leading
              <br />
              <span className="text-muted-foreground italic">businesses.</span>
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
              Ready to
              <br />
              <span className="text-gradient-color italic">transform your business?</span>
            </h2>
            <p className="text-muted-foreground text-[17px] md:text-[21px] max-w-[540px] mx-auto mb-10 leading-relaxed">
              Join thousands of salons and boutiques growing with Rare.
              Start your journey today.
            </p>

            <div className="max-w-[480px] mx-auto">
              <Link href="/business/register" className="group">
                <button
                  className="w-full h-14 rounded-full bg-primary text-primary-foreground font-medium text-[17px] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                >
                  Join as Partner
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
