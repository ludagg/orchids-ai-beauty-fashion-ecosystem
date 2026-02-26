"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI Stylist work?",
    answer: "Our AI analyzes your body type, style preferences, and current trends to recommend outfits that fit you perfectly. It learns from your feedback to get better over time."
  },
  {
    question: "Are the salons verified?",
    answer: "Yes, every salon on Rare undergoes a strict verification process. We check their licenses, visit their premises, and ensure they meet our high standards for hygiene and service quality."
  },
  {
    question: "Can I return items bought from the marketplace?",
    answer: "Absolutely. We offer a hassle-free 7-day return policy for all marketplace items. If it doesn't fit or you don't love it, we'll pick it up."
  },
  {
    question: "How do I become a partner?",
    answer: "If you're a salon owner or a fashion creator, click on 'For Business' in the menu. Fill out the application form, and our team will get in touch within 24 hours."
  },
  {
    question: "Is the app free to use?",
    answer: "Yes, downloading the app and browsing is completely free. You only pay for the products you buy or the services you book."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-card border-t border-border/50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground font-medium mb-6 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight font-display text-foreground">
            Frequently asked
            <br />
            <span className="text-muted-foreground font-light italic">questions.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border/60 rounded-xl px-6 bg-background/50 overflow-hidden data-[state=open]:bg-secondary/30 transition-colors">
                <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed font-light">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
