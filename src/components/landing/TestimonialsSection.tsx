"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Fashion Blogger",
    content: "Rare has completely changed how I discover new designers. The AI Stylist is surprisingly accurate and helps me find pieces I wouldn't have considered before.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    name: "Rahul Mehra",
    role: "Verified Buyer",
    content: "The virtual try-on feature is a game changer. I've bought three outfits so far and they all fit perfectly. No more returns because of wrong sizing!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Salon Regular",
    content: "Booking my favorite salon has never been easier. Love the real-time availability and the fact that I can see verified reviews before booking.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-background border border-border text-xs text-muted-foreground font-medium mb-6 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight font-display text-foreground">
            Loved by fashion
            <br />
            <span className="text-muted-foreground font-light italic">enthusiasts.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group"
            >
              <div className="flex gap-1 mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-lg leading-relaxed mb-8 font-light text-foreground/90">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-4 border-t border-border pt-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-background"
                />
                <div>
                  <p className="font-medium text-sm text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
