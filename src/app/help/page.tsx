export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}
