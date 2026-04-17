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
    answer: "Yes, every salon on Priisme undergoes a strict verification process. We check their licenses, visit their premises, and ensure they meet our high standards for hygiene and service quality."
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
    <section id="faq" className="py-24 md:py-32 bg-card">
      <div className="max-w-[800px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground font-medium mb-6">
            FAQ
          </span>
          <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold leading-tight tracking-tight font-display">
            Frequently asked
            <br />
            <span className="text-muted-foreground italic">questions.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-lg font-medium py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
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
