"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  CreditCard,
  UserCircle,
  ChevronDown,
  LayoutDashboard,
  LogIn
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

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
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/app/profile" className="flex items-center w-full">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/app/creator-studio" className="flex items-center w-full">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Creator Studio</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/app/billing" className="flex items-center w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/app/settings" className="flex items-center w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
