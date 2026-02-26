"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.03] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight mb-8 font-display text-foreground">
            Join the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-rose-500 italic font-light">future of fashion.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
            Be the first to experience India&apos;s most intelligent fashion ecosystem.
            Start your journey today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app" className="w-full sm:w-auto">
              <button
                className="w-full h-14 px-10 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:scale-105 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
