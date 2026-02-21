import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PartnerRegistrationForm from "./PartnerRegistrationForm";

export default async function BecomePartnerPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth?callbackUrl=/become-partner");
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Become a Partner</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join Rare to grow your business, reach new customers, and manage your operations efficiently.
          </p>
        </div>

        <div className="bg-card border border-border rounded-[32px] shadow-sm overflow-hidden">
             <PartnerRegistrationForm user={session.user} />
        </div>
      </div>
    </div>
  );
}
