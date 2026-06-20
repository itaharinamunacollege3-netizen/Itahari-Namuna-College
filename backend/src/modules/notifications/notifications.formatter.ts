import type { Notification, NotificationType } from "../../generated/prisma/client";
import type { NotificationDto, NotificationTypeApi } from "./notifications.types";

const typeToApi: Record<NotificationType, NotificationTypeApi> = {
  ADMISSION_NEW: "admission_new",
  CONTACT_NEW: "contact_new",
  ADMISSION_STATUS: "admission_status",
  SYSTEM: "system",
};

const apiToDb: Record<NotificationTypeApi, NotificationType> = {
  admission_new: "ADMISSION_NEW",
  contact_new: "CONTACT_NEW",
  admission_status: "ADMISSION_STATUS",
  system: "SYSTEM",
};

export function mapNotificationTypeToApi(type: NotificationType): NotificationTypeApi {
  return typeToApi[type];
}

export function mapNotificationTypeToDb(type: NotificationTypeApi): NotificationType {
  return apiToDb[type];
}

export function formatNotification(notification: Notification): NotificationDto {
  return {
    id: notification.id,
    type: typeToApi[notification.type],
    title: notification.title,
    message: notification.message,
    data: (notification.data as NotificationDto["data"]) ?? null,
    isRead: notification.isRead,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
}
