"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, ShoppingBag, BarChart3, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "Smart Booking Management",
    description: "Automated scheduling, reminders, and payment processing.",
    icon: Calendar,
  },
  {
    title: "Video Commerce Tools",
    description: "Sell products directly through engaging video content.",
    icon: ShoppingBag,
  },
  {
    title: "Growth Analytics",
    description: "Real-time insights to track performance and revenue.",
    icon: BarChart3,
  },
];

export default function BusinessSection() {
  return (
    <section id="business" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_40%)] opacity-[0.03]" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              For Partners
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
              Grow your business
              <br />
              <span className="text-muted-foreground italic">with intelligence.</span>
            </h2>
            <p className="text-muted-foreground text-[17px] leading-relaxed mb-10 max-w-[480px]">
              Join thousands of salons and creators using Rare to streamline operations,
              reach new customers, and increase revenue through AI-powered tools.
            </p>

            <div className="space-y-8 mb-10">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link href="/business">
              <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
                Become a Partner
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10 border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1521590832896-7ea20ade7336?w=800&h=1000&fit=crop"
                alt="Business Dashboard"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <p className="text-xs text-white/70 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">₹1,24,500</p>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs mt-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>+12.5% vs last month</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <p className="text-xs text-white/70 mb-1">New Bookings</p>
                    <p className="text-2xl font-bold text-white">48</p>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>8 pending confirmation</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/90 text-sm italic border-l-2 border-primary pl-4">
                  "Rare has completely transformed how we manage our salon. bookings are up 40% in just two months."
                </p>
                <div className="flex items-center gap-3 mt-4 pl-4">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
                    alt="Salon Owner"
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">Sarah Jenkins</p>
                    <p className="text-white/60 text-xs">Owner, Glow Studio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-40 p-4 bg-card rounded-2xl shadow-xl border border-border hidden sm:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium">New Order</p>
                  <p className="text-[10px] text-muted-foreground">Just now</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">₹1,499</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Paid</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
