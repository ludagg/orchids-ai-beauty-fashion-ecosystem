import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { salons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import SidebarLayoutClient from './SidebarLayoutClient';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect('/auth?mode=signin');
  }

  // Fetch salon
  const salon = await db.select().from(salons).where(eq(salons.ownerId, session.user.id)).limit(1);

  // If user has no salon, redirect to business onboarding
  // This ensures only "real" partners access the dashboard
  if (salon.length === 0) {
     redirect('/business/onboarding');
  }

  return (
    <SidebarLayoutClient salon={salon[0]}>
        {children}
    </SidebarLayoutClient>
  );
}
