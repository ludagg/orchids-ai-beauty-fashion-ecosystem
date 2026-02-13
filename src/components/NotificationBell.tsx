"use client";

import { Bell, Package, Sparkles, Heart } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const notifications = [
  {
    id: 1,
    title: "Order Delivered",
    description: "Your Summer Minimalist Dress has been delivered.",
    time: "2h ago",
    icon: Package,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    title: "New AI Recommendations",
    description: "We've found 3 new styles matching your profile.",
    time: "5h ago",
    icon: Sparkles,
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    id: 3,
    title: "Price Drop",
    description: "An item in your wishlist is now 20% off.",
    time: "1d ago",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

export default function NotificationBell({ "aria-label": ariaLabel = "Notifications" }: { "aria-label"?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={ariaLabel}
          className="p-2 rounded-full hover:bg-secondary transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-card"></span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <button className="text-xs text-primary font-medium hover:underline">
            Mark all as read
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 flex gap-3 hover:bg-secondary transition-colors cursor-pointer border-b border-border last:border-0"
            >
              <div className={`w-10 h-10 rounded-full ${notification.bg} dark:bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                <notification.icon className={`w-5 h-5 ${notification.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {notification.description}
                </p>
                <p className="text-[10px] text-muted-foreground opacity-70 mt-1 uppercase font-semibold tracking-wider">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border text-center">
          <button className="text-sm font-medium text-foreground hover:underline">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
