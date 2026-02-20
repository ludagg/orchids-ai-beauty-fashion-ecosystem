import { db } from "@/lib/db";
import { notifications } from "@/db/schema/notifications"; // Fix import path to specific file to avoid circular deps if any
import { nanoid } from "nanoid";

type NotificationType = "booking" | "message" | "system" | "order" | "promotion" | "review";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, link, metadata } = params;

  try {
    const notificationId = nanoid();
    await db.insert(notifications).values({
      id: notificationId,
      userId,
      type,
      title,
      message,
      link,
      metadata,
      isRead: false,
      createdAt: new Date(),
    });
    return notificationId;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}
