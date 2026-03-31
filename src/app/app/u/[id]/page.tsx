import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, salons, follows, videos } from "@/db/schema";
import { eq, and, count, sum } from "drizzle-orm";
import PublicProfileView from "./PublicProfileView";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: targetUserId } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If viewing own profile, redirect to the private profile dashboard
  if (session?.user?.id === targetUserId) {
    redirect("/app/profile");
  }

  // 1. Fetch User Data
  const user = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
    columns: {
      id: true,
      name: true,
      image: true,
      role: true,
      bio: true,
      socialLinks: true,
      createdAt: true,
    }
  });

  if (!user) {
    notFound();
  }

  // 2. Fetch Salon (if owner)
  const salon = await db.query.salons.findFirst({
    where: eq(salons.ownerId, targetUserId),
    columns: {
      id: true,
      name: true,
      description: true,
      slug: true
    }
  });

  // 3. Stats
  // Followers
  const followersCount = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followingId, targetUserId))
    .then(res => res[0]?.count || 0);

  // Following
  const followingCount = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followerId, targetUserId))
    .then(res => res[0]?.count || 0);

  // Likes
  const likesCount = await db
    .select({ total: sum(videos.likes) })
    .from(videos)
    .where(eq(videos.userId, targetUserId))
    .then(res => Number(res[0]?.total) || 0);

  // 4. Is Following?
  let isFollowing = false;
  if (session?.user) {
    const followCheck = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, session.user.id),
        eq(follows.followingId, targetUserId)
      )
    });
    isFollowing = !!followCheck;
  }

  const userData = {
    ...user,
    bio: salon?.description || user.bio || "No bio available.",
    handle: salon?.slug ? `@${salon.slug}` : `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
    createdAt: user.createdAt,
    email: user.name.toLowerCase().replace(/\s+/g, '_') + "@example.com" // Provide a dummy email as it's required by the UserData interface but not exposed publicly
  };

  const stats = {
    followers: followersCount,
    following: followingCount,
    likes: likesCount
  };

  return (
    <PublicProfileView
      user={userData}
      stats={stats}
      initialIsFollowing={isFollowing}
      isSalonOwner={!!salon}
      currentUserId={session?.user?.id}
    />
  );
}
