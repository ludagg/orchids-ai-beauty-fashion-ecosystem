"use client";

import { motion } from "framer-motion";
import { Scan, Palette, TrendingUp, Zap, Heart } from "lucide-react";

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

const capabilities = [
  { metric: "60%", label: "Fewer Returns", detail: "Virtual fit technology" },
  { metric: "500+", label: "Verified Salons", detail: "Trusted partners" },
  { metric: "2M+", label: "Styles", detail: "AI-curated catalog" },
];

export default function AISection() {
  return (
    <section id="ai" className="py-24 md:py-32 bg-background overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs text-sky-600 font-medium mb-6 uppercase tracking-wider">
            Artificial Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight font-display text-foreground">
            Your personal
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 font-light italic">AI stylist.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6 max-w-2xl mx-auto font-light">
            Advanced machine learning that understands your style,
            body type, and preferences. No more guesswork.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`${sizeClasses[item.size as keyof typeof sizeClasses]} relative group p-6 md:p-8 rounded-3xl bg-card border border-border/60 hover:border-border hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden cursor-default`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm transition-transform duration-500 group-hover:scale-110"
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: item.iconColor }} />
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mt-20 md:mt-32 border-t border-border pt-16">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-foreground/10 group-hover:text-foreground/20 transition-colors duration-700">
                {cap.metric}
              </p>
              <p className="text-lg font-medium mt-4 text-foreground">{cap.label}</p>
              <p className="text-sm text-muted-foreground mt-1 font-light">{cap.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
