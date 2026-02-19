"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  Sparkles,
  MessageSquare,
  Calendar,
  Info,
  Check,
  Loader2
} from "lucide-react";
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
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
      router.push(notification.link);
    }
  };

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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm">We'll let you know when something important happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const style = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 flex gap-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-secondary/30" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${style.bg} dark:bg-primary/10 flex items-center justify-center flex-shrink-0`}
                  >
                    <style.icon className={`w-6 h-6 ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-base leading-tight ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                         <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground opacity-70 mt-2 uppercase font-semibold tracking-wider">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
