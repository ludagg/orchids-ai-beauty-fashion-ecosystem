import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-semibold mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500">Priisme</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India&apos;s first AI-powered beauty & fashion ecosystem.
            </p>
          </div>
          {[
            {
              title: "Platform",
              links: [
                { label: "Marketplace", href: "/app/marketplace" },
                { label: "Salons", href: "/app/salons" },
                { label: "Video", href: "/app/videos-creations" },
                { label: "AI Stylist", href: "/app/ai-stylist" }
              ]
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Press", href: "/press" },
                { label: "Blog", href: "/blog" }
              ]
            },
            {
              title: "Support",
              links: [
                { label: "Help", href: "/help" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" }
              ]
            },
            {
              title: "Connect",
              links: [
                { label: "Instagram", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "YouTube", href: "#" }
              ]
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Priisme. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
