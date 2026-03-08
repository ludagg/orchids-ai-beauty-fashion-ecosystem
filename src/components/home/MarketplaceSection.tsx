"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function MarketplaceSection() {
  return (
    <section id="marketplace" className="py-24 md:py-32 bg-card">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
              Marketplace
            </span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold leading-tight tracking-tight mb-6 font-display">
              Shop with
              <br />
              <span className="text-muted-foreground italic">confidence.</span>
            </h2>
            <p className="text-muted-foreground text-[17px] leading-relaxed mb-8 max-w-[440px]">
              Curated fashion from verified sellers. Secure payments.
              Easy returns. Virtual try-on powered by AI.
            </p>

            <ul className="space-y-3 mb-8">
              {["AI-powered size recommendations", "Virtual try-on technology", "Verified authentic products"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] inline-flex items-center gap-2 group">
              Explore Marketplace
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "https://images.unsplash.com/photo-1558171813-4c088753af8f", price: "₹2,499" },
                { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b", price: "₹3,299" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group rounded-2xl overflow-hidden shadow-xl shadow-foreground/10 bg-card ${i === 1 ? "mt-8" : ""}`}
                >
                  <div className="relative overflow-hidden h-[240px] sm:h-[280px]">
                    <Image
                      src={item.src}
                      alt="Fashion"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <button className="absolute bottom-4 left-4 right-4 py-3 rounded-xl bg-card text-foreground font-medium text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-secondary">
                      Quick View
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground">{item.price}</p>
                    <p className="text-sm text-muted-foreground">Designer Collection</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}