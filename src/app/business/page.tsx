import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Scissors, ShoppingBag, BarChart3, Users, Zap, CheckCircle } from 'lucide-react';

export default function BusinessLandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 flex flex-col items-center text-center px-4 bg-gradient-to-b from-background to-secondary/20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          La plateforme tout-en-un pour les professionnels de la beauté
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Gérez vos rendez-vous, vendez vos produits et fidélisez votre clientèle avec Rare Business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/business/onboarding?type=SALON">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 gap-2 w-full sm:w-auto">
              <Scissors className="w-5 h-5" /> Je suis un Salon
            </Button>
          </Link>
          <Link href="/business/onboarding?type=BOUTIQUE">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 gap-2 w-full sm:w-auto hover:bg-secondary/50">
              <ShoppingBag className="w-5 h-5" /> Je suis une Boutique
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="solutions" className="w-full py-24 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Pourquoi choisir Rare ?</h2>
          <p className="text-muted-foreground text-lg">Une suite d'outils conçue pour votre croissance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Réservation Simplifiée</h3>
            <p className="text-muted-foreground leading-relaxed">
              Un agenda intelligent qui remplit vos créneaux vides et réduit les "no-shows" grâce aux rappels automatiques.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Marketplace Intégrée</h3>
            <p className="text-muted-foreground leading-relaxed">
              Vendez vos produits cosmétiques directement sur l'application. Gérez vos stocks et expéditions facilement.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Analyses & Croissance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Comprenez vos clients et vos revenus avec des tableaux de bord clairs. Prenez les bonnes décisions.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="w-full py-24 bg-muted/30 border-y border-border px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
           <h2 className="text-3xl font-bold font-display">Rejoignez le réseau Rare</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for partner logos */}
              <div className="h-12 bg-foreground/10 rounded-lg flex items-center justify-center font-bold text-muted-foreground">VOGUE</div>
              <div className="h-12 bg-foreground/10 rounded-lg flex items-center justify-center font-bold text-muted-foreground">ELLE</div>
              <div className="h-12 bg-foreground/10 rounded-lg flex items-center justify-center font-bold text-muted-foreground">L'ORÉAL</div>
              <div className="h-12 bg-foreground/10 rounded-lg flex items-center justify-center font-bold text-muted-foreground">SEPHORA</div>
           </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="w-full py-32 px-4 text-center">
        <h2 className="text-4xl font-bold font-display mb-6">Prêt à transformer votre business ?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
          L'inscription prend moins de 5 minutes. Aucune carte bancaire requise pour commencer.
        </p>
        <Link href="/business/onboarding">
            <Button size="lg" className="h-16 px-12 rounded-full text-xl shadow-2xl shadow-primary/30">
              Commencer maintenant
            </Button>
        </Link>
      </section>
    </div>
  );
}
