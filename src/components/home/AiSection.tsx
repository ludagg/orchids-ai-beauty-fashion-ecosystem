"use client";

import { motion } from "framer-motion";
import {
  Scan,
  Palette,
  TrendingUp,
  Zap,
  Heart
} from "lucide-react";

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

export default function AiSection() {
  return (
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
  );
}