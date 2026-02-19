import Link from 'next/link';

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <Link href="/business" className="text-2xl font-bold font-display tracking-tight flex items-center gap-1">
             Rare <span className="text-primary text-base font-sans font-medium px-2 py-0.5 rounded-full bg-primary/10">Business</span>
           </Link>
           <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
             <Link href="/business#solutions" className="hover:text-primary transition-colors">Solutions</Link>
             <Link href="/business#pricing" className="hover:text-primary transition-colors">Tarifs</Link>
             <Link href="/business#resources" className="hover:text-primary transition-colors">Ressources</Link>
           </nav>
           <div className="flex items-center gap-4">
              <Link href="/auth?mode=signin" className="text-sm font-medium hover:text-primary transition-colors">Se connecter</Link>
              <Link href="/business/onboarding" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Devenir Partenaire
              </Link>
           </div>
        </div>
      </header>
      <main className="flex-1 pt-16">
        {children}
      </main>
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rare Business. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
