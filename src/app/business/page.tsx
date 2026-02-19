import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scissors, ShoppingBag, TrendingUp, Users, Zap } from "lucide-react";

export default function BusinessLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 lg:px-24 flex flex-col items-center text-center space-y-8 bg-gradient-to-b from-primary/5 to-background">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight max-w-4xl">
          Grow Your Business with <span className="text-primary">Rare</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          The all-in-one platform for beauty professionals and fashion retailers.
          Reach more customers, manage bookings, and sell products effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md justify-center">
          <Link href="/business/register?type=salon" className="w-full">
            <Button size="lg" className="w-full h-14 text-lg gap-2 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20">
              <Scissors className="w-5 h-5" />
              Join as Salon
            </Button>
          </Link>
          <Link href="/business/register?type=shop" className="w-full">
            <Button size="lg" variant="outline" className="w-full h-14 text-lg gap-2 border-2 hover:bg-secondary/50">
              <ShoppingBag className="w-5 h-5" />
              Join as Shop
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Why Partner with Rare?</h2>
            <p className="text-muted-foreground">Tailored tools for every type of beauty business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expand Your Reach</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with thousands of beauty enthusiasts looking for services and products like yours in their local area.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data-Driven Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access powerful analytics to understand your customers, track performance, and optimize your offerings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Operations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Integrated booking management, inventory tracking, and payment processing all in one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold">Ready to transform your business?</h2>
          <p className="text-primary-foreground/80 text-lg">Join the fastest growing beauty marketplace today.</p>
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full font-bold text-primary hover:bg-white">
            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
