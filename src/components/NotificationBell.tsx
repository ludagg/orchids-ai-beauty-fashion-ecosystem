"use client";

import { useState, useEffect } from "react";
import { Bell, Package, Sparkles, Heart, MessageSquare, Calendar, Info, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type Notification = {
  id: string;
  type: 'booking' | 'message' | 'system' | 'order' | 'promotion';
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return { icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" };
      case "message":
        return { icon: MessageSquare, color: "text-green-500", bg: "bg-green-50" };
      case "order":
        return { icon: Package, color: "text-orange-500", bg: "bg-orange-50" };
      case "promotion":
        return { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" };
      default:
        return { icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              className="p-2 rounded-full hover:bg-secondary transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-card"></span>
              )}
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary font-medium hover:underline"
              aria-label="Mark all notifications as read"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground" role="status">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground" role="status">
              No notifications
            </div>
          ) : (
            <ul role="list" className="m-0 p-0 list-none">
              {notifications.map((notification) => {
                const style = getIcon(notification.type);
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-4 flex gap-3 hover:bg-secondary transition-colors cursor-pointer border-b border-border last:border-0 ${
                        !notification.isRead ? "bg-secondary/30" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${style.bg} dark:bg-primary/10 flex items-center justify-center flex-shrink-0`}
                      >
                        <style.icon className={`w-5 h-5 ${style.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-foreground leading-snug ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground opacity-70 mt-1 uppercase font-semibold tracking-wider">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="p-2 border-t border-border bg-card">
          <Link
            href="/app/notifications"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center text-xs font-medium text-muted-foreground hover:text-primary py-2 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
