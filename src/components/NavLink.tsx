"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCollapsed: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

/**
 * [Jules - Palette UX Improvement]
 * Highly accessible and polished Navigation Link component.
 * Automatically handles screen-reader context (aria-current, aria-label)
 * and wraps items with beautiful Radix UI Tooltips when collapsed.
 */
export function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
}: NavLinkProps) {
  const linkContent = (
    <Link
      href={href}
      className={`${className} ${
        isActive ? activeClassName : inactiveClassName
      } ${isCollapsed ? "justify-center" : ""}`}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
