import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-12">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl bg-secondary border-transparent focus:bg-card focus:border-primary border outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-secondary border-transparent focus:bg-card focus:border-primary border outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-secondary border-transparent focus:bg-card focus:border-primary border outline-none" />
            </div>
            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Office</h3>
              <p className="text-muted-foreground">123, Tech Park, Koramangala<br />Bangalore, Karnataka 560034<br />India</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">support@priisme.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+91 80 1234 5678</p>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
