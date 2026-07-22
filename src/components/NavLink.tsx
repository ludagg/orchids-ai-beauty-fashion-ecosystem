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
  isActive?: boolean;
  isCollapsed?: boolean;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export function NavLink({
  href,
  label,
  icon: Icon,
  isActive = false,
  isCollapsed = false,
  className = "",
  iconClassName = "",
  onClick,
}: NavLinkProps) {
  const linkElement = (
    <Link
      href={href}
      onClick={onClick}
      className={className}
      aria-label={isCollapsed ? label : undefined}
    >
      <Icon className={iconClassName} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {linkElement}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkElement;
}
