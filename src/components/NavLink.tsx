"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  isCollapsed: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  iconClassName?: string;
}

export function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  className,
  activeClassName = "bg-primary text-primary-foreground shadow-lg shadow-foreground/10",
  inactiveClassName = "text-muted-foreground hover:bg-secondary hover:text-foreground",
  iconClassName,
}: NavLinkProps) {
  const content = (
    <Link
      href={href}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
        isActive ? activeClassName : inactiveClassName,
        isCollapsed ? "justify-center" : "",
        className
      )}
      aria-label={isCollapsed ? label : undefined}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", iconClassName)} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
