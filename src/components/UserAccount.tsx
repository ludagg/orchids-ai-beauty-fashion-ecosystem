"use client";

import {
  User,
  Settings,
  LogOut,
  CreditCard,
  UserCircle,
  ChevronDown
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

export default function UserAccount({ showLabel = true }: { showLabel?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[#f5f5f5] transition-colors border border-transparent hover:border-[#e5e5e5] outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 flex items-center justify-center text-white font-medium text-xs shadow-sm group-hover:shadow-md transition-shadow">
            JD
          </div>
          {showLabel && (
            <span className="text-sm font-medium hidden sm:inline text-[#1a1a1a]">Guest User</span>
          )}
          <ChevronDown className="w-4 h-4 text-[#6b6b6b] group-hover:text-[#1a1a1a] transition-colors hidden sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-[#1a1a1a]">Jane Doe</p>
            <p className="text-xs leading-none text-[#6b6b6b]">jane.doe@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
