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
    <section id="business" className="py-24 md:py-32 bg-secondary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_40%)] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs text-emerald-600 font-medium mb-6 uppercase tracking-wider">
              For Partners
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-8 font-display text-foreground">
              Grow your business
              <br />
              <span className="text-muted-foreground font-light italic">with intelligence.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg font-light">
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
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10 transition-all duration-300">
                      <Icon className="w-6 h-6 text-foreground group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link href="/become-partner">
              <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
                Become a Partner
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-border bg-card aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1521590832896-7ea20ade7336?w=800&h=1000&fit=crop"
                alt="Business Dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                    <p className="text-[10px] uppercase tracking-wider text-white/70 mb-1 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold mb-1">₹1,24,500</p>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>+12.5%</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                    <p className="text-[10px] uppercase tracking-wider text-white/70 mb-1 font-medium">New Bookings</p>
                    <p className="text-2xl font-bold mb-1">48</p>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>8 pending</span>
                    </div>
                  </div>
                </div>

                <div className="border-l-2 border-emerald-500 pl-4 mb-6">
                    <p className="text-white/90 text-sm font-light italic leading-relaxed">
                    "Rare has completely transformed how we manage our salon. bookings are up 40% in just two months."
                    </p>
                </div>

                <div className="flex items-center gap-3 pl-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                     <img
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
                        alt="Salon Owner"
                        className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Sarah Jenkins</p>
                    <p className="text-white/60 text-xs uppercase tracking-wide">Owner, Glow Studio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element - Responsive hidden on mobile to avoid clutter */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-48 p-4 bg-card rounded-2xl shadow-xl border border-border hidden md:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">New Order</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Just now</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <p className="text-sm font-bold text-foreground">₹1,499</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">Paid</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
