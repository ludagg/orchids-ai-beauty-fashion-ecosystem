import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="pt-32 pb-16 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-8">Cookie Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
           <p>
            This Cookie Policy explains how Rare uses cookies and similar technologies to recognize you when you visit our website.
          </p>
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Why do we use cookies?</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
