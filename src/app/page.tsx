"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import BusinessSection from "@/components/landing/BusinessSection";
import MobileAppSection from "@/components/landing/MobileAppSection";
import FAQSection from "@/components/landing/FAQSection";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AISection from "@/components/landing/AISection";
import MarketplaceSection from "@/components/landing/MarketplaceSection";
import SalonsSection from "@/components/landing/SalonsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 font-sans antialiased overflow-x-hidden">
      <LandingNavbar />

      <main className="flex flex-col w-full">
        <HeroSection />
        <FeaturesSection />
        <AISection />
        <MarketplaceSection />
        <SalonsSection />
        <TestimonialsSection />
        <BusinessSection />
        <MobileAppSection />
        <FAQSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
