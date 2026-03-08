"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
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
            Join the
            <br />
            <span className="text-gradient-color italic">future of fashion.</span>
          </h2>
          <p className="text-muted-foreground text-[17px] md:text-[21px] max-w-[540px] mx-auto mb-10 leading-relaxed">
            Be the first to experience India&apos;s most intelligent fashion ecosystem.
            Start your journey today.
          </p>

          <div className="max-w-[480px] mx-auto">
            <Link href="/app" className="group">
              <button
                className="w-full h-14 rounded-full bg-primary text-primary-foreground font-medium text-[17px] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}