export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6">Careers at Priisme</h1>
        <p className="text-xl text-muted-foreground mb-8">Join us in shaping the future of fashion tech.</p>

        <div className="grid gap-6">
          {["Senior Frontend Engineer", "AI/ML Researcher", "Product Designer", "Marketing Manager"].map((job) => (
            <div key={job} className="p-6 rounded-2xl border border-border bg-card flex items-center justify-between hover:border-primary transition-colors cursor-pointer group">
              <div>
                <h3 className="text-lg font-semibold">{job}</h3>
                <p className="text-sm text-muted-foreground">Bangalore, India • Full-time</p>
              </div>
              <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">Apply &rarr;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
