export default function PressPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6">Press & Media</h1>
        <p className="text-lg text-muted-foreground mb-8">Latest news and updates from Priisme.</p>

        <div className="space-y-8">
          {[
            { date: "October 15, 2024", title: "Priisme Raises Series A to Revolutionize Fashion Tech" },
            { date: "September 1, 2024", title: "Introducing AI Stylist: The Future of Personal Shopping" },
            { date: "August 10, 2024", title: "Priisme Partners with Top 100 Salons in Bangalore" }
          ].map((item) => (
            <div key={item.title} className="border-b border-border pb-6 last:border-0">
              <p className="text-sm text-primary font-medium mb-2">{item.date}</p>
              <h2 className="text-2xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">{item.title}</h2>
              <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
