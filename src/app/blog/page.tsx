import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6">The Rare Blog</h1>
        <p className="text-lg text-muted-foreground mb-12">Stories about fashion, beauty, and technology.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video bg-secondary rounded-2xl mb-4 overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-rose-500/20 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-sm text-primary font-medium mb-2">Fashion Trends</p>
              <h3 className="text-xl font-semibold mb-2 group-hover:underline">Top 10 Styles for Summer 2025</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">Discover the hottest trends that will dominate the fashion scene this upcoming summer season.</p>
            </div>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
