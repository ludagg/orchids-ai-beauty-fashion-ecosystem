"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  UserCircle,
  ChevronDown,
  LogIn,
  Heart,
  Bell,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function UserAccount({ showLabel = true }: { showLabel?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isPublicPath =
    pathname?.startsWith("/app/search") ||
    pathname?.startsWith("/app/salons") ||
    pathname?.startsWith("/app/marketplace") ||
    pathname?.startsWith("/app/ai-stylist") ||
    pathname?.startsWith("/app/videos-creations");

  useEffect(() => {
    if (!isPending && !session && !isPublicPath) {
      router.push("/auth");
    }
  }, [isPending, session, router, isPublicPath]);

  if (isPending) {
      return (
          <div className="flex items-center gap-2 p-1.5 pr-3">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              {showLabel && <div className="h-4 w-20 bg-muted rounded animate-pulse hidden sm:block" />}
          </div>
      );
  }

  if (!session) {
    if (isPublicPath) {
      return (
        <Link href="/auth" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium">
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      );
    }
    return null; // Will redirect shortly
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-secondary transition-colors border border-transparent hover:border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 flex items-center justify-center text-white font-medium text-xs shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
            {user?.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
                initials
            )}
          </div>
          {showLabel && (
            <span className="text-sm font-medium hidden sm:inline text-foreground">
              {user?.name || "User"}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-2" align="end" sideOffset={8}>
        <div className="grid grid-cols-4 gap-2 min-w-[340px]">
          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/profile" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <UserCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium text-foreground">Profile</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/notifications" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium text-foreground">Notifications</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/wishlist" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium text-foreground">Wishlist</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/settings" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium text-foreground">Settings</span>
             </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
