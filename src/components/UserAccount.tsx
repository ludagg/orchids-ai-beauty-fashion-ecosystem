"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  UserCircle,
  ChevronDown,
  LogIn,
  Heart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function UserAccount({ showLabel = true }: { showLabel?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
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

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.push("/auth");
          },
          onError: () => {
            toast.error("Failed to sign out");
            setIsSigningOut(false);
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
      setIsSigningOut(false);
    }
  };

  if (!session) {
    if (isPublicPath) {
      return (
        <Link
          href="/auth"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <LogIn className="w-4 h-4" aria-hidden="true" />
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

  const userAccountLabel = user?.name ? `Account menu for ${user.name}` : "Account menu";

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-secondary transition-colors border border-transparent hover:border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group cursor-pointer"
              aria-label={userAccountLabel}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 flex items-center justify-center text-white font-medium text-xs shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              {showLabel && (
                <span className="text-sm font-medium hidden sm:inline text-foreground">
                  {user?.name || "User"}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{userAccountLabel}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto p-2" align="end" sideOffset={8}>
        <div className="px-3 py-2 border-b border-border mb-2">
          <p className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</p>
          {user?.email && (
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 min-w-[320px]">
          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/profile" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <UserCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                <span className="text-[10px] font-medium text-foreground">Profile</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/notifications" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                <span className="text-[10px] font-medium text-foreground">Notifications</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/wishlist" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                <span className="text-[10px] font-medium text-foreground">Wishlist</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="focus:bg-transparent p-0">
             <Link href="/app/settings" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors text-center w-full h-20 group">
                <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                <span className="text-[10px] font-medium text-foreground">Settings</span>
             </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={handleSignOut}
          className="flex items-center gap-2 p-2.5 text-xs font-medium text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
        >
          {isSigningOut ? (
            <Spinner className="w-4 h-4 text-destructive" />
          ) : (
            <LogOut className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
