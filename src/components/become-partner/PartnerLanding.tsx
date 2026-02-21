"use strict";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart3, Users, Calendar, ShieldCheck } from "lucide-react";

interface PartnerLandingProps {
  onStart: () => void;
}

export default function PartnerLanding({ onStart }: PartnerLandingProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-display font-bold tracking-tight sm:text-6xl">
              Partner with Rare & Grow Your Business
            </h1>
            <p className="text-xl text-muted-foreground">
              Join the premier platform for beauty and wellness professionals.
              Manage bookings, attract new clients, and streamline your operations—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={onStart} className="w-full sm:w-auto text-lg px-8 h-12 rounded-full">
                Become a Partner
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 rounded-full">
                Learn More
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              No setup fees • Cancel anytime • 24/7 Support
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Professionals Choose Rare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the tools you need to succeed in the modern beauty industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Expand Your Reach"
              description="Connect with thousands of potential clients searching for services in your area."
            />
            <BenefitCard
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Smart Booking"
              description="Automated scheduling, reminders, and deposits to reduce no-shows."
            />
            <BenefitCard
              icon={<BarChart3 className="w-8 h-8 text-primary" />}
              title="Analytics & Growth"
              description="Track your performance with detailed insights on revenue, clients, and trends."
            />
            <BenefitCard
              icon={<ShieldCheck className="w-8 h-8 text-primary" />}
              title="Secure Payments"
              description="Get paid faster with integrated payment processing and automated payouts."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started in just a few minutes.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

            <div className="grid md:grid-cols-3 gap-12">
              <Step
                number="1"
                title="Create Account"
                description="Sign up and tell us about your business and services."
              />
              <Step
                number="2"
                title="Get Verified"
                description="Upload your business documents for quick verification."
              />
              <Step
                number="3"
                title="Start Earning"
                description="Set your availability and start accepting bookings instantly."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of top-rated salons and stylists on Rare today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={onStart}
            className="text-primary font-bold px-10 h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center bg-background md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border md:border-none">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 border-4 border-background shadow-sm z-10">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
