"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Fashion Blogger",
    content: "Rare has completely changed how I discover new designers. The AI Stylist is surprisingly accurate and helps me find pieces I wouldn't have considered before.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 5
  },
  {
    name: "Rahul Mehra",
    role: "Verified Buyer",
    content: "The virtual try-on feature is a game changer. I've bought three outfits so far and they all fit perfectly. No more returns because of wrong sizing!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Salon Regular",
    content: "Booking my favorite salon has never been easier. Love the real-time availability and the fact that I can see verified reviews before booking.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-card">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
            Testimonials
          </span>
          <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
            Loved by fashion
            <br />
            <span className="text-muted-foreground italic">enthusiasts.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-background border border-border relative group hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed mb-8">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}