import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6">About Priisme</h1>
        <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p className="text-lg text-foreground font-medium">
            We are building the future of fashion and beauty in India.
          </p>
          <p>
            Priisme is an AI-powered ecosystem that connects fashion enthusiasts with designers, salons, and stylists. Our mission is to personalize style and beauty services for everyone using cutting-edge technology.
          </p>
          <p>
            Founded in 2024, we aim to solve the fragmentation in the fashion and beauty industry by bringing everything under one roof - from discovering new trends to booking salon appointments and getting personalized style advice.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
