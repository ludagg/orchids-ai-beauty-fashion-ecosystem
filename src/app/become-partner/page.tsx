import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import PartnerWrapper from "@/components/become-partner/PartnerWrapper";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function BecomePartnerPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PartnerWrapper user={session?.user} />
    </Suspense>
  );
}
