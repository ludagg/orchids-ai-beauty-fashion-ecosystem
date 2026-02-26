"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function MarketplaceSection() {
  return (
    <section id="marketplace" className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium mb-6 uppercase tracking-wider">
              Marketplace
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-8 font-display text-foreground">
              Shop with
              <br />
              <span className="text-muted-foreground font-light italic">confidence.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg font-light">
              Curated fashion from verified sellers. Secure payments.
              Easy returns. Virtual try-on powered by AI.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "AI-powered size recommendations",
                "Virtual try-on technology",
                "Verified authentic products"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-foreground/80">
                  <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
              Explore Marketplace
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=750&fit=crop", price: "₹2,499" },
                { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=750&fit=crop", price: "₹3,299" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.6 }}
                  className={cn(
                    "group rounded-2xl overflow-hidden bg-background shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500",
                    i === 1 ? "mt-12" : ""
                  )}
                >
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={item.src}
                      alt="Fashion"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                    {/* Quick View Button */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-full py-3 rounded-xl bg-white/90 backdrop-blur text-black font-medium text-xs hover:bg-white shadow-lg">
                            Quick View
                        </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-foreground text-lg mb-1">{item.price}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Designer Collection</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
