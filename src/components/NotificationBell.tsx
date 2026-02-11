"use client";

import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button className="p-2 rounded-full hover:bg-[#f5f5f5] transition-colors relative">
      <Bell className="w-5 h-5 text-[#6b6b6b]" />
      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
    </button>
  );
}
