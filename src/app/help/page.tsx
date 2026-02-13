import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6">Help Center</h1>
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full px-6 py-4 rounded-full bg-secondary border-transparent focus:bg-card focus:border-primary border outline-none text-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {["Account & Settings", "Payments & Billing", "Orders & Shipping", "Returns & Refunds", "Salon Bookings", "Technical Support"].map((topic) => (
            <div key={topic} className="p-6 rounded-2xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">{topic}</h3>
              <p className="text-sm text-muted-foreground">Find answers to common questions about {topic.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
