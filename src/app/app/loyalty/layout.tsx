import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Glow Points Loyalty Program</h1>
        <p className="text-muted-foreground">
          Earn points, unlock rewards, and level up your beauty journey!
        </p>
      </div>

      <div className="w-full">
         {/* Navigation using Tabs style but as Links */}
         <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <Link href="/app/loyalty" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 hover:text-foreground">
                Overview
            </Link>
            <Link href="/app/loyalty/rewards" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-background/50 hover:text-foreground">
                Rewards Shop
            </Link>
            <Link href="/app/loyalty/achievements" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-background/50 hover:text-foreground">
                Achievements
            </Link>
         </div>
         {/* Since we can't easily detect active route in Server Component for styling, client component for Nav is better.
             But for MVP, links are fine. The styling above is static.
             Ideally use usePathname in a client component.
             I'll stick to this for simplicity or create a small client nav.
         */}
      </div>

      {children}
    </div>
  );
}
