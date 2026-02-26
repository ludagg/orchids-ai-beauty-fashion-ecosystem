"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";

export default function SalonsSection() {
  return (
    <section id="salons" className="py-24 md:py-32 bg-secondary/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.3] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-card shadow-2xl shadow-black/5 hover:shadow-3xl hover:shadow-black/10 transition-shadow duration-500 group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop"
                  alt="Salon"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-emerald-800 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Open Now
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display font-semibold text-2xl text-foreground mb-1">Luxe Beauty Lounge</h3>
                    <p className="text-muted-foreground text-sm font-light">Koramangala, Bangalore</p>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    4.9
                  </div>
                </div>

                <div className="flex gap-2 mb-8 flex-wrap">
                  {["Haircut", "Color", "Spa", "Facial"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-secondary border border-border text-xs text-secondary-foreground font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/5">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-xs text-violet-600 font-medium mb-6 uppercase tracking-wider">
              Salon Booking
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-8 font-display text-foreground">
              Beauty services,
              <br />
              <span className="text-muted-foreground font-light italic">verified.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg font-light">
              Book appointments at India&apos;s top salons. Real reviews.
              Real-time availability. Secure, hassle-free payments.
            </p>

            <ul className="space-y-4 mb-10">
              {["Real-time slot availability", "Verified customer reviews", "Easy cancellation policy"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-foreground/80">
                  <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
              Find Salons Near You
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
