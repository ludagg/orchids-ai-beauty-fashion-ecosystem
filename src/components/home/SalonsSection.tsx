"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";

export default function SalonsSection() {
  return (
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
              <div className="relative overflow-hidden h-[260px] sm:h-[300px]">
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035"
                  alt="Salon"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur text-xs font-medium flex items-center gap-1.5 z-10">
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
  );
}