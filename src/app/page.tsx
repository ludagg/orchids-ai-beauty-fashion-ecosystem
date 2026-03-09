"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import BusinessSection from "@/components/landing/BusinessSection";
import MobileAppSection from "@/components/landing/MobileAppSection";
import FAQSection from "@/components/landing/FAQSection";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AiSection from "@/components/home/AiSection";
import MarketplaceSection from "@/components/home/MarketplaceSection";
import SalonsSection from "@/components/home/SalonsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import BrandsSection from "@/components/home/BrandsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <LandingNavbar />

      <HeroSection />
      <FeaturesSection />
      <AiSection />
      <MarketplaceSection />
      <SalonsSection />
      <TestimonialsSection />

      <BusinessSection />
      <MobileAppSection />
      <FAQSection />

      <CtaSection />
      <BrandsSection />

      <LandingFooter />
    </div>
  );
}