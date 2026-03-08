"use client";

import { motion } from "framer-motion";

export default function BrandsSection() {
  return (
    <section className="py-16 md:py-20 bg-background border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-10"
        >
          Trusted by leading brands worldwide
        </motion.p>

        <div className="flex gap-12 md:gap-20 items-center justify-center flex-wrap">
          {[
            { name: "Nike", svg: <svg viewBox="0 0 100 35" className="w-20 h-8"><path fill="currentColor" d="M21.7 3.1c-8.8 4.3-17.6 8.8-26 13.4-1.4.8-2.1 1.5-2.1 2.3 0 .5.3.9.8 1.3.5.4 1.1.6 1.8.6.5 0 2.2-.5 5.1-1.5 2.9-1 6.4-2.3 10.5-3.8 4.1-1.5 7.1-2.6 9-3.3l5.7-2.1c1.8-.7 3.2-1.2 4.2-1.5 1-.3 1.8-.5 2.4-.5.4 0 .6.1.7.2.1.1.2.3.2.5 0 .3-.1.6-.2.9-.1.3-.4.7-.7 1.2l-4.5 6.6-8.2 12.1c-.8 1.2-1.2 2.1-1.2 2.6 0 .4.2.7.5.9.3.2.7.3 1.2.3.4 0 .8-.1 1.2-.2.4-.1.9-.4 1.4-.7 2.9-1.8 5.8-3.7 8.7-5.6l6.4-4.3c1.5-1 2.9-1.9 4.2-2.9 1.3-1 2.5-1.9 3.6-2.9 1.1-1 2-1.9 2.7-2.7.7-.8 1.3-1.7 1.7-2.5.4-.8.6-1.7.6-2.5 0-.9-.2-1.6-.7-2.3-.5-.7-1.1-1.2-1.9-1.6-.8-.4-1.7-.7-2.6-.9-.9-.2-1.9-.3-2.8-.3-1.2 0-2.6.2-4.2.5-1.6.3-3.3.8-5.1 1.5-1.8.7-3.8 1.4-5.8 2.3-2 .9-4.3 1.9-6.8 3z"/></svg> },
            { name: "Adidas", svg: <svg viewBox="0 0 100 65" className="w-16 h-10"><path fill="currentColor" d="M0 65l16.7-28.9 16.7 28.9H0zm19.4-33.5L36.1 3.4 52.8 32l-16.7 28.9-16.7-28.4zm36.1 0L72.2 3.4 88.9 32 72.2 60.9 55.5 32.5v-.5l-.1.5zm0-28.1L72.2 0l16.7 3.4L72.2 32 55.5 3.4z"/></svg> },
            { name: "H&M", svg: <svg viewBox="0 0 100 50" className="w-14 h-8"><text x="50" y="38" textAnchor="middle" fontSize="36" fontWeight="bold" fill="currentColor">H&amp;M</text></svg> },
            { name: "Zara", svg: <svg viewBox="0 0 100 30" className="w-16 h-6"><text x="50" y="24" textAnchor="middle" fontSize="28" fontWeight="400" letterSpacing="4" fill="currentColor" style={{fontFamily: "serif"}}>ZARA</text></svg> },
            { name: "Gucci", svg: <svg viewBox="0 0 100 35" className="w-16 h-8"><text x="50" y="28" textAnchor="middle" fontSize="24" fontWeight="400" letterSpacing="6" fill="currentColor" style={{fontFamily: "serif"}}>GUCCI</text></svg> },
            { name: "Dior", svg: <svg viewBox="0 0 100 30" className="w-14 h-6"><text x="50" y="24" textAnchor="middle" fontSize="26" fontWeight="400" letterSpacing="8" fill="currentColor" style={{fontFamily: "serif"}}>DIOR</text></svg> },
          ].map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-muted-foreground/50 hover:text-muted-foreground transition-all duration-300 cursor-pointer"
            >
              {brand.svg}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}