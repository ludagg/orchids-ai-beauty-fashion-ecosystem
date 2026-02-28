import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { salons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, LayoutDashboard, PlusCircle, Store, TrendingUp } from "lucide-react";
import { BusinessAnalytics } from "@/components/my-business/BusinessAnalytics";

export default async function MyBusinessPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const userSalons = await db
    .select()
    .from(salons)
    .where(eq(salons.ownerId, session.user.id))
    .orderBy(desc(salons.createdAt));

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Businesses</h1>
                <p className="text-muted-foreground mt-1">Manage your salons and boutiques.</p>
            </div>
            <Link href="/become-partner">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Business
                </Button>
            </Link>
        </div>

        {userSalons.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <Store className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">No businesses yet</CardTitle>
                <CardDescription className="max-w-sm mt-2 mb-6">
                    Start your journey as a partner by registering your first salon or boutique.
                </CardDescription>
                <Link href="/become-partner">
                    <Button>Register Now</Button>
                </Link>
            </Card>
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSalons.map((salon) => (
                    <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                        <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                            <img
                                src={salon.logo || salon.image || "https://images.unsplash.com/photo-1521590832896-7bbc6823b63b?w=500&h=300&fit=crop"}
                                alt={salon.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2">
                                <Badge
                                    variant={salon.status === 'active' ? 'default' : 'secondary'}
                                    className={salon.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                                >
                                    {salon.status}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="truncate text-xl">{salon.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 truncate">
                                <MapPin className="h-3.5 w-3.5" />
                                {salon.city || "Unknown City"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {salon.description || "No description provided."}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-0 gap-2 flex flex-col sm:flex-row">
                            <Link href={`/business?salonId=${salon.id}`} className="w-full">
                                <Button className="w-full" variant="outline">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Manage Dashboard
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
              </div>

              <Separator className="my-8" />

              <BusinessAnalytics salonName={userSalons[0]?.name || "Your Business"} />
            </>
        )}
    </div>
  );
}
